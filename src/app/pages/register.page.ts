import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonContent, NavController } from '@ionic/angular';
import { AuthService } from '../core/services/auth.service';
import { LogoComponent } from '../ui/logo.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [IonContent, FormsModule, RouterLink, LogoComponent],
  template: `
    <ion-content>
      <div class="auth">
        <div class="brand"><app-logo [size]="42" /><span class="wordmark">Hercufy</span></div>
        <h1 class="auth-title">Crea tu cuenta.</h1>
        <p class="auth-sub">Tus rutinas te esperan en cualquier dispositivo.</p>
        <form (ngSubmit)="submit()">
          <label class="field-label" for="name">Nombre</label>
          <input id="name" name="name" class="field" type="text" autocomplete="given-name" [(ngModel)]="name" />
          <label class="field-label" for="email">Correo electrónico</label>
          <input id="email" name="email" class="field" type="email" autocomplete="email" [(ngModel)]="email" />
          <label class="field-label" for="password">Contraseña</label>
          <input id="password" name="password" class="field" type="password" autocomplete="new-password" [(ngModel)]="password" />
          @if (error()) { <p class="form-error" role="alert">{{ error() }}</p> }
          <button class="btn btn-primary btn-block" type="submit" [disabled]="busy()">{{ busy() ? 'Creando…' : 'Crear cuenta' }}</button>
        </form>
        <p class="switch">¿Ya tienes cuenta? <a routerLink="/login">Entrar</a></p>
      </div>
    </ion-content>
  `,
})
export class RegisterPage {
  private readonly auth = inject(AuthService);
  private readonly nav = inject(NavController);
  name = '';
  email = '';
  password = '';
  error = signal('');
  busy = signal(false);

  async submit() {
    this.error.set('');
    this.busy.set(true);
    try {
      await this.auth.register(this.name, this.email.trim(), this.password);
      await this.nav.navigateRoot('/tabs/hoy');
    } catch (e) {
      this.error.set((e as Error).message);
    } finally {
      this.busy.set(false);
    }
  }
}
