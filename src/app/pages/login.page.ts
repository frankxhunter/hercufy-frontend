import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonContent, NavController } from '@ionic/angular';
import { AuthService } from '../core/services/auth.service';
import { LogoComponent } from '../ui/logo.component';

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
          <button class="btn btn-primary btn-block" type="submit" [disabled]="busy()">{{ busy() ? 'Entrando…' : 'Entrar' }}</button>
        </form>
        <button class="btn btn-ghost btn-block" type="button" (click)="demo()">Probar con una cuenta de demostración</button>
        <p class="switch">¿Primera vez aquí? <a routerLink="/registro">Crear cuenta</a></p>
      </div>
    </ion-content>
  `,
})
export class LoginPage {
  private readonly auth = inject(AuthService);
  private readonly nav = inject(NavController);
  email = '';
  password = '';
  error = signal('');
  busy = signal(false);

  async submit() {
    this.error.set('');
    this.busy.set(true);
    try {
      await this.auth.login(this.email.trim(), this.password);
      await this.nav.navigateRoot('/tabs/hoy');
    } catch (e) {
      this.error.set((e as Error).message);
    } finally {
      this.busy.set(false);
    }
  }

  async demo() {
    this.auth.demo();
    await this.nav.navigateRoot('/tabs/hoy');
  }
}
