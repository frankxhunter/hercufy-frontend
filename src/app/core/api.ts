import { HttpContextToken, HttpErrorResponse } from '@angular/common/http';
import { API_ORIGIN } from './config';

/** Raíz de la API: todos los endpoints cuelgan de aquí (/auth, /users, /exercises, /plans). */
export const API_URL = `${API_ORIGIN}/api`;

/**
 * Marca una petición como parte del propio flujo de tokens (login, refresh, logout).
 * El interceptor la deja pasar sin añadir Authorization ni intentar renovar la sesión,
 * que es justo lo que esas peticiones necesitan para poder ejecutarse.
 */
export const SKIP_AUTH = new HttpContextToken<boolean>(() => false);

/** Paginación tal y como la devuelve Spring Data (PageImpl sin envolver en PagedModel). */
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  last: boolean;
}

/** Respuesta de POST /auth/login, /auth/google y /auth/refresh. */
export interface AuthResponse {
  token: string;
  refreshToken: string;
  tokenType: string;
  expiresInMs: number;
  refreshExpiresInMs: number;
  email: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  role: string;
  emailVerified: boolean;
}

export interface PlanExerciseResponse {
  id: string;
  exerciseId: string;
  exerciseName: string;
  exerciseNameEs: string;
  position: number;
  sets: number;
  reps: number;
  weightKg: number | null;
}

export interface PlanDayResponse {
  id: string;
  name: string;
  position: number;
  dayOfWeek: number | null;
  exercises: PlanExerciseResponse[];
}

export interface TrainingPlanResponse {
  id: string;
  name: string;
  active: boolean;
  scheduleType: string;
  days: PlanDayResponse[];
  createdAt: string;
  updatedAt: string;
}

/** Resumen del catálogo: lo que devuelve GET /exercises (no trae instrucciones). */
export interface ExerciseSummaryResponse {
  id: string;
  name: string;
  nameEs: string;
  translated: boolean;
  level: string;
  equipment: string | null;
  category: string;
  primaryMuscle: string | null;
  muscleGroup: string | null;
  imageUrls: string[];
}

/** Detalle del catálogo: GET /exercises/{id}. */
export interface ExerciseDetailResponse {
  id: string;
  name: string;
  nameEs: string;
  translated: boolean;
  level: string;
  force: string | null;
  mechanic: string | null;
  equipment: string | null;
  category: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  imageUrls: string[];
}

export interface MuscleGroupResponse {
  key: string;
  label: string;
}

// --- Cuerpos de petición ---

export interface NewDay {
  name: string;
  dayOfWeek: number;
}

export interface CreatePlanRequest {
  name: string;
  days: NewDay[];
}

export interface UpdatePlanRequest {
  name?: string;
  active?: boolean;
}

export interface UpdateUsernameRequest {
  username: string;
}

export interface UpdateDayRequest {
  name: string;
}

export interface AddPlanExerciseRequest {
  exerciseId: string;
  sets: number;
  reps: number;
  weightKg: number | null;
}

export type UpdatePlanExerciseRequest = Omit<AddPlanExerciseRequest, 'exerciseId'>;

export interface ReorderExercisesRequest {
  orderedExerciseIds: string[];
}

// --- Errores ---

const STATUS_FALLBACK: Record<number, string> = {
  400: 'Los datos no son válidos.',
  // El backend responde 403 también cuando el token falta o ha caducado, no solo por permisos.
  401: 'Tu sesión ha caducado. Vuelve a entrar.',
  403: 'Tu sesión no es válida. Vuelve a entrar.',
  404: 'No lo encontramos.',
  409: 'Ya existe algo con esos datos.',
  429: 'Demasiadas peticiones. Espera un momento y vuelve a intentarlo.',
  500: 'El servidor ha tenido un problema. Inténtalo de nuevo en un momento.',
};

const DEFAULT_MESSAGE = 'No se ha podido completar la operación.';

/**
 * El backend responde los errores en texto plano, no con un JSON de error: los errores de
 * validación llegan como "Field: email - El correo es obligatorio;\n". Esta función traduce
 * cualquiera de esos casos a un mensaje presentable.
 */
export function apiMessage(err: unknown, fallback = DEFAULT_MESSAGE): string {
  if (!(err instanceof HttpErrorResponse)) {
    return err instanceof Error && err.message ? err.message : fallback;
  }
  if (err.status === 0) return 'No hay conexión con el servidor.';

  const raw = extractBody(err);
  if (raw) return tidy(raw);
  return STATUS_FALLBACK[err.status] ?? fallback;
}

function extractBody(err: HttpErrorResponse): string {
  if (typeof err.error === 'string') return err.error.trim();
  // El único error en JSON es el 429 del limitador de peticiones.
  if (err.error && typeof err.error === 'object') {
    const json = err.error as { error?: unknown };
    if (typeof json.error === 'string') return json.error.trim();
  }
  return '';
}

function tidy(raw: string): string {
  const lines = raw.split('\n').map((l) => l.trim()).filter(Boolean);
  const validation = lines.every((l) => l.startsWith('Field: '));
  if (!validation) return lines.join(' ');
  const messages = lines.map((l) => {
    const m = l.match(/^Field:\s*\S+\s+-\s+(.*?);?$/);
    return m?.[1]?.trim() ?? l;
  });
  return messages.join(' ') || DEFAULT_MESSAGE;
}