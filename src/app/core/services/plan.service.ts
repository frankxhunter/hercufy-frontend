import { Injectable, computed, effect, inject, signal, untracked } from '@angular/core';
import { PlanDay, PlanExercise, TrainingPlan } from '../models';
import { DEFAULT_REPS, DEFAULT_SETS, PlanRepository } from './plan.repository';
import { AuthService } from './auth.service';
import { NewDay } from '../api';

/** Rutina tal y como la deja el borrador de Hercules: aún sin id ni estado de activación. */
export type NewPlan = Omit<TrainingPlan, 'id' | 'active'>;

const withExercises = (d: PlanDay) => d.exercises.length > 0 && d.dayOfWeek !== null;

/**
 * Estado de las rutinas del usuario. Mantiene la lista en un signal para que las pantallas
 * la lean sincrónicamente, pero toda escritura pasa por el backend: el servidor devuelve la
 * rutina completa tras cada cambio y aquí se adopta esa versión como la buena.
 */
@Injectable({ providedIn: 'root' })
export class PlanService {
  private readonly repo = inject(PlanRepository);
  private readonly auth = inject(AuthService);

  readonly plans = signal<TrainingPlan[]>([]);
  readonly loaded = signal(false);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly activePlan = computed(() => this.plans().find((p) => p.active) ?? null);

  /** Carga en curso, compartida por todos los que esperan las rutinas. */
  private inflight: Promise<void> | null = null;

  constructor() {
    // Las rutinas son por cuenta: al entrar o salir, la lista se vuelve a pedir.
    // El efecto solo debe depender del usuario. Si load() se ejecutara dentro del efecto,
    // sus lecturas de loading/loaded también serían dependencias: cada carga completada
    // volvería a dispararlo y pediría /plans sin parar. Por eso la carga va en untracked().
    effect(() => {
      const userId = this.auth.user()?.id ?? null;
      untracked(() => {
        this.plans.set([]);
        this.loaded.set(false);
        this.error.set('');
        if (userId) void this.load();
      });
    });
  }

  /**
   * Pide las rutinas al servidor. Si ya hay una carga en curso, se devuelve esa misma
   * promesa: así quien llama (el inicializador de la app, un botón de reintentar) espera a
   * los datos de verdad en vez de resolver antes de tiempo.
   */
  load(force = false): Promise<void> {
    if (!this.auth.user()) {
      this.plans.set([]);
      this.loaded.set(false);
      return Promise.resolve();
    }
    if (!this.inflight) {
      this.inflight = this.fetch(force).finally(() => {
        this.inflight = null;
      });
      return this.inflight;
    }
    return this.inflight.then(() => (force && !this.loaded() ? this.load(true) : undefined));
  }

  private async fetch(force: boolean): Promise<void> {
    if (!force && this.loaded()) return;

    this.loading.set(true);
    this.error.set('');
    try {
      this.plans.set(await this.repo.list());
      this.loaded.set(true);
    } catch (e) {
      this.loaded.set(false);
      this.error.set((e as Error).message);
    } finally {
      this.loading.set(false);
    }
  }

  plan(id: string): TrainingPlan | undefined {
    return this.plans().find((p) => p.id === id);
  }

  day(planId: string, dayId: string): PlanDay | undefined {
    return this.plan(planId)?.days.find((d) => d.id === dayId);
  }

  async createPlan(name: string, days: NewDay[]): Promise<TrainingPlan> {
    return this.adopt(await this.repo.create(name.trim(), days));
  }

  /**
   * Guarda una rutina ya montada (por ejemplo, el borrador aceptado de Hercules). El backend
   * crea la rutina con sus días, así que los ejercicios se añaden después: uno a uno para
   * que cada uno conserve el orden que el usuario está viendo en el borrador.
   */
  async addPlan(plan: NewPlan): Promise<TrainingPlan> {
    const wanted = plan.days.filter(withExercises);
    if (!wanted.length) throw new Error('La rutina no tiene ejercicios todavía');

    const name = plan.name.trim() || 'Mi rutina';
    let current = await this.repo.create(
      name,
      wanted.map((d) => ({ name: d.name.trim(), dayOfWeek: d.dayOfWeek as number })),
    );

    for (let i = 0; i < wanted.length; i++) {
      const day = current.days[i];
      for (const pe of wanted[i].exercises) {
        current = await this.repo.addExercise(current.id, day.id, {
          exerciseId: pe.exerciseId,
          sets: pe.sets,
          reps: pe.reps,
          weightKg: pe.weightKg,
        });
      }
      this.adopt(current);
    }
    return current;
  }

