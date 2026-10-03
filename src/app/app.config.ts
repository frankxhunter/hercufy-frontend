import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideIonicAngular } from '@ionic/angular';
import { routes } from './app.routes';
import { HttpPlanRepository, PlanRepository } from './core/services/plan.repository';
import { HttpExerciseRepository, ExerciseRepository } from './core/services/exercise.repository';
import { AssistantPort, LocalAssistant } from './core/services/assistant.service';
import { PlanService } from './core/services/plan.service';
import { ExerciseService } from './core/services/exercise.service';
import { AuthService } from './core/services/auth.service';
import { authInterceptor } from './core/services/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideIonicAngular({ mode: 'md' }),
    // Fuente de datos real: el backend Spring Boot es el único que decide qué es una rutina.
    { provide: PlanRepository, useClass: HttpPlanRepository },
    { provide: ExerciseRepository, useClass: HttpExerciseRepository },
    { provide: AssistantPort, useClass: LocalAssistant },
    // Antes de pintar nada: recuperar la sesión y, si la hay, cargar las rutinas del usuario.
    // Los servicios se resuelven aquí, sin await: al reanudar después de un await ya no hay
    // contexto de inyección y inject() lanzaría NG0203.
    provideAppInitializer(() => {
      const auth = inject(AuthService);
      const plans = inject(PlanService);
      const catalog = inject(ExerciseService);
      return (async () => {
        await auth.restore();
        if (auth.user()) {
          catalog.ensureIndex();
          await plans.load();
        }
      })();
    }),
  ],
};