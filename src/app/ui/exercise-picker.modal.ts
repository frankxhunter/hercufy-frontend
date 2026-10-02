import { Component, inject } from '@angular/core';
import { IonContent, IonHeader, IonIcon, IonTitle, IonToolbar, ModalController } from '@ionic/angular';
import { ExerciseBrowserComponent } from './exercise-browser.component';

@Component({
  selector: 'app-exercise-picker-modal',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, ExerciseBrowserComponent],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-title>Elegir ejercicio</ion-title>
        <button slot="end" type="button" class="icon-btn" (click)="close()" aria-label="Cerrar"><ion-icon name="close" /></button>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="wrap"><app-exercise-browser (picked)="pick($event)" /></div>
    </ion-content>
  `,
})
export class ExercisePickerModal {
  private readonly modalCtrl = inject(ModalController);
  pick(id: string) { this.modalCtrl.dismiss(id, 'pick'); }
  close() { this.modalCtrl.dismiss(null, 'cancel'); }
}
