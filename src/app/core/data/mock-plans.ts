import { TrainingPlan } from '../models';

let n = 0;
const id = () => `m${++n}`;
const ex = (exerciseId: string, sets: number, reps: number, weightKg: number | null) => ({
  id: id(), exerciseId, sets, reps, weightKg,
});

export const MOCK_PLANS: TrainingPlan[] = [
  {
    id: 'plan-1',
    name: 'Volumen de otoño',
    active: true,
    scheduleType: 'WEEKDAY',
    days: [
      { id: 'd1', name: 'Pecho, hombro y tríceps', dayOfWeek: 1, exercises: [
        ex('Barbell_Bench_Press_-_Medium_Grip', 4, 8, 60),
        ex('Incline_Dumbbell_Press', 3, 10, 22),
        ex('Cable_Crossover', 3, 12, 15),
        ex('Standing_Military_Press', 3, 8, 35),
        ex('Side_Lateral_Raise', 4, 12, 8),
        ex('Triceps_Pushdown_-_Rope_Attachment', 3, 12, 27.5),
      ] },
      { id: 'd2', name: 'Espalda y bíceps', dayOfWeek: 2, exercises: [
        ex('Pullups', 4, 8, null),
        ex('Bent_Over_Barbell_Row', 4, 8, 55),
        ex('Seated_Cable_Rows', 3, 10, 50),
        ex('Face_Pull', 3, 15, 20),
        ex('Barbell_Curl', 3, 10, 25),
        ex('Hammer_Curls', 3, 12, 12),
      ] },
      { id: 'd3', name: 'Pierna', dayOfWeek: 4, exercises: [
        ex('Barbell_Full_Squat', 4, 8, 80),
        ex('Romanian_Deadlift', 3, 10, 65),
        ex('Leg_Press', 3, 12, 140),
        ex('Leg_Extensions', 3, 12, 45),
        ex('Lying_Leg_Curls', 3, 12, 35),
        ex('Standing_Calf_Raises', 4, 15, 60),
      ] },
      { id: 'd4', name: 'Torso completo', dayOfWeek: 5, exercises: [
        ex('Leverage_Chest_Press', 3, 10, 50),
        ex('Wide-Grip_Lat_Pulldown', 3, 10, 55),
        ex('Machine_Shoulder_Military_Press', 3, 10, 30),
        ex('One-Arm_Dumbbell_Row', 3, 10, 24),
        ex('Dips_-_Triceps_Version', 3, 10, null),
      ] },
      { id: 'd5', name: 'Brazos y abdomen', dayOfWeek: 6, exercises: [
        ex('Preacher_Curl', 3, 10, 20),
        ex('Lying_Triceps_Press', 3, 10, 25),
        ex('Dumbbell_Bicep_Curl', 3, 12, 12),
        ex('Hanging_Leg_Raise', 3, 12, null),
        ex('Cable_Crunch', 3, 15, 35),
      ] },
    ],
  },
  {
    id: 'plan-2',
    name: 'Vuelta tras las vacaciones',
    active: false,
    scheduleType: 'WEEKDAY',
    days: [
      { id: 'd6', name: 'Cuerpo completo A', dayOfWeek: 1, exercises: [
        ex('Goblet_Squat', 3, 10, 16),
        ex('Leverage_Chest_Press', 3, 10, 35),
        ex('Seated_Cable_Rows', 3, 10, 35),
      ] },
      { id: 'd7', name: 'Cuerpo completo B', dayOfWeek: 3, exercises: [
        ex('Leg_Press', 3, 12, 90),
        ex('Machine_Shoulder_Military_Press', 3, 10, 20),
        ex('Wide-Grip_Lat_Pulldown', 3, 10, 40),
      ] },
      { id: 'd8', name: 'Cuerpo completo C', dayOfWeek: 5, exercises: [
        ex('Bodyweight_Squat', 3, 15, null),
        ex('Dumbbell_Flyes', 3, 12, 8),
        ex('Crunches', 3, 20, null),
      ] },
    ],
  },
];
