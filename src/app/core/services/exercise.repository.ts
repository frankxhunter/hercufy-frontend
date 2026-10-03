import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {
  API_URL,
  ExerciseDetailResponse,
  ExerciseSummaryResponse,
  Page,
  apiMessage,
} from '../api';
import { Exercise } from '../models';
import { groupOfMuscle } from '../labels';

export interface ExerciseSearch {
  items: Exercise[];
  total: number;
}

/** El backend guarda el catálogo entero en memoria, así que su búsqueda es instantánea. */
export const CATALOG_PAGE_MAX = 1000;

function nonEmpty(value: string | null | undefined): string | null {
  return value ? value : null;
}

/** El resumen no trae los músculos secundarios ni las instrucciones; se dejan vacíos. */
export function toExerciseSummary(d: ExerciseSummaryResponse): Exercise {
  return {
    id: d.id,
    name: d.name,
    nameEs: d.nameEs,
    translated: d.translated,
    level: d.level,
    mechanic: null,
    force: null,
    equipment: nonEmpty(d.equipment),
    category: d.category,
    primaryMuscles: d.primaryMuscle ? [d.primaryMuscle] : [],
    secondaryMuscles: [],
    instructions: [],
    imageUrls: d.imageUrls ?? [],
    muscleGroup: nonEmpty(d.muscleGroup),
  };
}

/** El detalle no trae la clave de grupo: se deduce del músculo principal. */
export function toExerciseDetail(d: ExerciseDetailResponse): Exercise {
  const primaryMuscles = d.primaryMuscles ?? [];
  return {
    id: d.id,
    name: d.name,
    nameEs: d.nameEs,
    translated: d.translated,
    level: d.level,
    mechanic: nonEmpty(d.mechanic),
    force: nonEmpty(d.force),
    equipment: nonEmpty(d.equipment),
    category: d.category,
    primaryMuscles,
    secondaryMuscles: d.secondaryMuscles ?? [],
    instructions: d.instructions ?? [],
    imageUrls: d.imageUrls ?? [],
    muscleGroup: groupOfMuscle(primaryMuscles[0])?.key ?? null,
  };
}

export abstract class ExerciseRepository {
  /** Resumen de todo el catálogo, para pintar listas y miniaturas sin pedir un detalle cada vez. */
  abstract index(): Promise<Exercise[]>;
  abstract search(query: string, muscleGroup: string | null, size: number): Promise<ExerciseSearch>;
  abstract detail(id: string): Promise<Exercise>;
}

@Injectable()
export class HttpExerciseRepository extends ExerciseRepository {
  private readonly http = inject(HttpClient);

  async index(): Promise<Exercise[]> {
    const page = await this.get<Page<ExerciseSummaryResponse>>(new HttpParams().set('size', CATALOG_PAGE_MAX));
    return page.content.map(toExerciseSummary);
  }

  async search(query: string, muscleGroup: string | null, size: number): Promise<ExerciseSearch> {
    let params = new HttpParams().set('size', size);
    const q = query.trim();
    if (q) params = params.set('q', q);
    if (muscleGroup) params = params.set('muscleGroup', muscleGroup);

    const page = await this.get<Page<ExerciseSummaryResponse>>(params);
    return { items: page.content.map(toExerciseSummary), total: page.totalElements };
  }

  async detail(id: string): Promise<Exercise> {
    const dto = await firstValueFrom(
      this.http.get<ExerciseDetailResponse>(`${API_URL}/exercises/${encodeURIComponent(id)}`),
    );
    return toExerciseDetail(dto);
  }

  private async get<T>(params: HttpParams): Promise<T> {
    try {
      return await firstValueFrom(this.http.get<T>(`${API_URL}/exercises`, { params }));
    } catch (e) {
      throw new Error(apiMessage(e));
    }
  }
}