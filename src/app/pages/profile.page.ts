import { Component, inject } from '@angular/core';
import { IonContent, NavController } from '@ionic/angular';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [IonContent],
  template: `
    <ion-content>
      <div class="wrap">
        <header class="hero">
          <h1 class="display-xl">Perfil</h1>
        </header>
        <div class="section-gap">
          <p class="display-m" style="margin:0">{{ auth.user()?.name }}</p>
          <p class="muted" style="margin:6px 0 0">{{ auth.user()?.email }}</p>
        </div>
        <div class="section-gap">
          <button type="button" class="btn btn-block" (click)="logout()">Cerrar sesión</button>
        </div>
        <p class="note" style="margin-top:28px">Versión de demostración: las rutinas y Hercules usan datos de ejemplo y no se guardan al recargar.</p>
      </div>
    </ion-content>
  `,
})
export class ProfilePage {
  readonly auth = inject(AuthService);
  private readonly nav = inject(NavController);
  async logout() {
    this.auth.logout();
    await this.nav.navigateRoot('/login');
  }
}
