import { Routes } from '@angular/router';
import { Component } from '@angular/core';
import { AuthGuard } from './auth/auth.guard';

@Component({ standalone: true, template: '' })
class AdminDashboardPlaceholder {}

@Component({ standalone: true, template: '' })
class StudentDashboardPlaceholder {}

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '',
    loadChildren: () =>
      import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboardPlaceholder,
    canActivate: [AuthGuard]
  },
  {
    path: 'student-dashboard',
    component: StudentDashboardPlaceholder,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: 'login' }
];
