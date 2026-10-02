import { Injectable } from '@angular/core';
import { TrainingPlan } from '../models';
import { MOCK_PLANS } from '../data/mock-plans';

/**
 * Contrato de acceso a datos de rutinas. Las pantallas nunca conocen la fuente:
 * hoy es MockPlanRepository (memoria); mañana, un repositorio HTTP contra Spring Boot.
 */
export abstract class PlanRepository {
  abstract list(): Promise<TrainingPlan[]>;
  abstract save(plan: TrainingPlan): Promise<TrainingPlan>;
  abstract remove(id: string): Promise<void>;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

@Injectable()
export class MockPlanRepository extends PlanRepository {
  private plans: TrainingPlan[] = structuredClone(MOCK_PLANS);

  async list(): Promise<TrainingPlan[]> {
    await wait(120);
    return structuredClone(this.plans);
  }

  async save(plan: TrainingPlan): Promise<TrainingPlan> {
    await wait(60);
    const i = this.plans.findIndex((p) => p.id === plan.id);
    if (i >= 0) this.plans[i] = structuredClone(plan);
    else this.plans.push(structuredClone(plan));
    // Solo una rutina activa a la vez.
    if (plan.active) this.plans = this.plans.map((p) => (p.id === plan.id ? p : { ...p, active: false }));
    return structuredClone(plan);
  }

  async remove(id: string): Promise<void> {
    await wait(60);
    this.plans = this.plans.filter((p) => p.id !== id);
  }
}
