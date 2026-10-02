import { Component, inject } from '@angular/core';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar, NavController } from '@ionic/angular';

@Component({
  selector: 'app-plan-new',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonIcon],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start"><ion-back-button defaultHref="/tabs/rutinas" text="" /></ion-buttons>
        <ion-title>Nueva rutina</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="wrap">
        <h1 class="display-l" style="margin-top:8px">¿Cómo quieres crearla?</h1>
        <button type="button" class="option hercules" (click)="go('/rutinas/nueva/hercules')">
          <span class="avatar">H</span>
          <span class="display-m">Pídesela a Hercules</span>
          <p>Cuéntale qué quieres entrenar, o pega la rutina que ya tienes, y te la deja armada. Tú decides si la guardas.</p>
        </button>
        <button type="button" class="option manual" (click)="go('/rutinas/nueva/manual')">
          <ion-icon name="create-outline" style="font-size:30px;color:var(--bronce)" />
          <span class="display-m">Crearla a mano</span>
          <p>Elige los días de entrenamiento y añade los ejercicios uno a uno.</p>
        </button>
      </div>
    </ion-content>
  `,
})
export class PlanNewPage {
  private readonly nav = inject(NavController);
  go(path: string) { this.nav.navigateForward(path); }
}
