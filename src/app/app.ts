import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  add, albumsOutline, arrowDown, arrowUp, barbellOutline, bodyOutline, chevronForward, close,
  createOutline, personOutline, send, swapVerticalOutline, trashOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
  template: `<ion-app><ion-router-outlet /></ion-app>`,
})
export class App {
  constructor() {
    addIcons({
      add, albumsOutline, arrowDown, arrowUp, barbellOutline, bodyOutline, chevronForward, close,
      createOutline, personOutline, send, swapVerticalOutline, trashOutline,
    });
  }
}
