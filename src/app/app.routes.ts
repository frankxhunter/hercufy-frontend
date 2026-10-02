import { Routes } from '@angular/router';
import { authGuard } from './core/services/auth.service';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./pages/login.page').then((m) => m.LoginPage) },
  { path: 'registro', loadComponent: () => import('./pages/register.page').then((m) => m.RegisterPage) },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: 'tabs',
        loadComponent: () => import('./pages/tabs.page').then((m) => m.TabsPage),
        children: [
          { path: 'hoy', loadComponent: () => import('./pages/today.page').then((m) => m.TodayPage) },
          { path: 'rutinas', loadComponent: () => import('./pages/plans.page').then((m) => m.PlansPage) },
          { path: 'ejercicios', loadComponent: () => import('./pages/exercises.page').then((m) => m.ExercisesPage) },
          { path: 'perfil', loadComponent: () => import('./pages/profile.page').then((m) => m.ProfilePage) },
          { path: '', redirectTo: 'hoy', pathMatch: 'full' },
        ],
      },
      { path: 'rutinas/nueva', loadComponent: () => import('./pages/plan-new.page').then((m) => m.PlanNewPage) },
      { path: 'rutinas/nueva/manual', loadComponent: () => import('./pages/plan-manual.page').then((m) => m.PlanManualPage) },
      { path: 'rutinas/nueva/hercules', loadComponent: () => import('./pages/hercules.page').then((m) => m.HerculesPage) },
      { path: 'rutinas/:planId', loadComponent: () => import('./pages/plan-detail.page').then((m) => m.PlanDetailPage) },
      { path: 'rutinas/:planId/dia/:dayId', loadComponent: () => import('./pages/day-detail.page').then((m) => m.DayDetailPage) },
      { path: 'ejercicio/:id', loadComponent: () => import('./pages/exercise-detail.page').then((m) => m.ExerciseDetailPage) },
      { path: '', redirectTo: 'tabs/hoy', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'tabs/hoy' },
];
