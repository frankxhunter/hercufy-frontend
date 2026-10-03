import { Component, computed, inject, input, signal } from '@angular/core';
import { AlertController, IonBackButton, IonButtons, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar, ModalController, NavController, ToastController } from '@ionic/angular';
import { PlanService } from '../core/services/plan.service';
import { PlanExercise } from '../core/models';
import { weekdayName } from '../core/labels';
import { showToast } from '../core/util';
import { ExerciseRowComponent } from '../ui/exercise-row.component';
import { EditExerciseModal, EditResult } from '../ui/edit-exercise.modal';
import { ExercisePickerModal } from '../ui/exercise-picker.modal';

@Component({
  selector: 'app-day-detail',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonIcon, ExerciseRowComponent],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start"><ion-back-button [defaultHref]="'/rutinas/' + planId()" text="" /></ion-buttons>
        <ion-title>{{ weekday() }}</ion-title>
        @if (day()) {
          <button slot="end" type="button" class="icon-btn" (click)="rename()" aria-label="Cambiar nombre del día"><ion-icon name="create-outline" /></button>
          <button slot="end" type="button" class="icon-btn" (click)="removeDay()" aria-label="Quitar este día"><ion-icon name="trash-outline" /></button>
        }
      </ion-toolbar>
    </ion-header>
    <ion-content>
      @if (day(); as d) {
        <div class="wrap">
          <h1 class="display-l" style="margin-top:6px">{{ d.name }}</h1>
          <p class="muted" style="margin:6px 0 0">{{ d.exercises.length }} {{ d.exercises.length === 1 ? 'ejercicio' : 'ejercicios' }}</p>

          <div style="display:flex;gap:10px;margin-top:18px">
            <button type="button" class="btn btn-primary btn-sm" (click)="add()"><ion-icon name="add" /> Añadir ejercicio</button>
            @if (d.exercises.length > 1) {
              <button type="button" class="btn btn-ghost btn-sm" (click)="reordering.set(!reordering())" [attr.aria-pressed]="reordering()">
                <ion-icon name="swap-vertical-outline" /> {{ reordering() ? 'Listo' : 'Ordenar' }}
              </button>
            }
          </div>

          <div class="ex-list">
            @for (pe of d.exercises; track pe.id; let i = $index) {
              <app-exercise-row [pe]="pe" [reorder]="reordering()" [first]="i === 0" [last]="i === d.exercises.length - 1"
                (open)="open(pe.exerciseId)" (edit)="edit(pe, true)" (up)="move(i, i - 1)" (down)="move(i, i + 1)" />
            } @empty {
              <p class="empty"><strong>Este día está vacío</strong>Añade el primer ejercicio para empezar a montarlo.</p>
            }
          </div>
        </div>
      } @else {
        <div class="wrap"><p class="empty"><strong>Este día ya no existe</strong>Vuelve a la rutina para ver los días disponibles.</p></div>
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

  planId = input.required<string>();
  dayId = input.required<string>();
  reordering = signal(false);
  day = computed(() => this.plans.day(this.planId(), this.dayId()));
  weekday = computed(() => weekdayName(this.day()?.dayOfWeek ?? null) || 'Día');

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
        await showToast(this.toastCtrl, 'Cambios guardados');
      } else if (role === 'remove') {
        await this.plans.removeExercise(this.planId(), this.dayId(), pe.id);
        await showToast(this.toastCtrl, 'Ejercicio quitado');
      }
    } catch (e) {
      await showToast(this.toastCtrl, (e as Error).message);
    }
  }

  async rename() {
    const d = this.day();
    if (!d) return;
    const a = await this.alerts.create({
      header: 'Nombre del día',
      inputs: [{ name: 'name', type: 'text', value: d.name }],
      buttons: [{ text: 'Cancelar', role: 'cancel' }, { text: 'Guardar', role: 'confirm' }],
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
      header: '¿Quitar este día?',
      message: `«${d.name}» y sus ejercicios se borrarán de la rutina.`,
      buttons: [{ text: 'Cancelar', role: 'cancel' }, { text: 'Quitar día', role: 'confirm' }],
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
    await showToast(this.toastCtrl, 'Día quitado');
    await this.nav.navigateBack('/rutinas/' + this.planId());
  }
}
