export interface Exercise {
  id: string;
  name: string;
  nameEs: string;
  level: string;
  mechanic: string | null;
  force: string | null;
  equipment: string | null;
  category: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  images: string[];
}

/** Ejercicio dentro de un día de la rutina, con los datos del usuario. */
export interface PlanExercise {
  id: string;
  exerciseId: string;
  sets: number;
  reps: number;
  /** null = ejercicio sin peso (peso corporal). */
  weightKg: number | null;
}

export interface PlanDay {
  id: string;
  name: string;
  /** 1 = lunes … 7 = domingo. Nullable para poder pasar a días A/B/C. */
  dayOfWeek: number | null;
  exercises: PlanExercise[];
}

export interface TrainingPlan {
  id: string;
  name: string;
  active: boolean;
  scheduleType: 'WEEKDAY';
  days: PlanDay[];
}

/** Elemento que la IA no pudo emparejar con el catálogo. */
export interface UnresolvedItem {
  id: string;
  originalText: string;
  dayId: string;
  sets: number;
  reps: number;
  weightKg: number | null;
}

export interface PlanDraft {
  name: string;
  days: PlanDay[];
  unresolved: UnresolvedItem[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}
