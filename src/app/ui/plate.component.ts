import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { formatKg } from '../core/labels';

/** El peso, dibujado como un disco de barra. Es el elemento que se toca para ajustar la carga. */
@Component({
  selector: 'app-plate',
  standalone: true,
  template: `
    @if (readonly()) {
      <span class="plate static" [class.bw]="weightKg() === null" [attr.aria-label]="label()">
        <ng-container *ngTemplateOutlet="face" />
      </span>
    } @else {
      <button type="button" class="plate" [class.bw]="weightKg() === null" [attr.aria-label]="label()" (click)="pressed.emit()">
        <ng-container *ngTemplateOutlet="face" />
      </button>
    }
    <ng-template #face>
      @if (weightKg() !== null) {
        <span><span class="n">{{ text() }}</span><span class="u">kg</span></span>
      } @else {
        <span class="n">Sin peso</span>
      }
    </ng-template>
  `,
  imports: [NgTemplateOutlet],
  styles: [':host{display:inline-block;line-height:0}'],
})
export class PlateComponent {
  weightKg = input<number | null>(null);
  readonly = input(false);
  pressed = output<void>();
  text = computed(() => formatKg(this.weightKg()));
  label = computed(() =>
    this.weightKg() === null ? 'Ejercicio sin peso. Editar' : `${this.text()} kilos. Editar peso`,
  );
}
