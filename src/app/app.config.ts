import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular';
import { routes } from './app.routes';
import { MockPlanRepository, PlanRepository } from './core/services/plan.repository';
import { AssistantPort, MockAssistant } from './core/services/assistant.service';
import { PlanService } from './core/services/plan.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideIonicAngular({ mode: 'md' }),
    // Punto único de cambio al conectar el backend: sustituir los mocks por implementaciones HTTP.
    { provide: PlanRepository, useClass: MockPlanRepository },
    { provide: AssistantPort, useClass: MockAssistant },
    provideAppInitializer(() => inject(PlanService).load()),
  ],
};
