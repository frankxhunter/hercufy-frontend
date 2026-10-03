import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { IonContent, IonToggle, ModalController } from '@ionic/angular';
import { ExerciseService } from '../core/services/exercise.service';
import { MUSCLE_ES } from '../core/labels';
import { StepperComponent } from './stepper.component';
import { ExerciseThumbComponent } from './exercise-thumb.component';

export interface EditResult { sets: number; reps: number; weightKg: number | null }

@Component({
  selector: 'app-edit-exercise-modal',
  standalone: true,
  imports: [IonContent, IonToggle, StepperComponent, ExerciseThumbComponent],
  template: `
    <ion-content>
      <div class="sheet-body">
        <div class="sheet-head">
          <app-exercise-thumb [exerciseId]="exerciseId" />
          <div>
            <h2>{{ name }}</h2>
            <p>{{ muscle }}</p>
          </div>
        </div>

        <div class="toggle-row">
          <span>Usa peso</span>
          <ion-toggle [checked]="hasWeight()" (ionChange)="hasWeight.set($event.detail.checked)" aria-label="Usa peso" />
        </div>
        @if (hasWeight()) {
          <app-stepper label="Peso en kg" [(value)]="weight" [step]="2.5" [min]="0" [max]="500" />
        }
        <app-stepper label="Series" [(value)]="setsV" [step]="1" [min]="1" [max]="12" />
        <app-stepper label="Repeticiones" [(value)]="repsV" [step]="1" [min]="1" [max]="100" />

        <div class="sheet-actions">
          <button type="button" class="btn btn-primary" (click)="save()">Guardar cambios</button>
          @if (canRemove) {
            <button type="button" class="btn btn-danger" (click)="remove()">Quitar ejercicio</button>
          }
        </div>
      </div>
    </ion-content>
  `,
})
export class EditExerciseModal implements OnInit {
  private readonly modalCtrl = inject(ModalController);
  private readonly catalog = inject(ExerciseService);

  @Input() exerciseId!: string;
  @Input() sets = 3;
  @Input() reps = 10;
  @Input() weightKg: number | null = null;
  @Input() canRemove = false;

  name = '';
  muscle = '';
  hasWeight = signal(true);
  weight = signal(20);
  setsV = signal(3);
  repsV = signal(10);

  ngOnInit() {
    const ex = this.catalog.byId(this.exerciseId);
    this.name = ex?.nameEs || this.exerciseId;
    this.muscle = MUSCLE_ES[ex?.primaryMuscles[0] ?? ''] ?? '';
    this.hasWeight.set(this.weightKg !== null);
    this.weight.set(this.weightKg ?? 20);
    this.setsV.set(this.sets);
    this.repsV.set(this.reps);
  }

  save() {
    const result: EditResult = {
      sets: this.setsV(),
      reps: this.repsV(),
      weightKg: this.hasWeight() ? this.weight() : null,
    };
    this.modalCtrl.dismiss(result, 'save');
  }

  remove() {
    this.modalCtrl.dismiss(null, 'remove');
  }
}
