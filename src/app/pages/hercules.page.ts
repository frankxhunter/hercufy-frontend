import { Component, ViewChild, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonBackButton, IonButtons, IonContent, IonFooter, IonHeader, IonIcon, IonTitle, IonToolbar, ModalController, NavController, ToastController } from '@ionic/angular';
import { AssistantPort } from '../core/services/assistant.service';
import { PlanService } from '../core/services/plan.service';
import { ChatMessage, PlanDraft, UnresolvedItem } from '../core/models';
import { showToast } from '../core/util';
import { uid } from '../core/labels';
import { DraftPreviewComponent } from '../ui/draft-preview.component';
import { ExercisePickerModal } from '../ui/exercise-picker.modal';

const SAMPLE = `Lunes: Pecho y tríceps
Press banca 4x8 60kg
Press inclinado con mancuernas 3x10 22kg
Fondos 3x10
Jueves: Pierna
Sentadilla 4x8 80kg
Prensa 3x12 140kg
Curl femoral 3x12 35kg
Elevación de gemelos en el sitio 4x15`;

@Component({
  selector: 'app-hercules',
  standalone: true,
  imports: [FormsModule, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonFooter, IonIcon, DraftPreviewComponent],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start"><ion-back-button defaultHref="/rutinas/nueva" text="" /></ion-buttons>
        <ion-title>Hercules</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="wrap">
        <div class="msgs" aria-live="polite">
          <div style="display:flex;gap:10px;align-items:flex-start">
            <span class="avatar" aria-hidden="true">H</span>
            <div class="msg bot" style="max-width:100%">Soy Hercules. Cuéntame qué quieres entrenar: cuántos días a la semana, qué músculos, tu objetivo. También puedes pegar una rutina que ya tengas, con sus pesos y repeticiones, y la convierto.</div>
          </div>

          @if (messages().length === 0) {
            <div class="suggest">
              @for (s of suggestions; track s) {
                <button type="button" class="chip" (click)="use(s)">{{ s }}</button>
              }
              <button type="button" class="chip" (click)="text.set(sample)">Pegar una rutina de ejemplo</button>
            </div>
          }

          @for (m of messages(); track m.id) {
            <div [class]="'msg ' + (m.role === 'user' ? 'user' : 'bot')" [id]="'m-' + m.id">{{ m.text }}</div>
          }
          @if (busy()) {
            <div class="msg bot" aria-label="Hercules está pensando"><span class="typing"><i></i><i></i><i></i></span></div>
          }
        </div>

        @if (draft(); as d) {
          <app-draft-preview [draft]="d" (renamed)="rename($event)" (accept)="accept()" (discard)="discard()"
            (resolve)="resolve($event)" (skip)="skip($event)" (openExercise)="open($event)" />
        }
      </div>
    </ion-content>

    <ion-footer>
      <div class="composer">
        <textarea #box class="field" rows="2" [placeholder]="draft() ? 'Pide un cambio: «cámbiame el press banca por…»' : 'Describe tu rutina ideal o pega la que ya tienes'"
          aria-label="Mensaje para Hercules" [ngModel]="text()" (ngModelChange)="text.set($event)" (keydown.enter)="onEnter($event)"></textarea>
        <button type="button" class="send" (click)="send()" [disabled]="busy() || !text().trim()" aria-label="Enviar"><ion-icon name="send" /></button>
      </div>
    </ion-footer>
  `,
})
export class HerculesPage {
  private readonly assistant = inject(AssistantPort);
  private readonly plans = inject(PlanService);
  private readonly modal = inject(ModalController);
  private readonly nav = inject(NavController);
  private readonly toastCtrl = inject(ToastController);
  @ViewChild(IonContent) content?: IonContent;

  messages = signal<ChatMessage[]>([]);
  draft = signal<PlanDraft | null>(null);
  text = signal('');
  busy = signal(false);
  sample = SAMPLE;
  suggestions = [
    'Rutina de 4 días para ganar masa muscular',
    'Tres días a la semana, soy principiante',
    'Cinco días de fuerza con pecho y espalda',
  ];

  use(s: string) {
    this.text.set(s);
    this.send();
  }

  onEnter(ev: Event) {
    if ((ev as KeyboardEvent).shiftKey) return;
    ev.preventDefault();
    this.send();
  }

  async send() {
    const t = this.text().trim();
    if (!t || this.busy()) return;
    this.push('user', t);
    this.text.set('');
    this.busy.set(true);
    this.scroll();
    try {
      const current = this.draft();
      const res = current ? await this.assistant.refine(current, t) : await this.assistant.createDraft(t);
      this.draft.set(res.draft);
      this.busy.set(false);
      // Se muestra el inicio de la respuesta, con la propuesta justo debajo.
      this.scrollTo(this.push('assistant', res.reply));
    } catch {
      this.busy.set(false);
      this.scrollTo(this.push('assistant', 'No he podido responder ahora mismo. Inténtalo de nuevo en un momento.'));
    }
  }

  rename(name: string) {
    this.draft.update((d) => (d ? { ...d, name } : d));
  }

  discard() {
    this.draft.set(null);
    this.messages.set([]);
    this.text.set('');
  }

  skip(u: UnresolvedItem) {
    this.draft.update((d) => (d ? { ...d, unresolved: d.unresolved.filter((x) => x.id !== u.id) } : d));
  }

  async resolve(u: UnresolvedItem) {
    const m = await this.modal.create({ component: ExercisePickerModal });
    await m.present();
    const { data, role } = await m.onWillDismiss<string>();
    if (role !== 'pick' || !data) return;
    this.draft.update((d) => {
      if (!d) return d;
      const days = d.days.map((day) =>
        day.id === u.dayId
          ? { ...day, exercises: [...day.exercises, { id: uid(), exerciseId: data, sets: u.sets, reps: u.reps, weightKg: u.weightKg }] }
          : day,
      );
      return { ...d, days, unresolved: d.unresolved.filter((x) => x.id !== u.id) };
    });
  }

  open(exerciseId: string) {
    this.nav.navigateForward('/ejercicio/' + exerciseId);
  }

  async accept() {
    const d = this.draft();
    if (!d) return;
    const days = d.days.filter((x) => x.exercises.length > 0);
    if (days.length === 0) {
      await showToast(this.toastCtrl, 'La rutina no tiene ejercicios todavía');
      return;
    }
    let plan;
    try {
      // El backend crea la rutina y luego los ejercicios de uno en uno: si algo falla, se avisa
      // y el borrador sigue en pantalla para reintentarlo.
      plan = await this.plans.addPlan({ name: d.name.trim() || 'Mi rutina', scheduleType: 'WEEKDAY', days });
    } catch (e) {
      await showToast(this.toastCtrl, (e as Error).message);
      return;
    }
    await showToast(this.toastCtrl, 'Rutina creada');
    await this.nav.navigateRoot('/rutinas/' + plan.id);
  }

  private push(role: ChatMessage['role'], text: string): string {
    const id = uid();
    this.messages.update((m) => [...m, { id, role, text }]);
    return id;
  }

  private scrollTo(messageId: string) {
    setTimeout(() => document.getElementById('m-' + messageId)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  }

  private scroll() {
    setTimeout(() => this.content?.scrollToBottom(250), 60);
  }
}