  async rename(planId: string, name: string) {
    this.adopt(await this.repo.update(planId, { name: name.trim() }));
  }

  async setActive(planId: string, active: boolean) {
    this.adopt(await this.repo.update(planId, { active }));
  }

  async remove(planId: string) {
    await this.repo.remove(planId);
    this.plans.update((list) => list.filter((p) => p.id !== planId));
  }

  async addDay(planId: string, name: string, dayOfWeek: number): Promise<string> {
    const saved = this.adopt(await this.repo.addDay(planId, { name: name.trim(), dayOfWeek }));
    const day = saved.days[saved.days.length - 1];
    if (!day) throw new Error('No se ha podido crear el día.');
    return day.id;
  }

  async renameDay(planId: string, dayId: string, name: string) {
    this.adopt(await this.repo.renameDay(planId, dayId, name.trim()));
  }

  async removeDay(planId: string, dayId: string) {
    this.adopt(await this.repo.removeDay(planId, dayId));
  }

  async addExercise(
    planId: string,
    dayId: string,
    exerciseId: string,
    values?: { sets: number; reps: number; weightKg: number | null },
  ): Promise<PlanExercise> {
    const before = this.day(planId, dayId)?.exercises.length ?? 0;
    if (before === 0 && !this.day(planId, dayId)) throw new Error('Este día ya no existe.');

    const saved = this.adopt(
      await this.repo.addExercise(planId, dayId, {
        exerciseId,
        sets: values?.sets ?? DEFAULT_SETS,
        reps: values?.reps ?? DEFAULT_REPS,
        weightKg: values?.weightKg ?? null,
      }),
    );
    // El backend añade el ejercicio al final del día, así que es el último de la respuesta.
    const created = saved.days.find((d) => d.id === dayId)?.exercises[before];
    if (!created) throw new Error('No se ha podido añadir el ejercicio.');
    return created;
  }

  async updateExercise(planId: string, dayId: string, pe: PlanExercise) {
    this.adopt(
      await this.repo.updateExercise(planId, dayId, pe.id, {
        sets: pe.sets,
        reps: pe.reps,
        weightKg: pe.weightKg,
      }),
    );
  }

  async removeExercise(planId: string, dayId: string, peId: string) {
    this.adopt(await this.repo.removeExercise(planId, dayId, peId));
  }

  async moveExercise(planId: string, dayId: string, from: number, to: number) {
    const current = this.day(planId, dayId)?.exercises ?? [];
    if (to < 0 || to >= current.length || from === to) return;

    const ordered = [...current];
    const [moved] = ordered.splice(from, 1);
    ordered.splice(to, 0, moved);

    // El orden se ve al instante y se confirma con el servidor; si el servidor lo rechaza,
    // la lista vuelve a como estaba para no dejar la pantalla mintiendo.
    const ids = ordered.map((e) => e.id);
    this.patchDay(planId, dayId, ids);
    try {
      this.adopt(await this.repo.reorder(planId, dayId, ids));
    } catch (e) {
      this.patchDay(planId, dayId, current.map((e2) => e2.id));
      throw e;
    }
  }

  /** Reordena el día localmente sin ir al servidor (movimiento optimista). */
  private patchDay(planId: string, dayId: string, orderedIds: string[]) {
    this.plans.update((list) =>
      list.map((p) => {
        if (p.id !== planId) return p;
        const day = p.days.find((d) => d.id === dayId);
        if (!day) return p;
        const byId = new Map(day.exercises.map((e) => [e.id, e]));
        const next = orderedIds.map((id) => byId.get(id)).filter((e): e is PlanExercise => !!e);
        return { ...p, days: p.days.map((d) => (d.id === dayId ? { ...d, exercises: next } : d)) };
      }),
    );
  }

  /** Adopta la rutina que devuelve el backend como versión buena de la lista. */
  private adopt(plan: TrainingPlan): TrainingPlan {
    this.plans.update((list) => {
      const rest = list.filter((p) => p.id !== plan.id);
      // El servidor garantiza una sola rutina activa por usuario.
      return plan.active ? [...rest.map((p) => ({ ...p, active: false })), plan] : [...rest, plan];
    });
    this.loaded.set(true);
    return plan;
  }
}