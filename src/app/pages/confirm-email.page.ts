import { Component, inject, signal } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { IonContent } from '@ionic/angular';
import { API_URL, SKIP_AUTH, apiMessage } from '../core/api';
import { LogoComponent } from '../ui/logo.component';

type State = 'working' | 'ok' | 'error';

/**
 * Destino del enlace que envía el backend al registrarse: confirma el correo con el token
 * recibido por email y avisa de si ha funcionado.
 */
@Component({
  selector: 'app-confirm-email',
  standalone: true,
  imports: [IonContent, RouterLink, LogoComponent],
  template: `
    <ion-content>
      <div class="auth">
        <div class="brand"><app-logo [size]="42" /><span class="wordmark">Hercufy</span></div>
        @switch (state()) {
          @case ('working') {
            <h1 class="auth-title">Confirmando tu correo…</h1>
            <p class="auth-sub">Un momento.</p>
          }
          @case ('ok') {
            <h1 class="auth-title">Correo confirmado.</h1>
            <p class="auth-sub">Ya puedes entrar y empezar con tu rutina.</p>
            <a class="btn btn-primary btn-block" routerLink="/login">Ir a entrar</a>
          }
          @case ('error') {
            <h1 class="auth-title">No hemos podido confirmarlo.</h1>
            <p class="auth-sub">{{ message() }}</p>
            <a class="btn btn-ghost btn-block" routerLink="/login">Volver al acceso</a>
          }
        }
      </div>
    </ion-content>
  `,
})
export class ConfirmEmailPage {
  private readonly http = inject(HttpClient);
  private readonly route = inject(ActivatedRoute);

  readonly state = signal<State>('working');
  readonly message = signal('');

  constructor() {
    void this.confirm();
  }

  private async confirm(): Promise<void> {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.state.set('error');
      this.message.set('El enlace no incluye el token de confirmación.');
      return;
    }
    try {
      await firstValueFrom(
        this.http.get(`${API_URL}/auth/confirm-email`, {
          params: { token },
          responseType: 'text',
          context: new HttpContext().set(SKIP_AUTH, true),
        }),
      );
      this.state.set('ok');
    } catch (e) {
      this.state.set('error');
      this.message.set(apiMessage(e, 'El enlace no es válido o ha caducado.'));
    }
  }
}