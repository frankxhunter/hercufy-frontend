import { Component, input, model } from '@angular/core';
import { formatKg } from '../core/labels';

@Component({
  selector: 'app-stepper',
  standalone: true,
  template: `
    <div class="stepper">
      <span class="lbl">{{ label() }}</span>
      <div class="ctl">
        <button type="button" class="step-btn" (click)="change(-step())" [attr.aria-label]="'Bajar ' + label()">−</button>
        <input class="step-val" type="text" inputmode="decimal" [value]="fmt(value())" (change)="typed($event)" [attr.aria-label]="label()" />
        <button type="button" class="step-btn" (click)="change(step())" [attr.aria-label]="'Subir ' + label()">+</button>
      </div>
    </div>
  `,
})
export class StepperComponent {
  label = input.required<string>();
  value = model.required<number>();
  step = input(1);
  min = input(0);
  max = input(999);
  fmt = (n: number) => formatKg(n);

  change(delta: number) {
    this.set(this.value() + delta);
  }

  typed(ev: Event) {
    const el = ev.target as HTMLInputElement;
    const n = parseFloat(el.value.replace(',', '.'));
    this.set(Number.isNaN(n) ? this.value() : n);
    el.value = this.fmt(this.value());
  }

  private set(n: number) {
    this.value.set(Math.min(this.max(), Math.max(this.min(), Math.round(n * 100) / 100)));
  }
}
