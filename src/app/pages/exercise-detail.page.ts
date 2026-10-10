import { Component, computed, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonToolbar } from '@ionic/angular';
import { catchError, from, map, of, startWith, switchMap } from 'rxjs';
import { ExerciseService } from '../core/services/exercise.service';
import { EQUIPMENT_ES, LEVEL_ES, MUSCLE_ES } from '../core/labels';
import { Exercise } from '../core/models';

type Detail =
  | { kind: 'loading' }
  | { kind: 'ready'; ex: Exercise }
  | { kind: 'missing' };

@Component({
  selector: 'app-exercise-detail',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonButtons, IonBackButton, IonContent],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar><ion-buttons slot="start"><ion-back-button defaultHref="/tabs/ejercicios" text="" /></ion-buttons></ion-toolbar>
    </ion-header>
    <ion-content>
      @switch (state().kind) {
        @case ('loading') {
          <div class="wrap"><p class="empty">Cargando ejercicio...</p></div>
        }
        @case ('missing') {
          <div class="wrap"><p class="empty"><strong>No encuentro este ejercicio</strong>Vuelve al catálogo para buscarlo.</p></div>
        }
        @case ('ready') {
          @if (state().kind === 'ready') {
            <div class="wrap">
              <div class="gallery">
                @for (img of images(); track img; let i = $index) {
                  <img [src]="img" [alt]="title() + ', imagen ' + (i + 1)" loading="lazy" decoding="async" />
                }
              </div>
              <h1 class="display-l" style="margin-top:22px">{{ title() }}</h1>
              @if (originalName(); as n) {
                <p class="muted" style="margin:6px 0 0">{{ n }}</p>
              }

              <dl class="facts">
                <div><dt>Músculo principal</dt><dd>{{ primary() }}</dd></div>
                @if (secondary()) { <div><dt>Secundarios</dt><dd>{{ secondary() }}</dd></div> }
                <div><dt>Material</dt><dd>{{ equipment() }}</dd></div>
                <div><dt>Nivel</dt><dd>{{ level() }}</dd></div>
              </dl>

              <h2 class="display-m" style="margin-top:28px">Cómo se hace</h2>
              <ol class="steps">
                @for (s of instructions(); track $index) { <li>{{ s }}</li> }
              </ol>
              @if (!translated()) {
                <p class="note">Este ejercicio todavía no tiene traducción al español; las instrucciones están en inglés.</p>
              }
            </div>
          }
        }
      }
    </ion-content>
  `,
})
export class ExerciseDetailPage {
  private readonly catalog = inject(ExerciseService);
  id = input.required<string>();

  readonly state = toSignal(
    toObservable(this.id).pipe(
      switchMap((id) =>
        from(this.catalog.detail(id)).pipe(
          map((ex): Detail => ({ kind: 'ready', ex })),
          startWith<Detail>({ kind: 'loading' }),
          catchError(() => of<Detail>({ kind: 'missing' })),
        ),
      ),
    ),
    { initialValue: { kind: 'loading' } as Detail },
  );

  ex = computed(() => {
    const s = this.state();
    return s.kind === 'ready' ? s.ex : undefined;
  });
  title = computed(() => this.ex()?.nameEs ?? '');
  originalName = computed(() => {
    const e = this.ex();
    if (!e || e.name === e.nameEs) return '';
    return e.name;
  });
  translated = computed(() => this.ex()?.translated ?? false);
  images = computed(() => {
    const e = this.ex();
    return e ? e.imageUrls : [];
  });
  instructions = computed(() => this.ex()?.instructions ?? []);
  primary = computed(() => {
    const m = this.ex()?.primaryMuscles[0];
    return m ? (MUSCLE_ES[m] ?? m) : '—';
  });
  secondary = computed(
    () => this.ex()?.secondaryMuscles.map((m) => MUSCLE_ES[m] ?? m).join(', ') ?? '',
  );
  equipment = computed(() => {
    const e = this.ex()?.equipment;
    return e ? (EQUIPMENT_ES[e] ?? e) : 'Sin material';
  });
  level = computed(() => {
    const l = this.ex()?.level;
    return l ? (LEVEL_ES[l] ?? l) : '';
  });
}