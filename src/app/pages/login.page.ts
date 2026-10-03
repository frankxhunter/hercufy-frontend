import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IonContent, ToastController } from '@ionic/angular';
import { AuthService } from '../core/services/auth.service';
import { LogoComponent } from '../ui/logo.component';
import { showToast } from '../core/util';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonContent, FormsModule, RouterLink, LogoComponent],
  template: `
    <ion-content>
      <div class="auth">
        <div class="brand"><app-logo [size]="42" /><span class="wordmark">Hercufy</span></div>
        <h1 class="auth-title">Tu rutina, lista cuando llegas al gimnasio.</h1>
        <p class="auth-sub">Consulta qué te toca hoy, sube el peso cuando toque y deja que Hercules te arme la rutina.</p>

        <form (ngSubmit)="submit()">
          <label class="field-label" for="email">Correo electrónico</label>
          <input id="email" name="email" class="field" type="email" autocomplete="email" [(ngModel)]="email" />
          <label class="field-label" for="password">Contraseña</label>
          <input id="password" name="password" class="field" type="password" autocomplete="current-password" [(ngModel)]="password" />
          @if (error()) { <p class="form-error" role="alert">{{ error() }}</p> }
          @if (notice()) { <p class="note" role="status">{{ notice() }}</p> }
          <button class="btn btn-primary btn-block" type="submit" [disabled]="busy()">{{ busy() ? 'Entrando…' : 'Entrar' }}</button>
        </form>
        <p class="switch">¿Primera vez aquí? <a routerLink="/registro">Crear cuenta</a></p>
      </div>
    </ion-content>
  `,
})
export class LoginPage {
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toastCtrl = inject(ToastController);

  email = '';
  password = '';
  error = signal('');
  notice = signal('');
  busy = signal(false);

  constructor() {
    // Si acaban de confirmar el correo, se viene del registro con un aviso.
    this.route.snapshot.queryParamMap.get('registered')
      ? this.notice.set('Cuenta creada. Confirma tu correo y ya podrás entrar.')
      : this.notice.set('');
  }

  async submit() {
    this.error.set('');
    this.notice.set('');
    this.busy.set(true);
    try {
      await this.auth.login(this.email.trim(), this.password);
      await showToast(this.toastCtrl, 'Sesión iniciada');
      await this.router.navigateByUrl(this.returnUrl());
    } catch (e) {
      this.error.set((e as Error).message);
    } finally {
      this.busy.set(false);
    }
  }

  private returnUrl(): string {
    const to = this.route.snapshot.queryParamMap.get('returnUrl');
    // Solo rutas internas: nada de redirigir fuera de la aplicación.
    return to && to.startsWith('/') && !to.startsWith('//') ? to : '/tabs/hoy';
  }
}