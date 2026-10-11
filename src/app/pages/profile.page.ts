import { Component, inject, signal } from '@angular/core';
import { AlertController, IonContent, IonIcon, NavController, ToastController } from '@ionic/angular';
import { AuthService } from '../core/services/auth.service';
import { UserService } from '../core/services/user.service';
import { showToast } from '../core/util';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { LanguageSelectorComponent } from '../ui/language-selector.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [IonContent, IonIcon, LanguageSelectorComponent, TranslatePipe],
  template: `
    <ion-content>
      <div class="wrap">
        <header class="hero">
          <h1 class="display-xl">{{ 'auth.profile.title' | translate }}</h1>
        </header>
        <div class="section-gap">
          <div style="display:flex;align-items:center;gap:12px">
            <div style="flex:1;min-width:0">
              <p class="display-m" style="margin:0">{{ auth.user()?.name }}</p>
              <p class="muted" style="margin:6px 0 0">{{ auth.user()?.email }}</p>
            </div>
            <button type="button" class="icon-btn" (click)="rename()" [aria-label]="'auth.profile.renameAria' | translate"><ion-icon name="create-outline" /></button>
          </div>
          @if (auth.user() && !auth.user()!.emailVerified) {
            <p class="note" style="margin-top:12px">{{ 'auth.profile.emailNotVerified' | translate }}</p>
          }
        </div>

        <div class="section-gap">
          <app-language-selector />
          <button type="button" class="btn btn-block" (click)="refresh()">{{ 'auth.profile.updateData' | translate }}</button>
          <button type="button" class="btn btn-block btn-danger" (click)="remove()">{{ 'auth.profile.deleteAccount' | translate }}</button>
          <button type="button" class="btn btn-primary btn-block" style="margin-top:12px" (click)="logout()">{{ 'auth.profile.logout' | translate }}</button>
        </div>

        <p class="note" style="margin-top:28px">{{ 'auth.profile.dataSynced' | translate }}</p>
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
  private readonly translate = inject(TranslateService);
  private busy = signal(false);

  async rename() {
    const current = this.auth.user();
    if (!current) return;
    const a = await this.alerts.create({
      header: this.translate.instant('auth.profile.renameTitle'),
      inputs: [{ name: 'name', type: 'text', value: current.name, placeholder: this.translate.instant('auth.profile.renamePlaceholder') }],
      buttons: [{ text: this.translate.instant('common.cancel'), role: 'cancel' }, { text: this.translate.instant('common.save'), role: 'confirm' }],
    });
    await a.present();
    const { data, role } = await a.onDidDismiss();
    const name = String(data?.values?.name ?? '').trim();
    if (role !== 'confirm' || !name) return;

    await this.guard(async () => {
      const updated = await this.users.updateUsername(name);
      this.auth.setUser(updated);
      await showToast(this.toastCtrl, this.translate.instant('auth.profile.toastNameUpdated'));
    });
  }

  async refresh() {
    await this.guard(async () => {
      await this.auth.reloadProfile();
      await showToast(this.toastCtrl, this.translate.instant('auth.profile.toastDataRefreshed'));
    });
  }

  async remove() {
    const a = await this.alerts.create({
      header: this.translate.instant('auth.profile.deleteConfirmTitle'),
      message: this.translate.instant('auth.profile.deleteConfirmMessage'),
      buttons: [{ text: this.translate.instant('common.cancel'), role: 'cancel' }, { text: this.translate.instant('common.delete'), role: 'confirm' }],
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