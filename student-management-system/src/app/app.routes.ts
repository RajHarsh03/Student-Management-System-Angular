import { Routes } from '@angular/router';
import { Component } from '@angular/core';
import { AuthGuard } from './auth/auth.guard';

@Component({ standalone: true, template: '' })
class DashboardPlaceholderComponent {}

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '',
    loadChildren: () =>
      import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'dashboard',
    component: DashboardPlaceholderComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: 'login' }
];
