import { Component, computed, inject, input } from '@angular/core';
import { AlertController, IonBackButton, IonButtons, IonContent, IonHeader, IonIcon, IonTitle, IonToggle, IonToolbar, NavController, ToastController } from '@ionic/angular';
import { PlanService } from '../core/services/plan.service';
import { WEEKDAYS } from '../core/labels';
import { showToast } from '../core/util';
import { TrainingPlan } from '../core/models';

@Component({
  selector: 'app-plan-detail',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonIcon, IonToggle],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start"><ion-back-button defaultHref="/tabs/rutinas" text="" /></ion-buttons>
        <ion-title>Rutina</ion-title>
        @if (plan()) {
          <button slot="end" type="button" class="icon-btn" (click)="rename()" aria-label="Cambiar nombre"><ion-icon name="create-outline" /></button>
        }
      </ion-toolbar>
    </ion-header>
    <ion-content>
      @if (plan(); as p) {
        <div class="wrap">
          <h1 class="display-l" style="margin-top:6px">{{ p.name }}</h1>
          <div class="toggle-row" style="margin-top:14px">
            <span>Rutina activa<span class="muted" style="display:block;font-size:14px;margin-top:2px">Es la que verás en la pestaña Hoy</span></span>
            <ion-toggle [checked]="p.active" (ionChange)="setActive($event.detail.checked)" aria-label="Rutina activa" />
          </div>

          <div class="section-gap">
            @for (w of week; track w.n) {
              @if (dayOf(p, w.n); as d) {
                <button type="button" class="list-row" (click)="openDay(p.id, d.id)">
                  <span class="dayname">{{ w.name }}</span>
                  <span class="grow">
                    <span class="title">{{ d.name }}</span>
                    <span class="sub">{{ d.exercises.length }} {{ d.exercises.length === 1 ? 'ejercicio' : 'ejercicios' }}</span>
                  </span>
                  <ion-icon class="chev" name="chevron-forward" />
                </button>
              } @else {
                <button type="button" class="list-row rest" (click)="addDay(p, w.n)">
                  <span class="dayname">{{ w.name }}</span>
                  <span class="grow muted">Descanso</span>
                  <span class="btn btn-ghost btn-sm">Añadir día</span>
                </button>
              }
            }
          </div>

          <button type="button" class="btn btn-danger btn-block" style="margin-top:28px" (click)="remove(p)">Eliminar rutina</button>
        </div>
      } @else {
        <div class="wrap"><p class="empty"><strong>Esta rutina ya no existe</strong>Vuelve a la lista para elegir otra.</p></div>
      }
    </ion-content>
  `,
})
export class PlanDetailPage {
  private readonly plans = inject(PlanService);
  private readonly nav = inject(NavController);
  private readonly alerts = inject(AlertController);
  private readonly toastCtrl = inject(ToastController);

  planId = input.required<string>();
  week = WEEKDAYS;
  plan = computed(() => this.plans.plan(this.planId()));

  dayOf = (p: TrainingPlan, dow: number) => p.days.find((d) => d.dayOfWeek === dow);

  openDay(planId: string, dayId: string) {
    this.nav.navigateForward(`/rutinas/${planId}/dia/${dayId}`);
  }

  async setActive(active: boolean) {
    const p = this.plan();
    if (!p || p.active === active) return;
    try {
      await this.plans.setActive(p.id, active);
    } catch (e) {
      await showToast(this.toastCtrl, (e as Error).message);
      // El interruptor ya se ve cambiado: se vuelve a pedir la rutina para mostrar lo real.
      await this.plans.load(true);
    }
  }

  async rename() {
    const p = this.plan();
    if (!p) return;
    const a = await this.alerts.create({
      header: 'Nombre de la rutina',
      inputs: [{ name: 'name', type: 'text', value: p.name }],
      buttons: [{ text: 'Cancelar', role: 'cancel' }, { text: 'Guardar', role: 'confirm' }],
    });
    await a.present();
    const { data, role } = await a.onDidDismiss();
    const name = data?.values?.name?.trim();
    if (role !== 'confirm' || !name) return;
    try {
      await this.plans.rename(p.id, name);
    } catch (e) {
      await showToast(this.toastCtrl, (e as Error).message);
    }
  }

  async addDay(p: TrainingPlan, dow: number) {
    const w = WEEKDAYS.find((x) => x.n === dow)!;
    const a = await this.alerts.create({
      header: `Añadir el ${w.name.toLowerCase()}`,
      message: '¿Qué entrenas ese día?',
      inputs: [{ name: 'name', type: 'text', placeholder: 'Pecho y tríceps' }],
      buttons: [{ text: 'Cancelar', role: 'cancel' }, { text: 'Añadir día', role: 'confirm' }],
    });
    await a.present();
    const { data, role } = await a.onDidDismiss();
    const name = data?.values?.name?.trim();
    if (role !== 'confirm' || !name) return;
    try {
      const dayId = await this.plans.addDay(p.id, name, dow);
      this.openDay(p.id, dayId);
    } catch (e) {
      await showToast(this.toastCtrl, (e as Error).message);
    }
  }

  async remove(p: TrainingPlan) {
    const a = await this.alerts.create({
      header: '¿Eliminar esta rutina?',
      message: `«${p.name}» se borrará con todos sus días y ejercicios.`,
      buttons: [{ text: 'Cancelar', role: 'cancel' }, { text: 'Eliminar', role: 'confirm' }],
    });
    await a.present();
    const { role } = await a.onDidDismiss();
    if (role !== 'confirm') return;
    try {
      await this.plans.remove(p.id);
    } catch (e) {
      await showToast(this.toastCtrl, (e as Error).message);
      return;
    }
    await showToast(this.toastCtrl, 'Rutina eliminada');
    await this.nav.navigateRoot('/tabs/rutinas');
  }
}
