import { Component, inject } from '@angular/core';
import { IonContent, NavController } from '@ionic/angular';
import { ExerciseBrowserComponent } from '../ui/exercise-browser.component';
import { TranslatePipe } from '@ngx-translate/core';


@Component({
  selector: 'app-exercises',
  standalone: true,
  imports: [IonContent, ExerciseBrowserComponent, TranslatePipe],
  template: `
    <ion-content>
      <div class="wrap">
        <header class="hero">
          <h1 class="display-xl">{{ 'exercises.title' | translate }}</h1>
          <p class="hero-sub">{{ 'exercises.subtitle' | translate }}</p>
        </header>
        <div class="section-gap"><app-exercise-browser mode="browse" (opened)="open($event)" /></div>
      </div>
    </ion-content>
  `,
})
export class ExercisesPage {
  private readonly nav = inject(NavController);
  open(id: string) { this.nav.navigateForward('/ejercicio/' + id); }
}
