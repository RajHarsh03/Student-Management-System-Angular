import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { AdminDashboard } from './dashboard/admin-dashboard/admin-dashboard';
import { StudentDashboard } from './dashboard/student-dashboard/student-dashboard';
import { AdminNoticesComponent } from './dashboard/admin-notices/admin-notices';
import { AdminAccountComponent } from './dashboard/admin-account/admin-account';
import { AdminAttendanceComponent } from './dashboard/admin-attendance/admin-attendance';
import { AdminAssessmentsComponent } from './dashboard/admin-assessments/admin-assessments';
import { StudentAttendanceComponent } from './dashboard/student-attendance/student-attendance';
import { StudentAssessmentsComponent } from './dashboard/student-assessments/student-assessments';
import { StudentNoticesComponent } from './dashboard/student-notices/student-notices';
import { StudentAccountComponent } from './dashboard/student-account/student-account';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '',
    loadChildren: () =>
      import('./auth/auth.module').then(m => m.AuthModule)
  },
  { path: 'admin-dashboard',       component: AdminDashboard,              canActivate: [AuthGuard] },
  { path: 'student-dashboard',     component: StudentDashboard,            canActivate: [AuthGuard] },
  { path: 'admin/notices',         component: AdminNoticesComponent,       canActivate: [AuthGuard] },
  { path: 'admin/account',         component: AdminAccountComponent,       canActivate: [AuthGuard] },
  { path: 'admin/attendance',      component: AdminAttendanceComponent,    canActivate: [AuthGuard] },
  { path: 'admin/assessments',     component: AdminAssessmentsComponent,   canActivate: [AuthGuard] },
  { path: 'student/attendance',    component: StudentAttendanceComponent,  canActivate: [AuthGuard] },
  { path: 'student/assessments',   component: StudentAssessmentsComponent, canActivate: [AuthGuard] },
  { path: 'student/notices',       component: StudentNoticesComponent,     canActivate: [AuthGuard] },
  { path: 'student/account',       component: StudentAccountComponent,     canActivate: [AuthGuard] },
  {
    path: '',
    loadChildren: () =>
      import('./students/students.routes').then(m => m.studentRoutes)
  },
  { path: '**', redirectTo: 'login' }
];
