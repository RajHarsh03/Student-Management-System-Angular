import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { AdminDashboard } from './dashboard/admin-dashboard/admin-dashboard';
import { StudentDashboard } from './dashboard/student-dashboard/student-dashboard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '',
    loadChildren: () =>
      import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboard,
    canActivate: [AuthGuard]
  },
  {
    path: 'student-dashboard',
    component: StudentDashboard,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    loadChildren: () =>
      import('./students/students.routes').then(m => m.studentRoutes)
  },
  { path: '**', redirectTo: 'login' }
];
