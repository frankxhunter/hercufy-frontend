import { Injectable, signal, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type SupportedLang = 'es' | 'en';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translate = inject(TranslateService);
  readonly currentLang = signal<SupportedLang>('es');
  readonly supportedLangs: SupportedLang[] = ['es', 'en'];

  constructor() {
    const saved = localStorage.getItem('app.lang') as SupportedLang | null;
    const initial = saved ?? 'es';
    this.currentLang.set(initial);
    this.translate.use(initial);
  }

  setLang(lang: SupportedLang) {
    this.currentLang.set(lang);
    localStorage.setItem('app.lang', lang);
    this.translate.use(lang);
  }

  toggle() {
    this.setLang(this.currentLang() === 'es' ? 'en' : 'es');
  }
}