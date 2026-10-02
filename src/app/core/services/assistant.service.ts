import { Injectable, inject } from '@angular/core';
import { PlanDay, PlanDraft, PlanExercise, UnresolvedItem } from '../models';
import { ExerciseService } from './exercise.service';
import { WEEKDAYS, normalize, uid } from '../labels';

export interface AssistantResult {
  draft: PlanDraft;
  reply: string;
}

/**
 * Contrato del asistente Hercules. Hoy responde MockAssistant (reglas locales);
 * al conectar el backend se sustituye por un servicio HTTP con el mismo contrato.
 */
export abstract class AssistantPort {
  abstract createDraft(prompt: string): Promise<AssistantResult>;
  abstract refine(draft: PlanDraft, message: string): Promise<AssistantResult>;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

type Row = [string, number, number, number | null];
const TEMPLATES: Record<string, { name: string; rows: Row[] }> = {
  pecho: { name: 'Pecho y tríceps', rows: [
    ['Barbell_Bench_Press_-_Medium_Grip', 4, 8, 50], ['Incline_Dumbbell_Press', 3, 10, 18],
    ['Cable_Crossover', 3, 12, 15], ['Triceps_Pushdown', 3, 12, 25], ['Lying_Triceps_Press', 3, 10, 20]] },
  espalda: { name: 'Espalda y bíceps', rows: [
    ['Pullups', 4, 8, null], ['Bent_Over_Barbell_Row', 4, 8, 50], ['Seated_Cable_Rows', 3, 10, 45],
    ['Barbell_Curl', 3, 10, 25], ['Hammer_Curls', 3, 12, 12]] },
  pierna: { name: 'Pierna', rows: [
    ['Barbell_Full_Squat', 4, 8, 70], ['Romanian_Deadlift', 3, 10, 60], ['Leg_Press', 3, 12, 120],
    ['Leg_Extensions', 3, 12, 40], ['Lying_Leg_Curls', 3, 12, 35], ['Standing_Calf_Raises', 4, 15, 60]] },
  hombro: { name: 'Hombro y core', rows: [
    ['Standing_Military_Press', 4, 8, 35], ['Side_Lateral_Raise', 4, 12, 8], ['Face_Pull', 3, 15, 20],
    ['Hanging_Leg_Raise', 3, 12, null], ['Cable_Crunch', 3, 15, 30]] },
  brazos: { name: 'Brazos', rows: [
    ['Barbell_Curl', 3, 10, 25], ['Close-Grip_Barbell_Bench_Press', 3, 8, 45], ['Hammer_Curls', 3, 12, 12],
    ['Dips_-_Triceps_Version', 3, 10, null], ['Preacher_Curl', 3, 10, 20]] },
  cuerpo: { name: 'Cuerpo completo', rows: [
    ['Barbell_Full_Squat', 3, 8, 60], ['Barbell_Bench_Press_-_Medium_Grip', 3, 8, 45],
    ['Bent_Over_Barbell_Row', 3, 8, 45], ['Standing_Military_Press', 3, 10, 25], ['Barbell_Curl', 2, 12, 20]] },
  core: { name: 'Core y abdomen', rows: [
    ['Hanging_Leg_Raise', 3, 12, null], ['Cable_Crunch', 3, 15, 30], ['Cable_Seated_Crunch', 3, 15, 25],
    ['Crunches', 3, 20, null]] },
};

const DEFAULT_SPLIT: Record<number, string[]> = {
  2: ['cuerpo', 'cuerpo'], 3: ['pecho', 'espalda', 'pierna'], 4: ['pecho', 'espalda', 'pierna', 'hombro'],
  5: ['pecho', 'espalda', 'pierna', 'hombro', 'brazos'], 6: ['pecho', 'espalda', 'pierna', 'pecho', 'espalda', 'pierna'],
};
const DOWS: Record<number, number[]> = {
  1: [1], 2: [1, 4], 3: [1, 3, 5], 4: [1, 2, 4, 5], 5: [1, 2, 3, 5, 6], 6: [1, 2, 3, 4, 5, 6],
};
const FOCUS: [string, RegExp][] = [
  ['cuerpo', /cuerpo completo|full body/], ['pecho', /pecho|pectoral/], ['espalda', /espalda|dorsal/],
  ['pierna', /pierna|gluteo|cuadricep/], ['hombro', /hombro/], ['brazos', /brazo|biceps|triceps/],
  ['core', /abdomen|abdominal|\bcore\b/],
];
const NUM_WORDS: Record<string, number> = { dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6 };
const DAY_WORDS = 'lunes|martes|miercoles|jueves|viernes|sabado|domingo';

@Injectable()
export class MockAssistant extends AssistantPort {
  private readonly catalog = inject(ExerciseService);

