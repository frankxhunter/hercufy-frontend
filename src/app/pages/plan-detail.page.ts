import { Component, computed, inject, input } from '@angular/core';
import { AlertController, IonBackButton, IonButtons, IonContent, IonHeader, IonIcon, IonTitle, IonToggle, IonToolbar, NavController, ToastController } from '@ionic/angular';
import { PlanService } from '../core/services/plan.service';
import { WEEKDAYS } from '../core/labels';
import { showToast } from '../core/util';
import { TrainingPlan } from '../core/models';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-plan-detail',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonIcon, IonToggle, TranslatePipe],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start"><ion-back-button defaultHref="/tabs/rutinas" text="" /></ion-buttons>
        <ion-title>{{ 'planDetail.title' | translate }}</ion-title>
        @if (plan()) {
          <button slot="end" type="button" class="icon-btn" (click)="rename()" [aria-label]="'planDetail.renameAria' | translate"><ion-icon name="create-outline" /></button>
        }
      </ion-toolbar>
    </ion-header>
    <ion-content>
      @if (plan(); as p) {
        <div class="wrap">
          <h1 class="display-l" style="margin-top:6px">{{ p.name }}</h1>
          <div class="toggle-row" style="margin-top:14px">
            <span>{{ 'planDetail.activeLabel' | translate }}<span class="muted" style="display:block;font-size:14px;margin-top:2px">{{ 'planDetail.activeHint' | translate }}</span></span>
            <ion-toggle [checked]="p.active" (ionChange)="setActive($event.detail.checked)" [aria-label]="'planDetail.activeLabel' | translate" />
          </div>

          <div class="section-gap">
            @for (w of week; track w.n) {
              @if (dayOf(p, w.n); as d) {
                <button type="button" class="list-row" (click)="openDay(p.id, d.id)">
                  <span class="dayname">{{ w.name }}</span>
                  <span class="grow">
                    <span class="title">{{ d.name }}</span>
                    <span class="sub">{{ d.exercises.length }} {{ d.exercises.length === 1 ? ('planDetail.exercisesCount_one' | translate) : ('planDetail.exercisesCount_other' | translate) }}</span>
                  </span>
                  <ion-icon class="chev" name="chevron-forward" />
                </button>
              } @else {
                <button type="button" class="list-row rest" (click)="addDay(p, w.n)">
                  <span class="dayname">{{ w.name }}</span>
                  <span class="grow muted">{{ 'planDetail.restDay' | translate }}</span>
                  <span class="btn btn-ghost btn-sm">{{ 'planDetail.addDay' | translate }}</span>
                </button>
              }
            }
          </div>

          <button type="button" class="btn btn-danger btn-block" style="margin-top:28px" (click)="remove(p)">{{ 'planDetail.deletePlan' | translate }}</button>
        </div>
      } @else {
        <div class="wrap"><p class="empty"><strong>{{ 'planDetail.notFound' | translate }}</strong>{{ 'planDetail.notFoundAction' | translate }}</p></div>
      }
    </ion-content>
  `,
})
export class PlanDetailPage {
  private readonly plans = inject(PlanService);
  private readonly nav = inject(NavController);
  private readonly alerts = inject(AlertController);
  private readonly toastCtrl = inject(ToastController);
  private readonly translate = inject(TranslateService);

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
      await this.plans.load(true);
    }
  }

  async rename() {
    const p = this.plan();
    if (!p) return;
    const a = await this.alerts.create({
      header: this.translate.instant('planDetail.renameTitle'),
      inputs: [{ name: 'name', type: 'text', value: p.name }],
      buttons: [{ text: this.translate.instant('common.cancel'), role: 'cancel' }, { text: this.translate.instant('common.save'), role: 'confirm' }],
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
      header: this.translate.instant('planDetail.addDayTitle', { day: w.name.toLowerCase() }),
      message: this.translate.instant('planDetail.addDayMessage'),
      inputs: [{ name: 'name', type: 'text', placeholder: this.translate.instant('planDetail.addDayPlaceholder') }],
      buttons: [{ text: this.translate.instant('common.cancel'), role: 'cancel' }, { text: this.translate.instant('planDetail.addDayButton'), role: 'confirm' }],
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
      header: this.translate.instant('planDetail.deleteConfirmTitle'),
      message: this.translate.instant('planDetail.deleteConfirmMessage', { name: p.name }),
      buttons: [{ text: this.translate.instant('common.cancel'), role: 'cancel' }, { text: this.translate.instant('common.delete'), role: 'confirm' }],
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
    await showToast(this.toastCtrl, this.translate.instant('planDetail.toastDeleted'));
    await this.nav.navigateRoot('/tabs/rutinas');
  }
}
