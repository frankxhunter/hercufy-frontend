import { Component, inject } from '@angular/core';
import { IonContent, IonIcon, NavController } from '@ionic/angular';
import { PlanService } from '../core/services/plan.service';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [IonContent, IonIcon],
  template: `
    <ion-content>
      <div class="wrap">
        <header class="hero">
          <h1 class="display-xl">Rutinas</h1>
          <p class="hero-sub">{{ plans.plans().length === 1 ? '1 rutina guardada' : plans.plans().length + ' rutinas guardadas' }}</p>
        </header>
        <div class="section-gap">
          @for (p of plans.plans(); track p.id) {
            <button type="button" class="list-row" (click)="go('/rutinas/' + p.id)">
              <span class="grow">
                <span class="title">{{ p.name }}</span>
                <span class="sub">{{ p.days.length }} {{ p.days.length === 1 ? 'día' : 'días' }} de entrenamiento</span>
              </span>
              @if (p.active) { <span class="pill">Activa</span> }
              <ion-icon class="chev" name="chevron-forward" />
            </button>
          } @empty {
            @if (plans.loading()) {
              <p class="empty"><strong>Cargando tus rutinas…</strong>Un momento.</p>
            } @else if (plans.error(); as err) {
              <div class="empty"><strong>No hemos podido cargar tus rutinas</strong>{{ err }}
                <div style="margin-top:18px"><button type="button" class="btn" (click)="plans.load(true)">Reintentar</button></div>
              </div>
            } @else {
              <p class="empty"><strong>Todavía no hay rutinas</strong>Crea la primera para empezar a llevar tu entrenamiento.</p>
            }
          }
        </div>
        <button type="button" class="btn btn-primary btn-block" style="margin-top:24px" (click)="go('/rutinas/nueva')">
          <ion-icon name="add" /> Nueva rutina
        </button>
      </div>
    </ion-content>
  `,
})
export class PlansPage {
  readonly plans = inject(PlanService);
  private readonly nav = inject(NavController);
  go(path: string) { this.nav.navigateForward(path); }
}
