import { Component, computed, inject, signal } from '@angular/core';
import { IonContent, ModalController, NavController, ToastController } from '@ionic/angular';
import { PlanService } from '../core/services/plan.service';
import { PlanExercise } from '../core/models';
import { WEEKDAYS, todayDow, weekdayName } from '../core/labels';
import { showToast } from '../core/util';
import { LogoComponent } from '../ui/logo.component';
import { ExerciseRowComponent } from '../ui/exercise-row.component';
import { EditExerciseModal, EditResult } from '../ui/edit-exercise.modal';

@Component({
  selector: 'app-today',
  standalone: true,
  imports: [IonContent, LogoComponent, ExerciseRowComponent],
  template: `
    <ion-content>
      <div class="wrap">
        <header class="hero">
          <div class="hero-top"><app-logo [size]="24" /><span class="wordmark-sm">Hercufy</span></div>
          <h1 class="display-xl">{{ heading() }}</h1>
          @if (subtitle()) { <p class="hero-sub">{{ subtitle() }}</p> }
        </header>

        <nav class="week" aria-label="Días de la semana">
          @for (w of week; track w.n) {
            <button type="button" class="wd" [class.sel]="selected() === w.n" [class.today]="today === w.n" [class.has]="trains().has(w.n)"
              [attr.aria-pressed]="selected() === w.n"
              [attr.aria-label]="w.name + (trains().has(w.n) ? ', hay entrenamiento' : ', descanso')" (click)="selected.set(w.n)">
              <span class="l">{{ w.short }}</span><span class="dot"></span>
            </button>
          }
        </nav>

        @if (!plan()) {
          <div class="empty">
            @if (plans.plans().length === 0) {
              <strong>Aún no tienes ninguna rutina</strong>
              Créala a mano o pídesela a Hercules, y aquí verás qué te toca cada día.
              <div style="margin-top:18px"><button type="button" class="btn btn-primary" (click)="go('/rutinas/nueva')">Crear rutina</button></div>
            } @else {
              <strong>No hay ninguna rutina activa</strong>
              Activa una de tus rutinas para ver aquí qué te toca cada día.
              <div style="margin-top:18px"><button type="button" class="btn btn-primary" (click)="go('/tabs/rutinas')">Ver mis rutinas</button></div>
            }
          </div>
        } @else if (day(); as d) {
          <section class="section-gap">
            <h2 class="display-l">{{ d.name }}</h2>
            <p class="muted" style="margin:6px 0 0">{{ d.exercises.length }} {{ d.exercises.length === 1 ? 'ejercicio' : 'ejercicios' }}. Toca el disco para ajustar el peso.</p>
            <div class="ex-list">
              @for (pe of d.exercises; track pe.id) {
                <app-exercise-row [pe]="pe" (open)="go('/ejercicio/' + pe.exerciseId)" (edit)="edit(d.id, pe)" />
              } @empty {
                <p class="empty">Este día aún no tiene ejercicios. Añádelos desde Rutinas.</p>
              }
            </div>
          </section>
        } @else {
          <div class="empty">
            <strong>Día de descanso</strong>
            @if (next(); as n) {
              Tu próximo entrenamiento es el {{ weekdayName(n.dow).toLowerCase() }}: {{ n.name }}.
              <div style="margin-top:18px"><button type="button" class="btn" (click)="selected.set(n.dow)">Ver el {{ weekdayName(n.dow).toLowerCase() }}</button></div>
            } @else {
              Esta rutina no tiene días de entrenamiento todavía.
            }
          </div>
        }
      </div>
    </ion-content>
  `,
})
export class TodayPage {
  readonly plans = inject(PlanService);
  private readonly modal = inject(ModalController);
  private readonly toastCtrl = inject(ToastController);
  private readonly nav = inject(NavController);

  week = WEEKDAYS;
  today = todayDow();
  selected = signal(todayDow());
  weekdayName = weekdayName;

  plan = this.plans.activePlan;
  day = computed(() => this.plan()?.days.find((d) => d.dayOfWeek === this.selected()) ?? null);
  trains = computed(() => new Set(this.plan()?.days.map((d) => d.dayOfWeek)));
  next = computed(() => {
    const p = this.plan();
    if (!p) return null;
    for (let i = 1; i <= 7; i++) {
      const dow = ((this.selected() - 1 + i) % 7) + 1;
      const d = p.days.find((x) => x.dayOfWeek === dow);
      if (d) return { dow, name: d.name };
    }
    return null;
  });
  heading = computed(() => (this.selected() === this.today ? 'Hoy' : weekdayName(this.selected())));
  subtitle = computed(() => {
    if (this.selected() === this.today) {
      const t = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
      return t.charAt(0).toUpperCase() + t.slice(1);
    }
    return this.plan() ? `Rutina «${this.plan()!.name}»` : '';
  });

  go(path: string) {
    this.nav.navigateForward(path);
  }

  async edit(dayId: string, pe: PlanExercise) {
    const plan = this.plan();
    if (!plan) return;
    const m = await this.modal.create({
      component: EditExerciseModal,
      componentProps: { exerciseId: pe.exerciseId, sets: pe.sets, reps: pe.reps, weightKg: pe.weightKg, canRemove: false },
      breakpoints: [0, 0.62, 1], initialBreakpoint: 0.62, cssClass: 'sheet-modal',
    });
    await m.present();
    const { data, role } = await m.onWillDismiss<EditResult>();
    if (role === 'save' && data) {
      await this.plans.updateExercise(plan.id, dayId, { ...pe, ...data });
      await showToast(this.toastCtrl, 'Cambios guardados');
    }
  }
}
