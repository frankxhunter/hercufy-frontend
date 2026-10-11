import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IonContent, ToastController } from '@ionic/angular';
import { AuthService } from '../core/services/auth.service';
import { LogoComponent } from '../ui/logo.component';
import { showToast } from '../core/util';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonContent, FormsModule, RouterLink, LogoComponent, TranslatePipe],
  template: `
    <ion-content>
      <div class="auth">
        <div class="brand"><app-logo [size]="42" /><span class="wordmark">Hercufy</span></div>
        <h1 class="auth-title">{{ 'auth.login.title' | translate }}</h1>
        <p class="auth-sub">{{ 'auth.login.subtitle' | translate }}</p>

        <form (ngSubmit)="submit()">
          <label class="field-label" for="email">{{ 'auth.login.emailLabel' | translate }}</label>
          <input id="email" name="email" class="field" type="email" autocomplete="email" [(ngModel)]="email" />
          <label class="field-label" for="password">{{ 'auth.login.passwordLabel' | translate }}</label>
          <input id="password" name="password" class="field" type="password" autocomplete="current-password" [(ngModel)]="password" />
          @if (error()) { <p class="form-error" role="alert">{{ error() }}</p> }
          @if (notice()) { <p class="note" role="status">{{ notice() }}</p> }
          <button class="btn btn-primary btn-block" type="submit" [disabled]="busy()">{{ busy() ? ('auth.login.submitting' | translate) : ('auth.login.submit' | translate) }}</button>
        </form>
        <p class="switch">{{ 'auth.login.switchText' | translate }} <a routerLink="/registro">{{ 'auth.login.registerLink' | translate }}</a></p>
      </div>
    </ion-content>
  `,
})
export class LoginPage {
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toastCtrl = inject(ToastController);
  private readonly translate = inject(TranslateService);

  email = '';
  password = '';
  error = signal('');
  notice = signal('');
  busy = signal(false);

  constructor() {
    this.route.snapshot.queryParamMap.get('registered')
      ? this.notice.set(this.translate.instant('auth.login.registeredNotice'))
      : this.notice.set('');
  }

  async submit() {
    this.error.set('');
    this.notice.set('');
    this.busy.set(true);
    try {
      await this.auth.login(this.email.trim(), this.password);
      await showToast(this.toastCtrl, this.translate.instant('auth.login.toastSuccess'));
      await this.router.navigateByUrl(this.returnUrl());
    } catch (e) {
      this.error.set((e as Error).message);
    } finally {
      this.busy.set(false);
    }
  }

  private returnUrl(): string {
    const to = this.route.snapshot.queryParamMap.get('returnUrl');
    return to && to.startsWith('/') && !to.startsWith('//') ? to : '/tabs/hoy';
  }
}