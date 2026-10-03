import { Component, inject, signal } from '@angular/core';
import { AlertController, IonContent, IonIcon, NavController, ToastController } from '@ionic/angular';
import { AuthService } from '../core/services/auth.service';
import { UserService } from '../core/services/user.service';
import { showToast } from '../core/util';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [IonContent, IonIcon],
  template: `
    <ion-content>
      <div class="wrap">
        <header class="hero">
          <h1 class="display-xl">Perfil</h1>
        </header>
        <div class="section-gap">
          <div style="display:flex;align-items:center;gap:12px">
            <div style="flex:1;min-width:0">
              <p class="display-m" style="margin:0">{{ auth.user()?.name }}</p>
              <p class="muted" style="margin:6px 0 0">{{ auth.user()?.email }}</p>
            </div>
            <button type="button" class="icon-btn" (click)="rename()" aria-label="Cambiar nombre"><ion-icon name="create-outline" /></button>
          </div>
          @if (auth.user() && !auth.user()!.emailVerified) {
            <p class="note" style="margin-top:12px">Tu correo aún no está confirmado.</p>
          }
        </div>

        <div class="section-gap">
          <button type="button" class="btn btn-block" (click)="refresh()">Actualizar mis datos</button>
          <button type="button" class="btn btn-block btn-danger" (click)="remove()">Eliminar mi cuenta</button>
          <button type="button" class="btn btn-primary btn-block" style="margin-top:12px" (click)="logout()">Cerrar sesión</button>
        </div>

        <p class="note" style="margin-top:28px">Tus rutinas y tu catálogo se guardan en el servidor: los verás igual desde cualquier dispositivo.</p>
      </div>
    </ion-content>
  `,
})
export class ProfilePage {
  readonly auth = inject(AuthService);
  private readonly users = inject(UserService);
  private readonly nav = inject(NavController);
  private readonly alerts = inject(AlertController);
  private readonly toastCtrl = inject(ToastController);
  private busy = signal(false);

  async rename() {
    const current = this.auth.user();
    if (!current) return;
    const a = await this.alerts.create({
      header: 'Tu nombre',
      inputs: [{ name: 'name', type: 'text', value: current.name, placeholder: 'Cómo te llamamos' }],
      buttons: [{ text: 'Cancelar', role: 'cancel' }, { text: 'Guardar', role: 'confirm' }],
    });
    await a.present();
    const { data, role } = await a.onDidDismiss();
    const name = String(data?.values?.name ?? '').trim();
    if (role !== 'confirm' || !name) return;

    await this.guard(async () => {
      const updated = await this.users.updateUsername(name);
      this.auth.setUser(updated);
      await showToast(this.toastCtrl, 'Nombre actualizado');
    });
  }

  async refresh() {
    await this.guard(async () => {
      await this.auth.reloadProfile();
      await showToast(this.toastCtrl, 'Datos actualizados');
    });
  }

  async remove() {
    const a = await this.alerts.create({
      header: '¿Eliminar tu cuenta?',
      message: 'Se borrarán tu cuenta, tus rutinas y tu sesión. No se puede deshacer.',
      buttons: [{ text: 'Cancelar', role: 'cancel' }, { text: 'Eliminar', role: 'confirm' }],
    });
    await a.present();
    const { role } = await a.onDidDismiss();
    if (role !== 'confirm') return;

    await this.guard(async () => {
      await this.users.deleteAccount();
      this.auth.clear();
      await this.nav.navigateRoot('/login');
    });
  }

  async logout() {
    this.busy.set(true);
    try {
      await this.auth.logout();
      await this.nav.navigateRoot('/login');
    } finally {
      this.busy.set(false);
    }
  }

  /** Ejecuta una acción contra el servidor y muestra el error si no sale. */
  private async guard(action: () => Promise<void>) {
    if (this.busy()) return;
    this.busy.set(true);
    try {
      await action();
    } catch (e) {
      await showToast(this.toastCtrl, (e as Error).message);
    } finally {
      this.busy.set(false);
    }
  }
}