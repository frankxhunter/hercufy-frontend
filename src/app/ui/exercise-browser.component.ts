import { Component, computed, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExerciseService } from '../core/services/exercise.service';
import { EQUIPMENT_ES, MUSCLE_ES, MUSCLE_GROUPS } from '../core/labels';
import { ExerciseThumbComponent } from './exercise-thumb.component';

/** Buscador de ejercicios con filtro por grupo muscular. Lo usan la pestaña Ejercicios y el selector al añadir. */
@Component({
  selector: 'app-exercise-browser',
  standalone: true,
  imports: [FormsModule, ExerciseThumbComponent],
  template: `
    <input class="field" type="search" placeholder="Buscar por nombre o material" aria-label="Buscar ejercicio"
      [ngModel]="q()" (ngModelChange)="q.set($event)" />
    <div class="chips" style="margin-top:10px">
      <button type="button" class="chip" [class.on]="!group()" (click)="group.set(null)">Todos</button>
      @for (g of groups; track g.key) {
        <button type="button" class="chip" [class.on]="group() === g.key" (click)="group.set(g.key)">{{ g.label }}</button>
      }
    </div>
    <p class="count">{{ results().length }} {{ results().length === 1 ? 'ejercicio' : 'ejercicios' }}</p>
    @for (e of results(); track e.id) {
      <button type="button" class="pick-row" (click)="picked.emit(e.id)">
        <app-exercise-thumb [exerciseId]="e.id" />
        <span>
          <span class="ex-name">{{ e.nameEs }}</span>
          <span class="sub">{{ muscle(e.primaryMuscles[0]) }}, {{ equipment(e.equipment) }}</span>
        </span>
      </button>
    } @empty {
      <p class="empty">No hay ejercicios con ese nombre. Prueba con otra palabra o quita el filtro.</p>
    }
  `,
})
export class ExerciseBrowserComponent {
  private readonly catalog = inject(ExerciseService);
  picked = output<string>();
  groups = MUSCLE_GROUPS;
  q = signal('');
  group = signal<string | null>(null);
  results = computed(() => this.catalog.search(this.q(), this.group()));
  muscle = (m: string) => MUSCLE_ES[m] ?? m;
  equipment = (e: string | null) => (e ? (EQUIPMENT_ES[e] ?? e) : 'Sin material');
}
