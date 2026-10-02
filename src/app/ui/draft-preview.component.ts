import { Component, computed, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PlanDraft, UnresolvedItem } from '../core/models';
import { weekdayName } from '../core/labels';
import { ExerciseRowComponent } from './exercise-row.component';

/** Vista previa de lo que propone Hercules. Nada se guarda hasta pulsar "Aceptar rutina". */
@Component({
  selector: 'app-draft-preview',
  standalone: true,
  imports: [FormsModule, ExerciseRowComponent],
  template: `
    <section class="draft" aria-label="Rutina propuesta">
      <input class="name-field" [ngModel]="draft().name" (ngModelChange)="renamed.emit($event)" aria-label="Nombre de la rutina" />
      @for (day of draft().days; track day.id) {
        <h3>{{ weekday(day.dayOfWeek) }} <span>{{ day.name }}</span></h3>
        <div class="ex-list">
          @for (pe of day.exercises; track pe.id) {
            <app-exercise-row [pe]="pe" [readonly]="true" (open)="openExercise.emit(pe.exerciseId)" />
          }
          @for (u of unresolvedFor(day.id); track u.id) {
            <div class="pending">
              <p><strong>«{{ u.originalText }}»</strong> no está en el catálogo con ese nombre.</p>
              <p class="muted">{{ u.sets }} series de {{ u.reps }} repeticiones{{ u.weightKg !== null ? ', ' + u.weightKg + ' kg' : '' }}</p>
              <div class="acts">
                <button type="button" class="btn btn-verdin btn-sm" (click)="resolve.emit(u)">Elegir ejercicio</button>
                <button type="button" class="btn btn-ghost btn-sm" (click)="skip.emit(u)">Quitar</button>
              </div>
            </div>
          }
        </div>
      }
      <div class="draft-actions">
        <button type="button" class="btn btn-primary" [disabled]="pending() > 0" (click)="accept.emit()">
          {{ pending() > 0 ? 'Resuelve los pendientes para aceptar' : 'Aceptar rutina' }}
        </button>
        <button type="button" class="btn btn-ghost" (click)="discard.emit()">Descartar</button>
      </div>
    </section>
  `,
})
export class DraftPreviewComponent {
  draft = input.required<PlanDraft>();
  renamed = output<string>();
  accept = output<void>();
  discard = output<void>();
  resolve = output<UnresolvedItem>();
  skip = output<UnresolvedItem>();
  openExercise = output<string>();

  pending = computed(() => this.draft().unresolved.length);
  weekday = weekdayName;
  unresolvedFor = (dayId: string) => this.draft().unresolved.filter((u) => u.dayId === dayId);
}
