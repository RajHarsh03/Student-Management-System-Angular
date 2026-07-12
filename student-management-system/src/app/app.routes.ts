import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { AdminDashboard } from './dashboard/admin-dashboard/admin-dashboard';
import { StudentDashboard } from './dashboard/student-dashboard/student-dashboard';
import { AdminNoticesComponent } from './dashboard/admin-notices/admin-notices';
import { AdminAccountComponent } from './dashboard/admin-account/admin-account';

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
    path: 'admin/notices',
    component: AdminNoticesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/account',
    component: AdminAccountComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    loadChildren: () =>
      import('./students/students.routes').then(m => m.studentRoutes)
  },
  { path: '**', redirectTo: 'login' }
];
