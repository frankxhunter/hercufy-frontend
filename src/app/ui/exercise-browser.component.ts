import { Component, computed, effect, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExerciseService, SEARCH_PAGE_SIZE } from '../core/services/exercise.service';
import { EQUIPMENT_ES, MUSCLE_ES, MUSCLE_GROUPS } from '../core/labels';
import { ExerciseThumbComponent } from './exercise-thumb.component';
import { Exercise } from '../core/models';
import { IonIcon } from '@ionic/angular';

/** Buscador de ejercicios con filtro por grupo muscular. Lo usan la pestaña Ejercicios y el selector al añadir. */
@Component({
  selector: 'app-exercise-browser',
  standalone: true,
  imports: [FormsModule, ExerciseThumbComponent],
  template: `
    <input class="field" type="search" placeholder="Buscar por nombre o material" aria-label="Buscar ejercicio"
      [ngModel]="q()" (ngModelChange)="onQuery($event)" />
    <div class="chips" style="margin-top:10px">
      <button type="button" class="chip" [class.on]="!group()" (click)="setGroup(null)">Todos</button>
      @for (g of groups; track g.key) {
        <button type="button" class="chip" [class.on]="group() === g.key" (click)="setGroup(g.key)">{{ g.label }}</button>
      }
    </div>
    <p class="count">{{ total() }} {{ total() === 1 ? 'ejercicio' : 'ejercicios' }}</p>
    @if (loading()) {
      <p class="empty">Buscando...</p>
    }
    @for (e of results(); track e.id) {
      <button type="button" class="pick-row" (click)="picked.emit(e.id)">
        <app-exercise-thumb [exerciseId]="e.id" />
        <span>
          <span class="ex-name">{{ e.nameEs }}</span>
          <span class="sub">{{ muscle(e) }}, {{ equipment(e.equipment) }}</span>
        </span>
      </button>
    } @empty {
      @if (!loading()) {
        <p class="empty">No hay ejercicios con ese nombre. Prueba con otra palabra o quita el filtro.</p>
      }
    }
    @if (!loading() && results().length < total()) {
      <div style="margin-top:12px;text-align:center">
        <button type="button" class="btn btn-ghost btn-sm" (click)="loadMore()">Ver más</button>
      </div>
    }
    @if (error()) {
      <p class="form-error" role="alert">{{ error() }}</p>
    }
  `,
})
export class ExerciseBrowserComponent {
  private readonly catalog = inject(ExerciseService);
  picked = output<string>();
  groups = MUSCLE_GROUPS;
  q = signal('');
  group = signal<string | null>(null);
  results = signal<Exercise[]>([]);
  total = signal(0);
  loading = signal(false);
  error = signal('');
  private page = 0;

  constructor() {
    this.catalog.ensureIndex();
    let pending: ReturnType<typeof setTimeout> | undefined;
    effect((onCleanup) => {
      const q = this.q();
      const g = this.group();
      pending = setTimeout(() => this.search(), 220);
      onCleanup(() => clearTimeout(pending));
    });
  }

  onQuery(v: string) {
    this.q.set(v);
  }

  setGroup(g: string | null) {
    this.group.set(g);
  }

  private async search(reset = true) {
    if (reset) {
      this.page = 0;
      this.results.set([]);
    }
    this.loading.set(true);
    this.error.set('');
    try {
      const size = SEARCH_PAGE_SIZE + this.page * SEARCH_PAGE_SIZE;
      const res = await this.catalog.search(this.q(), this.group(), size);
      this.results.set(res.items);
      this.total.set(res.total);
    } catch (e) {
      this.error.set((e as Error).message);
    } finally {
      this.loading.set(false);
    }
  }

  async loadMore() {
    this.page++;
    await this.search(false);
  }

  muscle = (e: Exercise) => MUSCLE_ES[e.primaryMuscles[0] ?? ''] ?? e.muscleGroup ?? '';
  equipment = (e: string | null) => (e ? (EQUIPMENT_ES[e] ?? e) : 'Sin material');
}
