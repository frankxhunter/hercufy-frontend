import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {
  API_URL,
  AddPlanExerciseRequest,
  CreatePlanRequest,
  NewDay,
  ReorderExercisesRequest,
  TrainingPlanResponse,
  UpdateDayRequest,
  UpdatePlanExerciseRequest,
  UpdatePlanRequest,
  apiMessage,
} from '../api';
import { PlanDay, PlanExercise, TrainingPlan } from '../models';

/** Valores por defecto de un ejercicio recién añadido a un día. */
export const DEFAULT_SETS = 3;
export const DEFAULT_REPS = 10;

function toExercise(d: TrainingPlanResponse['days'][number]['exercises'][number]): PlanExercise {
  return {
    id: d.id,
    exerciseId: d.exerciseId,
    sets: d.sets,
    reps: d.reps,
    // BigDecimal llega como 60.00; en el cliente es simplemente un número en kg.
    weightKg: d.weightKg === null || d.weightKg === undefined ? null : Number(d.weightKg),
    exerciseName: d.exerciseName,
    exerciseNameEs: d.exerciseNameEs,
  };
}

function toDay(d: TrainingPlanResponse['days'][number]): PlanDay {
  return {
    id: d.id,
    name: d.name,
    dayOfWeek: d.dayOfWeek ?? null,
    exercises: (d.exercises ?? []).map(toExercise),
  };
}

export function toPlan(d: TrainingPlanResponse): TrainingPlan {
  return {
    id: d.id,
    name: d.name,
    active: d.active,
    // El backend solo tiene un tipo de calendario por ahora (WEEKDAY).
    scheduleType: 'WEEKDAY',
    days: (d.days ?? []).map(toDay),
  };
}

/**
 * Acceso a rutinas contra el backend. Cada operación granular devuelve la rutina
 * completa ya actualizada, así que la pantalla siempre se dibuja con la versión que
 * el servidor considera válida en lugar de con una suposición local.
 */
export abstract class PlanRepository {
  abstract list(): Promise<TrainingPlan[]>;
  abstract create(name: string, days: NewDay[]): Promise<TrainingPlan>;
  abstract update(planId: string, change: UpdatePlanRequest): Promise<TrainingPlan>;
  abstract remove(planId: string): Promise<void>;
  abstract addDay(planId: string, day: NewDay): Promise<TrainingPlan>;
  abstract renameDay(planId: string, dayId: string, name: string): Promise<TrainingPlan>;
  abstract removeDay(planId: string, dayId: string): Promise<TrainingPlan>;
  abstract addExercise(planId: string, dayId: string, exercise: AddPlanExerciseRequest): Promise<TrainingPlan>;
  abstract updateExercise(
    planId: string,
    dayId: string,
    entryId: string,
    values: UpdatePlanExerciseRequest,
  ): Promise<TrainingPlan>;
  abstract removeExercise(planId: string, dayId: string, entryId: string): Promise<TrainingPlan>;
  abstract reorder(planId: string, dayId: string, orderedIds: string[]): Promise<TrainingPlan>;
}

@Injectable()
export class HttpPlanRepository extends PlanRepository {
  private readonly http = inject(HttpClient);

  async list(): Promise<TrainingPlan[]> {
    const res = await this.get<TrainingPlanResponse[]>('/plans');
    return res.map(toPlan);
  }

  async create(name: string, days: NewDay[]): Promise<TrainingPlan> {
    const body: CreatePlanRequest = { name, days };
    return toPlan(await this.send<TrainingPlanResponse>('POST', '/plans', body));
  }

  async update(planId: string, change: UpdatePlanRequest): Promise<TrainingPlan> {
    return toPlan(await this.send<TrainingPlanResponse>('PATCH', this.planUrl(planId), change));
  }

  async remove(planId: string): Promise<void> {
    await firstValueFrom(this.http.delete(this.planUrl(planId)));
  }

  async addDay(planId: string, day: NewDay): Promise<TrainingPlan> {
    return toPlan(await this.send<TrainingPlanResponse>('POST', `${this.planUrl(planId)}/days`, day));
  }

  async renameDay(planId: string, dayId: string, name: string): Promise<TrainingPlan> {
    const body: UpdateDayRequest = { name };
    return toPlan(await this.send<TrainingPlanResponse>('PATCH', this.dayUrl(planId, dayId), body));
  }

  async removeDay(planId: string, dayId: string): Promise<TrainingPlan> {
    return toPlan(await this.send<TrainingPlanResponse>('DELETE', this.dayUrl(planId, dayId)));
  }

  async addExercise(planId: string, dayId: string, exercise: AddPlanExerciseRequest): Promise<TrainingPlan> {
    const url = `${this.dayUrl(planId, dayId)}/exercises`;
    return toPlan(await this.send<TrainingPlanResponse>('POST', url, exercise));
  }

  async updateExercise(
    planId: string,
    dayId: string,
    entryId: string,
    values: UpdatePlanExerciseRequest,
  ): Promise<TrainingPlan> {
    const url = `${this.dayUrl(planId, dayId)}/exercises/${entryId}`;
    return toPlan(await this.send<TrainingPlanResponse>('PUT', url, values));
  }

  async removeExercise(planId: string, dayId: string, entryId: string): Promise<TrainingPlan> {
    const url = `${this.dayUrl(planId, dayId)}/exercises/${entryId}`;
    return toPlan(await this.send<TrainingPlanResponse>('DELETE', url));
  }

  async reorder(planId: string, dayId: string, orderedIds: string[]): Promise<TrainingPlan> {
    const body: ReorderExercisesRequest = { orderedExerciseIds: orderedIds };
    const url = `${this.dayUrl(planId, dayId)}/exercises/reorder`;
    return toPlan(await this.send<TrainingPlanResponse>('PUT', url, body));
  }

  private planUrl(planId: string): string {
    return `${API_URL}/plans/${planId}`;
  }

  private dayUrl(planId: string, dayId: string): string {
    return `${this.planUrl(planId)}/days/${dayId}`;
  }

  private get<T>(path: string): Promise<T> {
    return this.request<T>(() => firstValueFrom(this.http.get<T>(`${API_URL}${path}`)));
  }

  private send<T>(method: 'POST' | 'PUT' | 'PATCH' | 'DELETE', url: string, body?: unknown): Promise<T> {
    const full = url.startsWith('http') ? url : `${API_URL}${url}`;
    return this.request<T>(() => {
      switch (method) {
        case 'POST':
          return firstValueFrom(this.http.post<T>(full, body ?? {}));
        case 'PUT':
          return firstValueFrom(this.http.put<T>(full, body ?? {}));
        case 'PATCH':
          return firstValueFrom(this.http.patch<T>(full, body ?? {}));
        case 'DELETE':
          return firstValueFrom(this.http.delete<T>(full));
      }
    });
  }

  /** Traduce los errores de texto plano del backend a mensajes presentables. */
  private async request<T>(send: () => Promise<T>): Promise<T> {
    try {
      return await send();
    } catch (e) {
      throw new Error(apiMessage(e));
    }
  }
}