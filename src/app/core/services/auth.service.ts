import { Injectable, signal } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { User } from '../models';

const KEY = 'hercufy.mock.session';
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Autenticación simulada: acepta cualquier correo con contraseña de 6+ caracteres. */
@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly user = signal<User | null>(this.restore());

  async login(email: string, password: string): Promise<void> {
    await wait(350);
    if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error('Escribe un correo válido.');
    if (password.length < 6) throw new Error('La contraseña debe tener al menos 6 caracteres.');
    this.set({ id: 'u1', name: this.nameFrom(email), email });
  }

  async register(name: string, email: string, password: string): Promise<void> {
    await wait(450);
    if (!name.trim()) throw new Error('Escribe tu nombre.');
    if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error('Escribe un correo válido.');
    if (password.length < 6) throw new Error('La contraseña debe tener al menos 6 caracteres.');
    this.set({ id: 'u1', name: name.trim(), email });
  }

  demo(): void {
    this.set({ id: 'u1', name: 'Frank', email: 'demo@hercufy.app' });
  }

  logout(): void {
    this.user.set(null);
    try { sessionStorage.removeItem(KEY); } catch { /* sin almacenamiento */ }
  }

  private set(u: User) {
    this.user.set(u);
    try { sessionStorage.setItem(KEY, JSON.stringify(u)); } catch { /* sin almacenamiento */ }
  }

  private restore(): User | null {
    try { return JSON.parse(sessionStorage.getItem(KEY) ?? 'null'); } catch { return null; }
  }

  private nameFrom(email: string) {
    const n = email.split('@')[0].replace(/[._-]+/g, ' ');
    return n.charAt(0).toUpperCase() + n.slice(1);
  }
}

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.user() ? true : inject(Router).createUrlTree(['/login']);
};
