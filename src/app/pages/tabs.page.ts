import { Component } from '@angular/core';
import { IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';


@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, TranslatePipe],
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="hoy"><ion-icon name="barbell-outline" /><ion-label>{{ 'tabs.today' | translate }}</ion-label></ion-tab-button>
        <ion-tab-button tab="rutinas"><ion-icon name="albums-outline" /><ion-label>{{ 'tabs.plans' | translate }}</ion-label></ion-tab-button>
        <ion-tab-button tab="ejercicios"><ion-icon name="body-outline" /><ion-label>{{ 'tabs.exercises' | translate }}</ion-label></ion-tab-button>
        <ion-tab-button tab="perfil"><ion-icon name="person-outline" /><ion-label>{{ 'tabs.profile' | translate }}</ion-label></ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
})
export class TabsPage {}
