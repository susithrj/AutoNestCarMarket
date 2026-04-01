import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/cars/car-list/car-list.component').then(m => m.CarListComponent)
  },
  {
    path: 'cars/:id',
    loadComponent: () => import('./features/cars/car-detail/car-detail.component').then(m => m.CarDetailComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    loadComponent: () => import('./features/admin/car-manage/car-manage.component').then(m => m.CarManageComponent)
  },
  {
    path: 'admin/cars/new',
    canActivate: [authGuard, roleGuard],
    loadComponent: () => import('./features/admin/car-form/car-form.component').then(m => m.CarFormComponent)
  },
  {
    path: 'admin/cars/:id/edit',
    canActivate: [authGuard, roleGuard],
    loadComponent: () => import('./features/admin/car-form/car-form.component').then(m => m.CarFormComponent)
  }
];
