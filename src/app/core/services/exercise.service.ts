import { Injectable, inject, signal } from '@angular/core';
import { Exercise } from '../models';
import { ExerciseRepository } from './exercise.repository';
import { MUSCLE_GROUPS, MuscleGroup, groupOfMuscle, normalize } from '../labels';

/** Tamaño de página del buscador. El backend pagina de 20 en 20 por defecto. */
export const SEARCH_PAGE_SIZE = 40;

/** Proporción de palabras del texto que hay que encontrar para dar el ejercicio por bueno. */
const MATCH_THRESHOLD = 0.6;

/**
 * Catálogo de ejercicios del backend. La búsqueda se hace en el servidor (que lo tiene
 * entero en memoria) y los resúmenes que llegan se guardan en un signal: con ese mapa los
 * listados, las miniaturas y las franjas de color se resuelven sin más peticiones, aunque
 * la pantalla se abra en frío.
 */
@Injectable({ providedIn: 'root' })
export class ExerciseService {
  private readonly repo = inject(ExerciseRepository);

  private readonly cache = signal<ReadonlyMap<string, Exercise>>(new Map());
  readonly indexLoaded = signal(false);
  private pending: Promise<void> | null = null;

  /** Carga el resumen de todo el catálogo una sola vez, en segundo plano. */
  ensureIndex(): void {
    if (this.indexLoaded() || this.pending) return;
    this.pending = this.repo
      .index()
      .then((all) => {
        this.merge(all);
        this.indexLoaded.set(true);
      })
      .catch(() => undefined)
      .finally(() => {
        this.pending = null;
      });
  }

  /** Espera a que el índice esté disponible (usado por Hercules, que necesita nombres). */
  indexReady(): Promise<void> {
    this.ensureIndex();
    return this.pending ?? Promise.resolve();
  }

  byId(id: string): Exercise | undefined {
    return this.cache().get(id);
  }

  /**
   * Ficha completa de un ejercicio (con instrucciones). Los resúmenes del índice no traen
   * instrucciones, así que la primera vez se piden al servidor; a partir de ahí se sirve de
   * la caché, que es lo que permite ir previsualizando seguidos sin agotar el límite de
   * peticiones del backend.
   */
  async detail(id: string): Promise<Exercise> {
    const cached = this.cache().get(id);
    if (cached?.instructions.length) return cached;
    const full = await this.repo.detail(id);
    this.merge([full]);
    return full;
  }

  imageUrl(e: Exercise | undefined, index = 0): string | null {
    return e?.imageUrls[index] ?? null;
  }

  groupOf(e: Exercise | undefined): MuscleGroup | undefined {
    if (!e) return undefined;
    if (e.muscleGroup) return MUSCLE_GROUPS.find((g) => g.key === e.muscleGroup);
    return groupOfMuscle(e.primaryMuscles[0]);
  }

  /** Búsqueda en el catálogo del servidor: `q` busca por nombre y material, `muscleGroup` filtra. */
  async search(query: string, groupKey: string | null, size = SEARCH_PAGE_SIZE) {
    const result = await this.repo.search(query, groupKey, size);
    this.merge(result.items);
    return result;
  }

  /**
   * Mejor coincidencia para un texto libre. Primero pregunta al servidor y, si no hay
   * candidatos o la búsqueda falla, recorre el índice local. Gana la mayor proporción de
   * palabras del texto presentes en el nombre o el material del ejercicio.
   */
  async findBestMatch(text: string): Promise<Exercise | null> {
    const q = text.trim();
    if (!q) return null;

    let candidates: Exercise[] = [];
    try {
      candidates = (await this.repo.search(q, null, 15)).items;
    } catch {
      // Sin servidor no hay catálogo: el índice local es el único camino.
    }
    let best = this.best(candidates, q);
    if (best) return best;

    await this.indexReady();
    return this.best([...this.cache().values()], q);
  }

  /** Proporción de palabras del texto que aparecen en el ejercicio (0 a 1). */
  score(e: Exercise, text: string): number {
    const tokens = this.tokens(text);
    if (!tokens.length) return 0;
    const haystack = normalize(`${e.nameEs} ${e.name} ${e.equipment ?? ''}`);
    return tokens.filter((t) => haystack.includes(t)).length / tokens.length;
  }

  private best(candidates: Exercise[], text: string): Exercise | null {
    let winner: { e: Exercise; ratio: number } | null = null;
    for (const e of candidates) {
      const ratio = this.score(e, text);
      if (ratio >= MATCH_THRESHOLD && (!winner || ratio > winner.ratio)) winner = { e, ratio };
    }
    return winner?.e ?? null;
  }

  /** Inserta en la caché; un detalle siempre pisa al resumen anterior del mismo ejercicio. */
  private merge(exercises: Exercise[]): void {
    if (!exercises.length) return;
    const next = new Map(this.cache());
    for (const e of exercises) next.set(e.id, e);
    this.cache.set(next);
  }

  private tokens(query: string): string[] {
    const stop = new Set(['de', 'con', 'en', 'el', 'la', 'los', 'las', 'a', 'y', 'un', 'una']);
    return normalize(query)
      .split(' ')
      .filter((t) => t && !stop.has(t))
      .map((t) => (t.length > 4 ? t.replace(/s$/, '') : t));
  }
}