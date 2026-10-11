import { Component, inject } from '@angular/core';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar, NavController } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';


@Component({
  selector: 'app-plan-new',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonIcon, TranslatePipe],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start"><ion-back-button defaultHref="/tabs/rutinas" text="" /></ion-buttons>
        <ion-title>{{ 'planNew.title' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="wrap">
        <h1 class="display-l" style="margin-top:8px">{{ 'planNew.howToCreate' | translate }}</h1>
        <button type="button" class="option hercules" (click)="go('/rutinas/nueva/hercules')">
          <span class="avatar">H</span>
          <span class="display-m">{{ 'planNew.herculesTitle' | translate }}</span>
          <p>{{ 'planNew.herculesDescription' | translate }}</p>
        </button>
        <button type="button" class="option manual" (click)="go('/rutinas/nueva/manual')">
          <ion-icon name="create-outline" style="font-size:30px;color:var(--bronce)" />
          <span class="display-m">{{ 'planNew.manualTitle' | translate }}</span>
          <p>{{ 'planNew.manualDescription' | translate }}</p>
        </button>
      </div>
    </ion-content>
  `,
})
export class PlanNewPage {
  private readonly nav = inject(NavController);
  go(path: string) { this.nav.navigateForward(path); }
}
