import { Component, inject, signal } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { IonContent } from '@ionic/angular';
import { API_URL, SKIP_AUTH, apiMessage } from '../core/api';
import { LogoComponent } from '../ui/logo.component';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';

type State = 'working' | 'ok' | 'error';

/**
 * Destino del enlace que envía el backend al registrarse: confirma el correo con el token
 * recibido por email y avisa de si ha funcionado.
 */
@Component({
  selector: 'app-confirm-email',
  standalone: true,
  imports: [IonContent, RouterLink, LogoComponent, TranslatePipe],
  template: `
    <ion-content>
      <div class="auth">
        <div class="brand"><app-logo [size]="42" /><span class="wordmark">Hercufy</span></div>
        @switch (state()) {
          @case ('working') {
            <h1 class="auth-title">{{ 'auth.confirmEmail.workingTitle' | translate }}</h1>
            <p class="auth-sub">{{ 'auth.confirmEmail.workingSubtitle' | translate }}</p>
          }
          @case ('ok') {
            <h1 class="auth-title">{{ 'auth.confirmEmail.successTitle' | translate }}</h1>
            <p class="auth-sub">{{ 'auth.confirmEmail.successSubtitle' | translate }}</p>
            <a class="btn btn-primary btn-block" routerLink="/login">{{ 'auth.confirmEmail.goToLogin' | translate }}</a>
          }
          @case ('error') {
            <h1 class="auth-title">{{ 'auth.confirmEmail.errorTitle' | translate }}</h1>
            <p class="auth-sub">{{ message() }}</p>
            <a class="btn btn-ghost btn-block" routerLink="/login">{{ 'auth.confirmEmail.backToLogin' | translate }}</a>
          }
        }
      </div>
    </ion-content>
  `,
})
export class ConfirmEmailPage {
  private readonly http = inject(HttpClient);
  private readonly route = inject(ActivatedRoute);
  private readonly translate = inject(TranslateService);

  readonly state = signal<State>('working');
  readonly message = signal('');

  constructor() {
    void this.confirm();
  }

  private async confirm(): Promise<void> {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.state.set('error');
      this.message.set(this.translate.instant('errors.invalidToken'));
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
      this.message.set(apiMessage(e, this.translate.instant('errors.invalidToken')));
    }
  }
}