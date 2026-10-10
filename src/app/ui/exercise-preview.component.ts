import { Component, OnDestroy, computed, inject, input, output, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { IonButtons, IonBackButton } from '@ionic/angular';
import { catchError, from, map, of, startWith, switchMap } from 'rxjs';
import { ExerciseService } from '../core/services/exercise.service';
import { EQUIPMENT_ES, LEVEL_ES, MUSCLE_ES } from '../core/labels';
import { Exercise } from '../core/models';
import { EXERCISE_PLACEHOLDER } from './placeholder-image';

type State =
  | { kind: 'loading' }
  | { kind: 'ready'; ex: Exercise }
  | { kind: 'error'; message: string };

const CATEGORY_ES: Record<string, string> = { strength: 'Fuerza', cardio: 'Cardio', stretching: 'Estiramientos' };
const MECHANIC_ES: Record<string, string> = { compound: 'Compuesto', isolation: 'Aislamiento' };

/**
 * Hoja de previsualización: fotos, datos y pasos de un ejercicio. Al añadirlo a una rutina
 * ofrece el botón de añadir; al solo consultarlo, la ficha completa. Se cierra tocando
 * fuera, con el botón de volver o con Escape.
 */
@Component({
  selector: 'app-exercise-preview',
  standalone: true,
  imports: [IonButtons, IonBackButton],
  template: `
    <div class="peek" role="dialog" aria-modal="true" [attr.aria-label]="'Vista previa de ' + title()" (click)="backdrop($event)">
      <div class="peek-panel" [style.--stripe]="color()">
        <div class="peek-top">
            <ion-buttons slot="start" ><ion-back-button defaultHref="" (click)="closed.emit()" text="" aria-label="Volver al buscador" /></ion-buttons>
        </div>

        <div class="peek-body">
          @switch (state().kind) {
            @case ('loading') {
              <div class="peek-skel"></div>
              <div class="peek-skel" style="height:26px;width:60%;margin-top:22px"></div>
              <div class="peek-skel" style="height:15px;width:40%;margin-top:12px"></div>
            }
            @case ('error') {
              <div class="empty">
                <strong>No se ha podido cargar la ficha</strong>{{ errorMessage() }}
                <div style="margin-top:16px"><button type="button" class="btn btn-sm" (click)="retry()">Reintentar</button></div>
              </div>
            }
            @case ('ready') {
              <div class="peek-shot">
                <img [src]="shot()" [alt]="title() + ', imagen ' + (frame() + 1)" decoding="async" fetchpriority="high" (error)="broken($event)" />
              </div>
              @if (frames().length > 1) {
                <div class="peek-strip">
                  @for (img of frames(); track img; let i = $index) {
                    <img [src]="img" [class.on]="i === frame()" [attr.aria-label]="'Ver la imagen ' + (i + 1)"
                      [attr.aria-pressed]="i === frame()" loading="lazy" decoding="async" (click)="frame.set(i)" />
                  }
                </div>
              }

              <div class="peek-title">
                <span class="peek-bar"></span>
                <div>
                  <span class="peek-kicker">{{ group() }}</span>
                  <h2>{{ title() }}</h2>
                  @if (original(); as n) { <p class="original">{{ n }}</p> }
                </div>
              </div>

              <dl class="facts">
                <div><dt>Músculo principal</dt><dd>{{ primary() }}</dd></div>
                @if (secondary()) { <div><dt>Secundarios</dt><dd>{{ secondary() }}</dd></div> }
                <div><dt>Material</dt><dd>{{ equipment() }}</dd></div>
                <div><dt>Nivel</dt><dd>{{ level() }}</dd></div>
                <div><dt>Tipo</dt><dd>{{ kind() }}</dd></div>
              </dl>

              <h3 class="peek-h3">Cómo se hace</h3>
              @if (steps().length) {
                <ol class="steps">
                  @for (s of steps(); track $index) { <li>{{ s }}</li> }
                </ol>
                @if (!translated()) {
                  <p class="note">Instrucciones en inglés: son las de la ficha original del catálogo.</p>
                }
              } @else {
                <p class="note">Este ejercicio no trae instrucciones en el catálogo.</p>
              }
            }
          }
        </div>

        <div class="peek-actions">
          @if (addable() && ex()) {
            <button type="button" class="btn btn-primary btn-block" (click)="added.emit(exerciseId())">
              Añadir a la rutina
            </button>
          }
          <button type="button" class="btn btn-block" (click)="viewed.emit(exerciseId())">Ver ficha completa</button>
        </div>
      </div>
    </div>
  `,
})
export class ExercisePreviewComponent implements OnDestroy {
  private readonly catalog = inject(ExerciseService);

  exerciseId = input.required<string>();
  /** true cuando el ejercicio se está eligiendo para añadirlo a una rutina. */
  addable = input(false);

  added = output<string>();
  closed = output<void>();
  viewed = output<string>();

  readonly frame = signal(0);
  /** Sube en cada reintento para volver a pedir la ficha al servidor. */
  private readonly attempt = signal(0);

  readonly state = toSignal(
    toObservable(computed(() => ({ id: this.exerciseId(), retry: this.attempt() }))).pipe(
      switchMap(({ id }) =>
        from(this.catalog.detail(id)).pipe(
          map((ex): State => ({ kind: 'ready', ex })),
          startWith<State>({ kind: 'loading' }),
          catchError((e) => of<State>({ kind: 'error', message: (e as Error).message })),
        ),
      ),
    ),
    { initialValue: { kind: 'loading' } as State },
  );

  ex = computed(() => {
    const s = this.state();
    return s.kind === 'ready' ? s.ex : undefined;
  });

  errorMessage = computed(() => {
    const s = this.state();
    return s.kind === 'error' ? s.message : '';
  });

  title = computed(() => this.ex()?.nameEs ?? '');
  original = computed(() => {
    const e = this.ex();
    return e && e.name !== e.nameEs ? e.name : '';
  });
  translated = computed(() => this.ex()?.translated ?? true);
  frames = computed(() => this.ex()?.imageUrls ?? []);
  shot = computed(() => this.frames()[this.frame()] ?? this.frames()[0] ?? EXERCISE_PLACEHOLDER);
  steps = computed(() => this.ex()?.instructions ?? []);
  group = computed(() => this.catalog.groupOf(this.ex())?.label ?? 'Ejercicio');
  color = computed(() => this.catalog.groupOf(this.ex())?.color ?? 'var(--bronce)');
  primary = computed(() => {
    const m = this.ex()?.primaryMuscles[0];
    return m ? (MUSCLE_ES[m] ?? m) : '—';
  });
  secondary = computed(() => this.ex()?.secondaryMuscles.map((m) => MUSCLE_ES[m] ?? m).join(', ') ?? '');
  equipment = computed(() => {
    const e = this.ex()?.equipment;
    return e ? (EQUIPMENT_ES[e] ?? e) : 'Sin material';
  });
  level = computed(() => {
    const l = this.ex()?.level;
    return l ? (LEVEL_ES[l] ?? l) : '—';
  });
  kind = computed(() => {
    const e = this.ex();
    if (!e) return '—';
    return [CATEGORY_ES[e.category] ?? e.category, MECHANIC_ES[e.mechanic ?? ''] ?? ''].filter(Boolean).join(' · ') || '—';
  });

  retry() {
    this.frame.set(0);
    this.attempt.update((n) => n + 1);
  }

  /** Tocar el fondo (fuera de la hoja) la cierra. */
  backdrop(ev: Event) {
    if (ev.target === ev.currentTarget) this.closed.emit();
  }

  /**
   * Escape cierra solo esta hoja. Se escucha en fase de captura sobre el documento y se corta
   * la propagación a propósito: Ionic cierra el último overlay abierto al pulsar Escape
   * (utils/overlays.js), y como esta hoja vive dentro del modal del selector, sin ese corte se
   * cerrarían los dos de golpe. Con la hoja abierta, el primer Escape es suyo y el segundo
   * cierra el selector.
   */
  private readonly onEscape = (ev: KeyboardEvent) => {
    if (ev.key !== 'Escape') return;
    ev.stopPropagation();
    this.closed.emit();
  };

  constructor() {
    document.addEventListener('keydown', this.onEscape, true);
  }

  ngOnDestroy() {
    document.removeEventListener('keydown', this.onEscape, true);
  }

  broken(ev: Event) {
    const img = ev.target as HTMLImageElement;
    if (img.src !== EXERCISE_PLACEHOLDER) img.src = EXERCISE_PLACEHOLDER;
  }
}