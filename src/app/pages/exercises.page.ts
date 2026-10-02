import { Component, inject } from '@angular/core';
import { IonContent, NavController } from '@ionic/angular';
import { ExerciseBrowserComponent } from '../ui/exercise-browser.component';

@Component({
  selector: 'app-exercises',
  standalone: true,
  imports: [IonContent, ExerciseBrowserComponent],
  template: `
    <ion-content>
      <div class="wrap">
        <header class="hero">
          <h1 class="display-xl">Ejercicios</h1>
          <p class="hero-sub">Consulta cómo se hace cada uno.</p>
        </header>
        <div class="section-gap"><app-exercise-browser (picked)="open($event)" /></div>
      </div>
    </ion-content>
  `,
})
export class ExercisesPage {
  private readonly nav = inject(NavController);
  open(id: string) { this.nav.navigateForward('/ejercicio/' + id); }
}