  async createDraft(prompt: string): Promise<AssistantResult> {
    await wait(1100);
    return this.fromPasted(prompt) ?? this.fromDescription(prompt);
  }

  async refine(draft: PlanDraft, message: string): Promise<AssistantResult> {
    await wait(700);
    const d = structuredClone(draft);
    const n = normalize(message);

    const swap = n.match(/^(?:cambia|cambiame|sustituye|sustituyeme|reemplaza|reemplazame)\s+(?:el |la |los |las )?(.+?)\s+por\s+(.+)$/);
    if (swap) {
      const target = this.findInDraft(d, swap[1]);
      if (!target) return { draft: d, reply: `No veo «${swap[1]}» en la rutina. Dime el nombre tal como aparece en la lista.` };
      const next = this.catalog.findBestMatch(swap[2]);
      if (!next) return { draft: d, reply: `No encuentro «${swap[2]}» en el catálogo. Prueba con otro nombre, por ejemplo «press inclinado con mancuernas».` };
      const before = this.catalog.byId(target.exerciseId)!;
      target.exerciseId = next.id;
      if (next.equipment === 'body only') target.weightKg = null;
      return { draft: d, reply: `Hecho: cambié ${before.nameEs.toLowerCase()} por ${next.nameEs.toLowerCase()}. Mantengo las series y repeticiones; ajusta el peso cuando lo pruebes.` };
    }

    const remove = n.match(/^(?:quita|quitame|elimina|eliminame|borra|borrame|saca)\s+(?:el |la |los |las )?(.+)$/);
    if (remove) {
      const target = this.findInDraft(d, remove[1]);
      if (!target) return { draft: d, reply: `No veo «${remove[1]}» en la rutina.` };
      const name = this.catalog.byId(target.exerciseId)!.nameEs.toLowerCase();
      d.days.forEach((day) => (day.exercises = day.exercises.filter((e) => e.id !== target.id)));
      return { draft: d, reply: `Quité ${name} de la rutina.` };
    }

    const add = n.match(new RegExp(`^(?:anade|anademe|agrega|agregame|incluye|mete|metele)\\s+(?:el |la |los |las )?(.+?)(?:\\s+(?:el|en el|al|los)\\s+(${DAY_WORDS}))?$`));
    if (add) {
      const ex = this.catalog.findBestMatch(add[1]);
      if (!ex) return { draft: d, reply: `No encuentro «${add[1]}» en el catálogo. Prueba con otro nombre.` };
      const dow = add[2] ? WEEKDAYS.find((w) => normalize(w.name) === add[2])?.n : undefined;
      const day = d.days.find((x) => x.dayOfWeek === dow) ?? d.days[d.days.length - 1];
      if (!day) return { draft: d, reply: 'La rutina todavía no tiene días donde añadirlo.' };
      day.exercises.push({ id: uid(), exerciseId: ex.id, sets: 3, reps: 10, weightKg: null });
      return { draft: d, reply: `Añadí ${ex.nameEs.toLowerCase()} a «${day.name}» con 3 series de 10 repeticiones.` };
    }

    return { draft: d, reply: 'Puedo cambiar, quitar o añadir ejercicios. Por ejemplo: «cámbiame el press banca por press inclinado con mancuernas», «quita las dominadas» o «añade plancha el viernes».' };
  }

