import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonContent, ToastController } from '@ionic/angular';
import { AuthService } from '../core/services/auth.service';
import { LogoComponent } from '../ui/logo.component';
import { showToast } from '../core/util';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [IonContent, FormsModule, RouterLink, LogoComponent, TranslatePipe],
  template: `
    <ion-content>
      <div class="auth">
        <div class="brand"><app-logo [size]="42" /><span class="wordmark">Hercufy</span></div>
        @if (!done()) {
          <h1 class="auth-title">{{ 'auth.register.title' | translate }}</h1>
          <p class="auth-sub">{{ 'auth.register.subtitle' | translate }}</p>
          <form (ngSubmit)="submit()">
            <label class="field-label" for="name">{{ 'auth.register.nameLabel' | translate }}</label>
            <input id="name" name="name" class="field" type="text" autocomplete="given-name" [(ngModel)]="name" />
            <label class="field-label" for="email">{{ 'auth.register.emailLabel' | translate }}</label>
            <input id="email" name="email" class="field" type="email" autocomplete="email" [(ngModel)]="email" />
            <label class="field-label" for="password">{{ 'auth.register.passwordLabel' | translate }}</label>
            <input id="password" name="password" class="field" type="password" autocomplete="new-password" [(ngModel)]="password" />
            <p class="field-label">{{ 'auth.register.passwordHint' | translate }}</p>
            @if (error()) { <p class="form-error" role="alert">{{ error() }}</p> }
            <button class="btn btn-primary btn-block" type="submit" [disabled]="busy()">{{ busy() ? ('auth.register.submitting' | translate) : ('auth.register.submit' | translate) }}</button>
          </form>
          <p class="switch">{{ 'auth.register.switchText' | translate }} <a routerLink="/login">{{ 'auth.register.loginLink' | translate }}</a></p>
        } @else {
          <h1 class="auth-title">{{ 'auth.register.checkEmailTitle' | translate }}</h1>
          <p class="auth-sub">{{ message() }}</p>
          <a class="btn btn-primary btn-block" routerLink="/login">{{ 'auth.register.goToLogin' | translate }}</a>
        }
      </div>
    </ion-content>
  `,
})
export class RegisterPage {
  private readonly auth = inject(AuthService);
  private readonly toastCtrl = inject(ToastController);
  private readonly translate = inject(TranslateService);

  name = '';
  email = '';
  password = '';
  error = signal('');
  busy = signal(false);
  done = signal(false);
  message = signal('');

  async submit() {
    this.error.set('');
    this.busy.set(true);
    try {
      this.message.set(await this.auth.register(this.name, this.email.trim(), this.password));
      this.done.set(true);
      await showToast(this.toastCtrl, this.translate.instant('auth.register.toastSuccess'));
    } catch (e) {
      this.error.set((e as Error).message);
    } finally {
      this.busy.set(false);
    }
  }
}