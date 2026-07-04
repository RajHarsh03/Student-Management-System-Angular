import { Routes } from '@angular/router';
import { StudentDashboard } from './dashboard/student-dashboard/student-dashboard';
import { AdminDashboard } from './dashboard/admin-dashboard/admin-dashboard';

export const routes: Routes = [
  { path: '', redirectTo: 'student', pathMatch: 'full' },
  { path: 'student', component: StudentDashboard },
  { path: 'admin', component: AdminDashboard }
];