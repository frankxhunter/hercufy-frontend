import { Injectable, computed, inject, signal } from '@angular/core';
import { PlanDay, PlanExercise, TrainingPlan } from '../models';
import { PlanRepository } from './plan.repository';
import { uid } from '../labels';

@Injectable({ providedIn: 'root' })
export class PlanService {
  private readonly repo = inject(PlanRepository);

  readonly plans = signal<TrainingPlan[]>([]);
  readonly loaded = signal(false);
  readonly activePlan = computed(() => this.plans().find((p) => p.active) ?? null);

  async load(): Promise<void> {
    if (this.loaded()) return;
    this.plans.set(await this.repo.list());
    this.loaded.set(true);
  }

  plan(id: string): TrainingPlan | undefined {
    return this.plans().find((p) => p.id === id);
  }

  day(planId: string, dayId: string): PlanDay | undefined {
    return this.plan(planId)?.days.find((d) => d.id === dayId);
  }

  async createPlan(name: string, days: { name: string; dayOfWeek: number }[]): Promise<TrainingPlan> {
    const plan: TrainingPlan = {
      id: uid(),
      name: name.trim(),
      active: this.plans().length === 0,
      scheduleType: 'WEEKDAY',
      days: days.map((d) => ({ id: uid(), name: d.name.trim(), dayOfWeek: d.dayOfWeek, exercises: [] })),
    };
    return this.persist(plan);
  }

  /** Guarda una rutina ya construida (por ejemplo, un borrador aceptado de Hercules). */
  async addPlan(plan: Omit<TrainingPlan, 'id' | 'active'>): Promise<TrainingPlan> {
    return this.persist({ ...plan, id: uid(), active: this.plans().length === 0 });
  }

  async rename(planId: string, name: string) {
    await this.mutate(planId, (p) => { p.name = name.trim(); });
  }

  async setActive(planId: string, active: boolean) {
    await this.mutate(planId, (p) => { p.active = active; });
    if (active) this.plans.update((list) => list.map((p) => ({ ...p, active: p.id === planId })));
  }

  async remove(planId: string) {
    await this.repo.remove(planId);
    this.plans.update((list) => list.filter((p) => p.id !== planId));
  }

  async addDay(planId: string, name: string, dayOfWeek: number): Promise<string> {
    const dayId = uid();
    await this.mutate(planId, (p) => {
      p.days.push({ id: dayId, name: name.trim(), dayOfWeek, exercises: [] });
    });
    return dayId;
  }

  async renameDay(planId: string, dayId: string, name: string) {
    await this.mutate(planId, (p) => { const d = p.days.find((x) => x.id === dayId); if (d) d.name = name.trim(); });
  }

  async removeDay(planId: string, dayId: string) {
    await this.mutate(planId, (p) => { p.days = p.days.filter((d) => d.id !== dayId); });
  }

  async addExercise(planId: string, dayId: string, exerciseId: string): Promise<PlanExercise> {
    const pe: PlanExercise = { id: uid(), exerciseId, sets: 3, reps: 10, weightKg: null };
    await this.mutate(planId, (p) => p.days.find((d) => d.id === dayId)?.exercises.push(pe));
    return pe;
  }

  async updateExercise(planId: string, dayId: string, pe: PlanExercise) {
    await this.mutate(planId, (p) => {
      const d = p.days.find((x) => x.id === dayId);
      const i = d?.exercises.findIndex((e) => e.id === pe.id) ?? -1;
      if (d && i >= 0) d.exercises[i] = pe;
    });
  }

  async removeExercise(planId: string, dayId: string, peId: string) {
    await this.mutate(planId, (p) => {
      const d = p.days.find((x) => x.id === dayId);
      if (d) d.exercises = d.exercises.filter((e) => e.id !== peId);
    });
  }

  async moveExercise(planId: string, dayId: string, from: number, to: number) {
    await this.mutate(planId, (p) => {
      const list = p.days.find((x) => x.id === dayId)?.exercises;
      if (!list || to < 0 || to >= list.length) return;
      const [item] = list.splice(from, 1);
      list.splice(to, 0, item);
    });
  }

  private async mutate(planId: string, fn: (p: TrainingPlan) => void) {
    const current = this.plan(planId);
    if (!current) return;
    const next = structuredClone(current);
    fn(next);
    // Se actualiza la vista al instante y se confirma con el repositorio.
    this.plans.update((list) => list.map((p) => (p.id === planId ? next : p)));
    await this.repo.save(next);
  }

  private async persist(plan: TrainingPlan): Promise<TrainingPlan> {
    const saved = await this.repo.save(plan);
    this.plans.update((list) => [...list.map((p) => (saved.active ? { ...p, active: false } : p)), saved]);
    return saved;
  }
}
