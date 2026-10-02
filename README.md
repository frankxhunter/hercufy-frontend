# Hercufy (frontend)

App de gimnasio con rutinas asistidas por IA (asistente **Hercules**). Esta primera versión es **solo frontend, con datos simulados**: no llama a ningún backend.

- Angular 20 + Ionic 9 (componentes standalone, signals), tema propio "hierro y bronce".
- Requiere Node 22.12 o superior.

## Arrancar

```bash
npm install
npm start          # http://localhost:4200
npm run build      # compilación de producción en dist/
```

Para entrar sin registrarte, usa "Probar con una cuenta de demostración". Cualquier correo válido con contraseña de 6 o más caracteres también funciona.

## Qué incluye

- **Hoy**: qué te toca según el día de la semana (con selector de semana), y ajuste rápido de peso, series y repeticiones tocando el disco.
- **Rutinas**: lista, activar una rutina, añadir, renombrar y quitar días, añadir, reordenar y quitar ejercicios. Creación manual (elegir días) o con Hercules.
- **Hercules**: describe lo que quieres o pega una rutina escrita (por ejemplo `Press banca 4x8 60kg`). Propone un borrador; puedes pedirle cambios («cámbiame el press banca por press inclinado con barra», «quita las dominadas», «añade plancha el viernes»), resolver los ejercicios que no reconoce y aceptarla.
- **Ejercicios**: catálogo con búsqueda, filtro por grupo muscular, imágenes y pasos.

## Estructura

```
src/app/
  core/
    models.ts               modelos (Exercise, TrainingPlan, PlanDay, PlanExercise, PlanDraft…)
    labels.ts               días, músculos, colores por grupo, utilidades
    data/                   catálogo (subconjunto de free-exercise-db) y rutinas de ejemplo
    services/
      plan.repository.ts    contrato PlanRepository + MockPlanRepository (memoria)
      plan.service.ts       estado de rutinas con signals; todas las operaciones de edición
      assistant.service.ts  contrato AssistantPort + MockAssistant (reglas locales)
      exercise.service.ts   catálogo, búsqueda y emparejamiento de nombres
      auth.service.ts       sesión simulada y guard
  ui/                       componentes reutilizables (disco de peso, fila de ejercicio, hojas, etc.)
  pages/                    pantallas
```

## Conectar el backend más adelante

Las pantallas solo conocen dos contratos. En `src/app/app.config.ts` está el único punto de cambio:

```ts
{ provide: PlanRepository, useClass: MockPlanRepository },  // → HttpPlanRepository
{ provide: AssistantPort,  useClass: MockAssistant },       // → HttpAssistant (borradores de IA)
```

`AuthService` y `ExerciseService` se migrarán igual (llamadas HTTP en lugar de datos locales).

## Notas

- Los datos se reinician al recargar la página (la sesión simulada sí se mantiene durante la pestaña).
- Las imágenes se cargan desde el repositorio de free-exercise-db en GitHub (`src/app/core/config.ts`); en producción conviene servirlas desde almacenamiento propio. Verifica la licencia del dataset antes de publicar.
- Los nombres en español del catálogo son una traducción simulada; las instrucciones siguen en inglés.
- Capacitor (móvil) no está añadido todavía.
