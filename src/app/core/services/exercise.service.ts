import { Injectable } from '@angular/core';
import { EXERCISE_CATALOG } from '../data/exercise-catalog';
import { Exercise } from '../models';
import { EXERCISE_IMAGES_BASE } from '../config';
import { MUSCLE_GROUPS, groupOfMuscle, normalize } from '../labels';

/**
 * Catálogo de ejercicios. Hoy lee datos de demostración; al conectar el backend
 * solo cambia el origen de datos, no la API que usan las pantallas.
 */
@Injectable({ providedIn: 'root' })
export class ExerciseService {
  private readonly all = EXERCISE_CATALOG;
  private readonly byIdMap = new Map(this.all.map((e) => [e.id, e]));
  private readonly haystack = new Map(
    this.all.map((e) => [e.id, normalize(`${e.nameEs} ${e.name} ${e.equipment ?? ''}`)]),
  );

  list(): Exercise[] {
    return this.all;
  }

  byId(id: string): Exercise | undefined {
    return this.byIdMap.get(id);
  }

  imageUrl(e: Exercise | undefined, index = 0): string | null {
    const img = e?.images[index];
    return img ? EXERCISE_IMAGES_BASE + img : null;
  }

  groupOf(e: Exercise | undefined) {
    return groupOfMuscle(e?.primaryMuscles[0]);
  }

  search(query: string, groupKey: string | null = null): Exercise[] {
    const tokens = this.tokens(query);
    const group = MUSCLE_GROUPS.find((g) => g.key === groupKey);
    return this.all
      .filter((e) => !group || group.muscles.includes(e.primaryMuscles[0]))
      .filter((e) => tokens.every((t) => this.haystack.get(e.id)!.includes(t)))
      .sort((a, b) => a.nameEs.localeCompare(b.nameEs, 'es'));
  }

  /**
   * Mejor coincidencia para un texto libre. Gana la mayor proporción de palabras;
   * en empate, el ejercicio más básico (el catálogo está ordenado por popularidad).
   */
  findBestMatch(text: string): Exercise | null {
    let best: { e: Exercise; ratio: number } | null = null;
    for (const e of this.all) {
      const ratio = this.score(e, text);
      if (ratio >= 0.6 && (!best || ratio > best.ratio)) best = { e, ratio };
    }
    return best?.e ?? null;
  }

  /** Proporción de palabras del texto que aparecen en el ejercicio (0 a 1). */
  score(e: Exercise, text: string): number {
    const tokens = this.tokens(text);
    if (!tokens.length) return 0;
    const hay = this.haystack.get(e.id)!;
    return tokens.filter((t) => hay.includes(t)).length / tokens.length;
  }

  private tokens(q: string): string[] {
    const stop = new Set(['de', 'con', 'en', 'el', 'la', 'los', 'las', 'a', 'y', 'un', 'una']);
    return normalize(q)
      .split(' ')
      .filter((t) => t && !stop.has(t))
      .map((t) => (t.length > 4 ? t.replace(/s$/, '') : t));
  }
}
