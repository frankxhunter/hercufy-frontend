import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, NavController, ToastController } from '@ionic/angular';
import { PlanService } from '../core/services/plan.service';
import { WEEKDAYS } from '../core/labels';
import { showToast } from '../core/util';

@Component({
  selector: 'app-plan-manual',
  standalone: true,
  imports: [FormsModule, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start"><ion-back-button defaultHref="/rutinas/nueva" text="" /></ion-buttons>
        <ion-title>Crear a mano</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="wrap">
        <label class="field-label" for="plan-name">Nombre de la rutina</label>
        <input id="plan-name" class="field" placeholder="Por ejemplo, Volumen de invierno" [ngModel]="name()" (ngModelChange)="name.set($event)" />

        <p class="field-label">Días en los que entrenas</p>
        <div class="chips" role="group" aria-label="Días de entrenamiento">
          @for (w of week; track w.n) {
            <button type="button" class="chip" [class.on]="isOn(w.n)" [attr.aria-pressed]="isOn(w.n)" (click)="toggle(w.n)">{{ w.name }}</button>
          }
        </div>

        @for (w of chosen(); track w.n) {
          <label class="field-label" [attr.for]="'day-' + w.n">{{ w.name }}: ¿qué entrenas?</label>
          <input [id]="'day-' + w.n" class="field" placeholder="Pecho, hombro y tríceps"
            [ngModel]="dayNames()[w.n] || ''" (ngModelChange)="setName(w.n, $event)" />
        }

        <button type="button" class="btn btn-primary btn-block" style="margin-top:28px" [disabled]="!canCreate()" (click)="create()">Crear rutina</button>
        <p class="note">Después podrás añadir los ejercicios de cada día.</p>
      </div>
    </ion-content>
  `,
})
export class PlanManualPage {
  private readonly plans = inject(PlanService);
  private readonly nav = inject(NavController);
  private readonly toastCtrl = inject(ToastController);

  week = WEEKDAYS;
  name = signal('');
  selected = signal<number[]>([]);
  dayNames = signal<Record<number, string>>({});
  chosen = computed(() => WEEKDAYS.filter((w) => this.selected().includes(w.n)));
  canCreate = computed(
    () => this.name().trim().length > 0 && this.chosen().length > 0 && this.chosen().every((w) => (this.dayNames()[w.n] || '').trim()),
  );

  isOn = (n: number) => this.selected().includes(n);
  toggle(n: number) {
    this.selected.update((s) => (s.includes(n) ? s.filter((x) => x !== n) : [...s, n]));
  }
  setName(n: number, v: string) {
    this.dayNames.update((m) => ({ ...m, [n]: v }));
  }

  async create() {
    if (!this.canCreate()) return;
    let plan;
    try {
      plan = await this.plans.createPlan(
        this.name(),
        this.chosen().map((w) => ({ name: this.dayNames()[w.n], dayOfWeek: w.n })),
      );
    } catch (e) {
      await showToast(this.toastCtrl, (e as Error).message);
      return;
    }
    await this.nav.navigateRoot('/rutinas/' + plan.id);
  }
}
