import { Component, inject } from '@angular/core';
import { IonItem, IonLabel, IonSelect, IonSelectOption } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService, SupportedLang } from '../core/services/language.service';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [IonItem, IonLabel, IonSelect, IonSelectOption, TranslatePipe],
  template: `
    <ion-item>
      <ion-label position="stacked">{{ 'common.language' | translate }}</ion-label>
      <ion-select [value]="currentLang()" (ionChange)="onChange($event)" interface="popover">
        @for (l of supportedLangs; track l) {
          <ion-select-option [value]="l">{{ langName(l) }}</ion-select-option>
        }
      </ion-select>
    </ion-item>
  `,
})
export class LanguageSelectorComponent {
  private readonly langSvc = inject(LanguageService);

  readonly currentLang = this.langSvc.currentLang;
  readonly supportedLangs = this.langSvc.supportedLangs;

  onChange(ev: CustomEvent) {
    const lang = ev.detail.value as SupportedLang;
    this.langSvc.setLang(lang);
  }

  langName(code: SupportedLang): string {
    return code === 'es' ? 'Español' : 'English';
  }
}