  // Lo que el usuario describe en lenguaje natural.
  private fromDescription(prompt: string): AssistantResult {
    const n = normalize(prompt);
    const numeric = n.match(/(\d)\s*dias?/);
    const worded = n.match(new RegExp(`\\b(${Object.keys(NUM_WORDS).join('|')})\\s+dias`));
    const count = numeric ? +numeric[1] : worded ? NUM_WORDS[worded[1]] : null;

    const focus = FOCUS.map(([key, re]) => ({ key, i: n.search(re) }))
      .filter((f) => f.i >= 0).sort((a, b) => a.i - b.i).map((f) => f.key);

    let keys = focus.length ? focus : DEFAULT_SPLIT[Math.min(6, Math.max(2, count ?? 4))];
    if (count && focus.length && focus.length < count) keys = Array.from({ length: count }, (_, i) => focus[i % focus.length]);
    keys = keys.slice(0, 6);

    const strength = /fuerza/.test(n);
    const cut = /definicion|definir|perder grasa|quemar/.test(n);
    const beginner = /principiante|empezar|empiezo|nunca/.test(n);
    const seen: Record<string, number> = {};
    const dows = DOWS[keys.length];

    const days: PlanDay[] = keys.map((key, i) => {
      const t = TEMPLATES[key];
      seen[key] = (seen[key] ?? 0) + 1;
      const suffix = keys.filter((k) => k === key).length > 1 ? ` ${'ABC'[seen[key] - 1]}` : '';
      return {
        id: uid(), name: t.name + suffix, dayOfWeek: dows[i],
        exercises: t.rows.map(([exerciseId, sets, reps, w], j): PlanExercise => ({
          id: uid(), exerciseId,
          sets: strength && j < 2 ? Math.min(5, sets + 1) : beginner ? Math.min(3, sets) : sets,
          reps: strength && j < 2 ? 5 : cut ? reps + 4 : reps,
          weightKg: w === null ? null : beginner ? Math.max(2.5, Math.round((w * 0.6) / 2.5) * 2.5) : w,
        })),
      };
    });

    const name = strength ? 'Rutina de fuerza' : cut ? 'Rutina de definición' : /masa|volumen|hipertrofia|musculo/.test(n) ? 'Rutina de volumen' : `Rutina de ${days.length} días`;
    const total = days.reduce((s, d) => s + d.exercises.length, 0);
    return {
      draft: { name, days, unresolved: [] },
      reply: `Te he preparado una rutina de ${days.length} ${days.length === 1 ? 'día' : 'días'} con ${total} ejercicios${beginner ? ', con pesos suaves para empezar' : ''}. Revísala: puedes pedirme cambios o aceptarla tal cual.`,
    };
  }

  // Una rutina pegada como texto ("Press banca 4x8 60kg").
  private fromPasted(prompt: string): AssistantResult | null {
    const lines = prompt.split(/\n+/).map((l) => l.trim()).filter(Boolean);
    const setsRe = /^(.*?)[\s:,\-–]*?(\d+)\s*[x×]\s*(\d+)(.*)$/i;
    if (lines.filter((l) => setsRe.test(l)).length < 2) return null;

    const days: PlanDay[] = [];
    const unresolved: UnresolvedItem[] = [];
    const dayRe = new RegExp(`^(${DAY_WORDS})\\b`);
    let current: PlanDay | null = null;

    for (const line of lines) {
      const head = normalize(line).match(dayRe);
      if (head && !setsRe.test(line)) {
        const dow = WEEKDAYS.find((w) => normalize(w.name) === head[1])!;
        const rest = line.replace(/^\s*\S+\s*[:\-–]?\s*/, '').trim();
        current = { id: uid(), name: rest || dow.name, dayOfWeek: dow.n, exercises: [] };
        days.push(current);
        continue;
      }
      const m = line.match(setsRe);
      if (!m) continue;
      if (!current) { current = { id: uid(), name: 'Día 1', dayOfWeek: 1, exercises: [] }; days.push(current); }
      const sets = +m[2], reps = +m[3];
      const w = m[4].match(/(\d+(?:[.,]\d+)?)\s*kg/i);
      const weightKg = w ? parseFloat(w[1].replace(',', '.')) : null;
      const match = this.catalog.findBestMatch(m[1]);
      if (match) current.exercises.push({ id: uid(), exerciseId: match.id, sets, reps, weightKg: match.equipment === 'body only' && !w ? null : weightKg });
      else unresolved.push({ id: uid(), originalText: m[1].trim() || line, dayId: current.id, sets, reps, weightKg });
    }

    const found = days.reduce((s, d) => s + d.exercises.length, 0);
    const reply = unresolved.length
      ? `Convertí ${found} ejercicios de tu rutina. ${unresolved.length === 1 ? 'Hay 1 que no reconozco' : `Hay ${unresolved.length} que no reconozco`}: elige tú el ejercicio del catálogo y queda todo listo.`
      : `Convertí tu rutina: ${found} ejercicios en ${days.length} ${days.length === 1 ? 'día' : 'días'}, con tus series, repeticiones y pesos.`;
    return { draft: { name: 'Mi rutina', days, unresolved }, reply };
  }

  private findInDraft(d: PlanDraft, text: string): PlanExercise | null {
    let best: { pe: PlanExercise; s: number } | null = null;
    for (const day of d.days) for (const pe of day.exercises) {
      const e = this.catalog.byId(pe.exerciseId);
      const s = e ? this.catalog.score(e, text) : 0;
      if (s >= 0.6 && (!best || s > best.s)) best = { pe, s };
    }
    return best?.pe ?? null;
  }
}
