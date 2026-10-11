import { Component, computed, inject, signal } from '@angular/core';
import { IonContent, ModalController, NavController, ToastController } from '@ionic/angular';
import { PlanService } from '../core/services/plan.service';
import { PlanExercise } from '../core/models';
import { WEEKDAYS, todayDow, weekdayName } from '../core/labels';
import { showToast } from '../core/util';
import { LogoComponent } from '../ui/logo.component';
import { ExerciseRowComponent } from '../ui/exercise-row.component';
import { EditExerciseModal, EditResult } from '../ui/edit-exercise.modal';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { ReplacePipe } from '../core/pipes/replace.pipe';

@Component({
  selector: 'app-today',
  standalone: true,
  imports: [IonContent, LogoComponent, ExerciseRowComponent, TranslatePipe, ReplacePipe],
  template: `
    <ion-content>
      <div class="wrap">
        <header class="hero">
          <div class="hero-top"><app-logo [size]="24" /><span class="wordmark-sm">Hercufy</span></div>
          <h1 class="display-xl">{{ heading() }}</h1>
          @if (subtitle()) { <p class="hero-sub">{{ subtitle() }}</p> }
        </header>

        <nav class="week" aria-label="{{ 'common.weekdays' | translate }}">
          @for (w of week; track w.n) {
            <button type="button" class="wd" [class.sel]="selected() === w.n" [class.today]="today === w.n" [class.has]="trains().has(w.n)"
              [attr.aria-pressed]="selected() === w.n"
              [attr.aria-label]="weekdayName(w.n) + (trains().has(w.n) ? ', ' + ('today.hasWorkout' | translate) : ', ' + ('today.restDay' | translate))" (click)="selected.set(w.n)">
              <span class="l">{{ w.short }}</span><span class="dot"></span>
            </button>
          }
        </nav>

        @if (!plan()) {
          <div class="empty">
            @if (plans.loading() && plans.plans().length === 0) {
              <strong>{{ 'today.loading' | translate }}</strong>{{ 'today.loadingMoment' | translate }}
            } @else if (plans.error(); as err) {
              <strong>{{ 'today.loadError' | translate }}</strong>{{ err }}
              <div style="margin-top:18px"><button type="button" class="btn" (click)="plans.load(true)">{{ 'today.retry' | translate }}</button></div>
            } @else if (plans.plans().length === 0) {
              <strong>{{ 'today.noPlans' | translate }}</strong>
              {{ 'today.noPlansAction' | translate }}
              <div style="margin-top:18px"><button type="button" class="btn btn-primary" (click)="go('/rutinas/nueva')">{{ 'today.createPlan' | translate }}</button></div>
            } @else {
              <strong>{{ 'today.noActivePlan' | translate }}</strong>
              {{ 'today.noActivePlanAction' | translate }}
              <div style="margin-top:18px"><button type="button" class="btn btn-primary" (click)="go('/tabs/rutinas')">{{ 'today.viewPlans' | translate }}</button></div>
            }
          </div>
        } @else if (day(); as d) {
          <section class="section-gap">
            <h2 class="display-l">{{ d.name }}</h2>
            <p class="muted" style="margin:6px 0 0">{{ d.exercises.length }} {{ d.exercises.length === 1 ? ('today.exercisesCount_one' | translate) : ('today.exercisesCount_other' | translate) }}. {{ 'today.tapToAdjust' | translate }}</p>
            <div class="ex-list">
              @for (pe of d.exercises; track pe.id) {
                <app-exercise-row [pe]="pe" (open)="go('/ejercicio/' + pe.exerciseId)" (edit)="edit(d.id, pe)" />
              } @empty {
                <p class="empty">{{ 'today.emptyDay' | translate }}</p>
              }
            </div>
          </section>
        } @else {
          <div class="empty">
            <strong>{{ 'today.restDayTitle' | translate }}</strong>
            @if (next(); as n) {
              {{ 'today.nextWorkout' | translate | replace:{day: weekdayName(n.dow).toLowerCase(), name: n.name} }}
              <div style="margin-top:18px"><button type="button" class="btn" (click)="selected.set(n.dow)">{{ 'today.viewDay' | translate | replace:{day: weekdayName(n.dow).toLowerCase()} }}</button></div>
            } @else {
              {{ 'today.noTrainingDays' | translate }}
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
  private readonly translate = inject(TranslateService);

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
  heading = computed(() => (this.selected() === this.today ? this.translate.instant('today.today') : this.weekdayName(this.selected())));
  subtitle = computed(() => {
    if (this.selected() === this.today) {
      const lang = this.translate.currentLang();
      const t = new Intl.DateTimeFormat(lang === 'es' ? 'es-ES' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
      return t.charAt(0).toUpperCase() + t.slice(1);
    }
    return this.plan() ? `${this.translate.instant('today.routinePrefix')} «${this.plan()!.name}»` : '';
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
    if (role !== 'save' || !data) return;
    try {
      await this.plans.updateExercise(plan.id, dayId, { ...pe, ...data });
      await showToast(this.toastCtrl, this.translate.instant('today.toastSaved'));
    } catch (e) {
      await showToast(this.toastCtrl, (e as Error).message);
    }
  }
}
