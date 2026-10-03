import { Component, computed, inject, input, output } from '@angular/core';
import { ExerciseService } from '../core/services/exercise.service';
import { PlanExercise } from '../core/models';
import { MUSCLE_ES } from '../core/labels';
import { ExerciseThumbComponent } from './exercise-thumb.component';
import { PlateComponent } from './plate.component';
import { IonIcon } from '@ionic/angular';

@Component({
  selector: 'app-exercise-row',
  standalone: true,
  imports: [ExerciseThumbComponent, PlateComponent, IonIcon],
  template: `
    <div class="ex-row" [style.--stripe]="group()?.color ?? 'var(--linea)'">
      <span class="stripe"></span>
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;min-width:0;grid-column:2 / 4;">
        <button type="button" class="ex-main" (click)="open.emit()">
          <app-exercise-thumb [exerciseId]="pe().exerciseId" />
          <span class="ex-text">
            <span class="ex-name">{{ title() }}</span>
            <span class="ex-meta">{{ meta() }}</span>
            <span class="ex-group">{{ muscle() }}</span>
          </span>
        </button>
        @if (reorder()) {
          <div class="reorder">
            <button type="button" class="icon-btn" [disabled]="first()" (click)="up.emit()" aria-label="Subir ejercicio"><ion-icon name="arrow-up" /></button>
            <button type="button" class="icon-btn" [disabled]="last()" (click)="down.emit()" aria-label="Bajar ejercicio"><ion-icon name="arrow-down" /></button>
          </div>
        } @else {
          <app-plate [weightKg]="pe().weightKg" [readonly]="readonly()" (pressed)="edit.emit()" />
        }
      </div>
    </div>
  `,
})
export class ExerciseRowComponent {
  private readonly catalog = inject(ExerciseService);
  pe = input.required<PlanExercise>();
  reorder = input(false);
  readonly = input(false);
  first = input(false);
  last = input(false);
  open = output<void>();
  edit = output<void>();
  up = output<void>();
  down = output<void>();

  constructor() {
    this.catalog.ensureIndex();
  }

  ex = computed(() => this.catalog.byId(this.pe().exerciseId));
  group = computed(() => this.catalog.groupOf(this.ex()));
  // El backend ya devuelve el nombre junto al ejercicio; el catálogo solo hace falta para
  // la miniatura y el grupo muscular.
  title = computed(() => this.pe().exerciseNameEs || this.ex()?.nameEs || this.pe().exerciseId);
  muscle = computed(() => {
    const e = this.ex();
    const m = e?.primaryMuscles[0];
    return m ? (MUSCLE_ES[m] ?? m) : (e?.muscleGroup ?? '');
  });
  meta = computed(() => {
    const { sets, reps } = this.pe();
    return `${sets} ${sets === 1 ? 'serie' : 'series'} de ${reps} ${reps === 1 ? 'repetición' : 'repeticiones'}`;
  });
}
