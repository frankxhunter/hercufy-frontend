import { Component, computed, inject, input, signal } from '@angular/core';
import { AlertController, IonBackButton, IonButtons, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar, ModalController, NavController, ToastController } from '@ionic/angular';
import { PlanService } from '../core/services/plan.service';
import { PlanExercise } from '../core/models';
import { weekdayName } from '../core/labels';
import { showToast } from '../core/util';
import { ExerciseRowComponent } from '../ui/exercise-row.component';
import { EditExerciseModal, EditResult } from '../ui/edit-exercise.modal';
import { ExercisePickerModal } from '../ui/exercise-picker.modal';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-day-detail',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonIcon, ExerciseRowComponent, TranslatePipe],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start"><ion-back-button [defaultHref]="'/rutinas/' + planId()" text="" /></ion-buttons>
        <ion-title>{{ weekday() }}</ion-title>
        @if (day()) {
          <button slot="end" type="button" class="icon-btn" (click)="rename()" [aria-label]="'dayDetail.renameAria' | translate"><ion-icon name="create-outline" /></button>
          <button slot="end" type="button" class="icon-btn" (click)="removeDay()" [aria-label]="'dayDetail.removeAria' | translate"><ion-icon name="trash-outline" /></button>
        }
      </ion-toolbar>
    </ion-header>
    <ion-content>
      @if (day(); as d) {
        <div class="wrap">
          <h1 class="display-l" style="margin-top:6px">{{ d.name }}</h1>
          <p class="muted" style="margin:6px 0 0">{{ d.exercises.length }} {{ d.exercises.length === 1 ? ('dayDetail.exercisesCount_one' | translate) : ('dayDetail.exercisesCount_other' | translate) }}</p>

          <div style="display:flex;gap:10px;margin-top:18px">
            <button type="button" class="btn btn-primary btn-sm" (click)="add()"><ion-icon name="add" /> {{ 'dayDetail.addExercise' | translate }}</button>
            @if (d.exercises.length > 1) {
              <button type="button" class="btn btn-ghost btn-sm" (click)="reordering.set(!reordering())" [attr.aria-pressed]="reordering()">
                <ion-icon name="swap-vertical-outline" /> {{ reordering() ? ('dayDetail.doneReorder' | translate) : ('dayDetail.reorder' | translate) }}
              </button>
            }
          </div>

          <div class="ex-list">
            @for (pe of d.exercises; track pe.id; let i = $index) {
              <app-exercise-row [pe]="pe" [reorder]="reordering()" [first]="i === 0" [last]="i === d.exercises.length - 1"
                (open)="open(pe.exerciseId)" (edit)="edit(pe, true)" (up)="move(i, i - 1)" (down)="move(i, i + 1)" />
            } @empty {
              <p class="empty"><strong>{{ 'dayDetail.emptyTitle' | translate }}</strong>{{ 'dayDetail.emptyAction' | translate }}</p>
            }
          </div>
        </div>
      } @else {
        <div class="wrap"><p class="empty"><strong>{{ 'dayDetail.notFoundTitle' | translate }}</strong>{{ 'dayDetail.notFoundAction' | translate }}</p></div>
      }
    </ion-content>
  `,
})
export class DayDetailPage {
  private readonly plans = inject(PlanService);
  private readonly modal = inject(ModalController);
  private readonly nav = inject(NavController);
  private readonly alerts = inject(AlertController);
  private readonly toastCtrl = inject(ToastController);
  private readonly translate = inject(TranslateService);

  planId = input.required<string>();
  dayId = input.required<string>();
  reordering = signal(false);
  day = computed(() => this.plans.day(this.planId(), this.dayId()));
  weekday = computed(() => weekdayName(this.day()?.dayOfWeek ?? null) || this.translate.instant('dayDetail.defaultDay'));

  open(exerciseId: string) {
    this.nav.navigateForward('/ejercicio/' + exerciseId);
  }

  async move(from: number, to: number) {
    try {
      await this.plans.moveExercise(this.planId(), this.dayId(), from, to);
    } catch (e) {
      await showToast(this.toastCtrl, (e as Error).message);
    }
  }

  async add() {
    const m = await this.modal.create({ component: ExercisePickerModal });
    await m.present();
    const { data, role } = await m.onWillDismiss<string>();
    if (role !== 'pick' || !data) return;
    try {
      const pe = await this.plans.addExercise(this.planId(), this.dayId(), data);
      await this.edit(pe, true);
    } catch (e) {
      await showToast(this.toastCtrl, (e as Error).message);
    }
  }

  async edit(pe: PlanExercise, canRemove: boolean) {
    const m = await this.modal.create({
      component: EditExerciseModal,
      componentProps: { exerciseId: pe.exerciseId, sets: pe.sets, reps: pe.reps, weightKg: pe.weightKg, canRemove },
      breakpoints: [0, 0.7, 1], initialBreakpoint: 0.7, cssClass: 'sheet-modal',
    });
    await m.present();
    const { data, role } = await m.onWillDismiss<EditResult>();
    if (role !== 'save' && role !== 'remove') return;
    try {
      if (role === 'save' && data) {
        await this.plans.updateExercise(this.planId(), this.dayId(), { ...pe, ...data });
        await showToast(this.toastCtrl, this.translate.instant('dayDetail.toastSaved'));
      } else if (role === 'remove') {
        await this.plans.removeExercise(this.planId(), this.dayId(), pe.id);
        await showToast(this.toastCtrl, this.translate.instant('dayDetail.toastRemoved'));
      }
    } catch (e) {
      await showToast(this.toastCtrl, (e as Error).message);
    }
  }

  async rename() {
    const d = this.day();
    if (!d) return;
    const a = await this.alerts.create({
      header: this.translate.instant('dayDetail.renameTitle'),
      inputs: [{ name: 'name', type: 'text', value: d.name }],
      buttons: [{ text: this.translate.instant('common.cancel'), role: 'cancel' }, { text: this.translate.instant('common.save'), role: 'confirm' }],
    });
    await a.present();
    const { data, role } = await a.onDidDismiss();
    const name = data?.values?.name?.trim();
    if (role !== 'confirm' || !name) return;
    try {
      await this.plans.renameDay(this.planId(), d.id, name);
    } catch (e) {
      await showToast(this.toastCtrl, (e as Error).message);
    }
  }

  async removeDay() {
    const d = this.day();
    if (!d) return;
    const a = await this.alerts.create({
      header: this.translate.instant('dayDetail.removeDayTitle'),
      message: this.translate.instant('dayDetail.removeDayMessage', { name: d.name }),
      buttons: [{ text: this.translate.instant('common.cancel'), role: 'cancel' }, { text: this.translate.instant('dayDetail.removeDayButton'), role: 'confirm' }],
    });
    await a.present();
    const { role } = await a.onDidDismiss();
    if (role !== 'confirm') return;
    try {
      await this.plans.removeDay(this.planId(), d.id);
    } catch (e) {
      await showToast(this.toastCtrl, (e as Error).message);
      return;
    }
    await showToast(this.toastCtrl, this.translate.instant('dayDetail.toastDayRemoved'));
    await this.nav.navigateBack('/rutinas/' + this.planId());
  }
}
