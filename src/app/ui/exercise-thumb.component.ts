import { Component, computed, inject, input } from '@angular/core';
import { ExerciseService } from '../core/services/exercise.service';
import { EXERCISE_PLACEHOLDER as PLACEHOLDER } from './placeholder-image';

@Component({
  selector: 'app-exercise-thumb',
  standalone: true,
  template: `<img class="ex-thumb" [src]="url()" alt="" loading="lazy" decoding="async" (error)="fallback($event)" />`,
  styles: [':host{display:inline-flex;line-height:0}'],
})
export class ExerciseThumbComponent {
  private readonly catalog = inject(ExerciseService);
  exerciseId = input.required<string>();
  index = input(0);

  constructor() {
    this.catalog.ensureIndex();
  }

  url = computed(() => this.catalog.imageUrl(this.catalog.byId(this.exerciseId()), this.index()) ?? PLACEHOLDER);

  fallback(ev: Event) {
    const img = ev.target as HTMLImageElement;
    if (img.src !== PLACEHOLDER) img.src = PLACEHOLDER;
  }
}
