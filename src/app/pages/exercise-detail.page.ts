import { Component, computed, inject, input } from '@angular/core';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonToolbar } from '@ionic/angular';
import { ExerciseService } from '../core/services/exercise.service';
import { EQUIPMENT_ES, LEVEL_ES, MUSCLE_ES } from '../core/labels';

@Component({
  selector: 'app-exercise-detail',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonButtons, IonBackButton, IonContent],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar><ion-buttons slot="start"><ion-back-button defaultHref="/tabs/ejercicios" text="" /></ion-buttons></ion-toolbar>
    </ion-header>
    <ion-content>
      @if (ex(); as e) {
        <div class="wrap">
          <div class="gallery">
            @for (img of images(); track img; let i = $index) {
              <img [src]="img" [alt]="e.nameEs + ', imagen ' + (i + 1)" loading="lazy" />
            }
          </div>
          <h1 class="display-l" style="margin-top:22px">{{ e.nameEs }}</h1>
          <p class="muted" style="margin:6px 0 0">{{ e.name }}</p>

          <dl class="facts">
            <div><dt>Músculo principal</dt><dd>{{ muscle(e.primaryMuscles[0]) }}</dd></div>
            @if (e.secondaryMuscles.length) { <div><dt>Secundarios</dt><dd>{{ secondary() }}</dd></div> }
            <div><dt>Material</dt><dd>{{ equipment(e.equipment) }}</dd></div>
            <div><dt>Nivel</dt><dd>{{ level(e.level) }}</dd></div>
          </dl>

          <h2 class="display-m" style="margin-top:28px">Cómo se hace</h2>
          <ol class="steps">
            @for (s of e.instructions; track $index) { <li>{{ s }}</li> }
          </ol>
          <p class="note">Las instrucciones están en inglés; la traducción al español llegará más adelante.</p>
        </div>
      } @else {
        <div class="wrap"><p class="empty"><strong>No encuentro este ejercicio</strong>Vuelve al catálogo para buscarlo.</p></div>
      }
    </ion-content>
  `,
})
export class ExerciseDetailPage {
  private readonly catalog = inject(ExerciseService);
  id = input.required<string>();
  ex = computed(() => this.catalog.byId(this.id()));
  images = computed(() => this.ex()?.images.map((_, i) => this.catalog.imageUrl(this.ex(), i)!) ?? []);
  secondary = computed(() => this.ex()?.secondaryMuscles.map((m) => MUSCLE_ES[m] ?? m).join(', ') ?? '');
  muscle = (m: string) => MUSCLE_ES[m] ?? m;
  equipment = (e: string | null) => (e ? (EQUIPMENT_ES[e] ?? e) : 'Sin material');
  level = (l: string) => LEVEL_ES[l] ?? l;
}
