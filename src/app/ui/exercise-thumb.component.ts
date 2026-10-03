import { Component, computed, inject, input } from '@angular/core';
import { ExerciseService } from '../core/services/exercise.service';

const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#2c3641"/><g fill="#56626f"><rect x="10" y="26" width="6" height="12" rx="2"/><rect x="48" y="26" width="6" height="12" rx="2"/><rect x="16" y="30" width="32" height="4"/></g></svg>',
  );

@Component({
  selector: 'app-exercise-thumb',
  standalone: true,
  template: `<img class="ex-thumb" [src]="url()" alt="" loading="lazy" (error)="fallback($event)" />`,
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
