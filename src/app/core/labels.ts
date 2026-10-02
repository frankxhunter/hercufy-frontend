export const WEEKDAYS = [
  { n: 1, short: 'L', name: 'Lunes' },
  { n: 2, short: 'M', name: 'Martes' },
  { n: 3, short: 'X', name: 'Miércoles' },
  { n: 4, short: 'J', name: 'Jueves' },
  { n: 5, short: 'V', name: 'Viernes' },
  { n: 6, short: 'S', name: 'Sábado' },
  { n: 7, short: 'D', name: 'Domingo' },
];

export const weekdayName = (n: number | null): string =>
  WEEKDAYS.find((w) => w.n === n)?.name ?? '';

export function todayDow(): number {
  const d = new Date().getDay();
  return d === 0 ? 7 : d;
}

export const MUSCLE_ES: Record<string, string> = {
  abdominals: 'Abdominales', abductors: 'Abductores', adductors: 'Aductores', biceps: 'Bíceps',
  calves: 'Gemelos', chest: 'Pecho', forearms: 'Antebrazos', glutes: 'Glúteos',
  hamstrings: 'Femorales', lats: 'Dorsales', 'lower back': 'Lumbares', 'middle back': 'Espalda media',
  neck: 'Cuello', quadriceps: 'Cuádriceps', shoulders: 'Hombros', traps: 'Trapecios', triceps: 'Tríceps',
};

export const LEVEL_ES: Record<string, string> = {
  beginner: 'Principiante', intermediate: 'Intermedio', expert: 'Avanzado',
};

export const EQUIPMENT_ES: Record<string, string> = {
  'body only': 'Peso corporal', machine: 'Máquina', other: 'Otro', 'foam roll': 'Rodillo',
  kettlebells: 'Kettlebell', dumbbell: 'Mancuernas', cable: 'Polea', barbell: 'Barra', bands: 'Bandas',
  'medicine ball': 'Balón medicinal', 'exercise ball': 'Fitball', 'e-z curl bar': 'Barra Z',
};

export interface MuscleGroup { key: string; label: string; color: string; muscles: string[] }

/** Cada grupo tiene un color propio: es la información que codifica la franja lateral de cada ejercicio. */
export const MUSCLE_GROUPS: MuscleGroup[] = [
  { key: 'pecho', label: 'Pecho', color: '#E58A6F', muscles: ['chest'] },
  { key: 'espalda', label: 'Espalda', color: '#6FA8DC', muscles: ['lats', 'middle back', 'lower back', 'traps'] },
  { key: 'hombros', label: 'Hombros', color: '#B48CE0', muscles: ['shoulders'] },
  { key: 'brazos', label: 'Brazos', color: '#E3C15A', muscles: ['biceps', 'triceps', 'forearms'] },
  { key: 'piernas', label: 'Piernas', color: '#6CCB9B', muscles: ['quadriceps', 'hamstrings', 'glutes', 'calves', 'adductors', 'abductors'] },
  { key: 'core', label: 'Core', color: '#E07FA6', muscles: ['abdominals'] },
];

export const groupOfMuscle = (muscle: string | undefined): MuscleGroup | undefined =>
  MUSCLE_GROUPS.find((g) => muscle && g.muscles.includes(muscle));

export function formatKg(n: number | null): string {
  if (n === null) return '';
  return Number.isInteger(n) ? String(n) : n.toLocaleString('es-ES', { maximumFractionDigits: 2 });
}

export const uid = (): string => crypto.randomUUID();

export const normalize = (s: string): string =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
