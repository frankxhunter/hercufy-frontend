import { Component, input } from '@angular/core';

/** Marca de Hercufy: una H hecha con una barra y dos discos. */
@Component({
  selector: 'app-logo',
  standalone: true,
  template: `<svg [attr.width]="size()" [attr.height]="size()" viewBox="0 0 64 64" aria-hidden="true">
    <g fill="currentColor"><rect x="10" y="10" width="10" height="44" rx="3"/><rect x="44" y="10" width="10" height="44" rx="3"/><rect x="20" y="28" width="24" height="8" rx="2"/></g>
  </svg>`,
  styles: [':host{display:inline-flex;line-height:0}'],
})
export class LogoComponent {
  size = input(32);
}
