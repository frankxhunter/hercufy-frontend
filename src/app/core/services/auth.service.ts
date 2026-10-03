import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { CanActivateFn, Router } from '@angular/router';
import { firstValueFrom, catchError, throwError } from 'rxjs';
import { API_URL, AuthResponse, SKIP_AUTH, apiMessage } from '../api';
import { User } from '../models';
import { UserService } from './user.service';

const STORAGE_KEY = 'hercufy.session';

/** Lo que se guarda en el navegador para poder reabrir la sesión sin pedir credenciales. */
interface StoredSession {
  token: string;
  refreshToken: string;
  email: string;
  expiresAt: number;
}

const plain = () => new HttpContext().set(SKIP_AUTH, true);

/** Margen de seguridad: no se lanza una llamada con un token a punto de caducar. */
const EXPIRY_MARGIN_MS = 30_000;

/**
 * Sesión real contra el backend: access token (JWT corto) + refresh token (largo, con
 * rotación en cada uso). Ambos se guardan en localStorage para que recargar la página no
 * tire la sesión; el access token también vive en un signal para no releerlo en cada
 * petición. Si el almacenamiento no está disponible, la sesión solo dura lo que la pestaña.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly users = inject(UserService);

  readonly user = signal<User | null>(null);
  readonly ready = signal(false);

  private readonly access = signal<string | null>(null);
  private readonly refresh = signal<string | null>(null);
  private expiresAt = 0;
  private inFlight: Promise<string | null> | null = null;

  accessToken(): string | null {
    return this.access();
  }

  refreshToken(): string | null {
    return this.refresh();
  }

  authenticated = computed(() => this.user() !== null);

  /** Restaura la sesión guardada al arrancar la aplicación. */
  async restore(): Promise<void> {
    try {
      const stored = this.read();
      if (stored) {
        this.access.set(stored.token);
        this.refresh.set(stored.refreshToken);
        this.expiresAt = stored.expiresAt;
        if (stored.expiresAt <= Date.now() && !(await this.renew())) return;
        await this.loadProfile();
      }
    } finally {
      this.ready.set(true);
    }
  }

  async login(email: string, password: string): Promise<void> {
    const res = await this.post<AuthResponse>('/auth/login', { email: email.trim(), password });
    this.store(res);
    await this.loadProfile();
  }

  /**
   * El registro no abre sesión: el backend exige confirmar el correo antes de dejar entrar,
   * así que devuelve el texto que explica qué hacer a continuación.
   */
  async register(name: string, email: string, password: string): Promise<string> {
    const message = await firstValueFrom(
      this.http.post(`${API_URL}/auth/register`, { username: name.trim(), email: email.trim(), password }, {
        context: plain(),
        responseType: 'text',
      }).pipe(catchError((e) => throwError(() => new Error(apiMessage(e))))),
    );
    return typeof message === 'string' ? message : 'Cuenta creada.';
  }

  async logout(): Promise<void> {
    const token = this.refresh();
    this.clear();
    if (!token) return;
    // El backend revoca el refresh token. Si la petición falla, la sesión local ya está
    // cerrada igualmente, así que un error aquí no se propaga.
    await firstValueFrom(this.http.post(`${API_URL}/auth/logout`, { refreshToken: token }, { context: plain() }))
      .catch(() => undefined);
  }

  /**
   * Renueva el access token usando el refresh token. Varias llamadas simultáneas comparten
   * la misma promesa: el backend rota el refresh token en cada uso, así que refrescar en
   * paralelo invalidaría la sesión.
   */
  renew(): Promise<string | null> {
    if (this.inFlight) return this.inFlight;
    const token = this.refresh();
    if (!token) return Promise.resolve(null);

    this.inFlight = this.post<AuthResponse>('/auth/refresh', { refreshToken: token })
      .then((res) => {
        this.store(res);
        return res.token;
      })
      .catch(() => {
        this.clear();
        return null;
      })
      .finally(() => {
        this.inFlight = null;
      });
    return this.inFlight;
  }

  /** ¿Hay un access token utilizable? Lo renueva si ya caducó. */
  async usable(): Promise<boolean> {
    if (!this.access()) return false;
    if (this.expiresAt <= Date.now() && !(await this.renew())) return false;
    return true;
  }

  /** Estado de sesión válido para el guard: tokens frescos y perfil del usuario. */
  async ensureSession(): Promise<boolean> {
    if (!(await this.usable())) return false;
    if (!this.user()) await this.loadProfile();
    return this.user() !== null;
  }

  /** Refresca los datos del usuario (tras editar el perfil, por ejemplo). */
  async reloadProfile(): Promise<void> {
    await this.loadProfile();
  }

  /** Actualiza el perfil en memoria tras un cambio confirmado por el servidor. */
  setUser(user: User): void {
    this.user.set(user);
  }

  clear(): void {
    this.access.set(null);
    this.refresh.set(null);
    this.expiresAt = 0;
    this.user.set(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Modo privado o almacenamiento deshabilitado: la sesión vive solo en memoria.
    }
  }

  private async loadProfile(): Promise<void> {
    try {
      this.user.set(await this.users.me());
    } catch {
      this.user.set(null);
    }
  }

  private post<T>(path: string, body: unknown): Promise<T> {
    return firstValueFrom(
      this.http.post<T>(`${API_URL}${path}`, body, { context: plain() }).pipe(
        catchError((e) => throwError(() => new Error(apiMessage(e)))),
      ),
    );
  }

  private store(res: AuthResponse): void {
    const expiresAt = Date.now() + Math.max(0, res.expiresInMs - EXPIRY_MARGIN_MS);
    this.access.set(res.token);
    this.refresh.set(res.refreshToken);
    this.expiresAt = expiresAt;
    try {
      const session: StoredSession = {
        token: res.token,
        refreshToken: res.refreshToken,
        email: res.email,
        expiresAt,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch {
      // Sin almacenamiento la sesión sigue viva mientras la pestaña no se cierre.
    }
  }

  private read(): StoredSession | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as StoredSession) : null;
    } catch {
      return null;
    }
  }
}

/**
 * Entra al perfil: sin sesión válida, al formulario de acceso indicando a dónde iba.
 * Router se inyecta antes de cualquier await: al reanudar tras un await, Angular ya ha
 * salido del contexto de inyección y inject() fallaría con NG0203.
 */
export const authGuard: CanActivateFn = async (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (await auth.ensureSession()) return true;
  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};

/** Al revés: quien ya tiene sesión no necesita ver el login ni el registro. */
export const guestGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.user() || (await auth.ensureSession())) return router.createUrlTree(['/tabs/hoy']);
  return true;
};