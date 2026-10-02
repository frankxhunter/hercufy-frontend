import { Component } from '@angular/core';
import { IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="hoy"><ion-icon name="barbell-outline" /><ion-label>Hoy</ion-label></ion-tab-button>
        <ion-tab-button tab="rutinas"><ion-icon name="albums-outline" /><ion-label>Rutinas</ion-label></ion-tab-button>
        <ion-tab-button tab="ejercicios"><ion-icon name="body-outline" /><ion-label>Ejercicios</ion-label></ion-tab-button>
        <ion-tab-button tab="perfil"><ion-icon name="person-outline" /><ion-label>Perfil</ion-label></ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
})
export class TabsPage {}
