import { Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

export const studentRoutes: Routes = [
  {
    path: 'admin/students',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./components/student-list/student-list.component')
        .then(m => m.StudentListComponent)
  },
  {
    path: 'admin/students/add',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./components/student-form/student-form.component')
        .then(m => m.StudentFormComponent)
  },
  {
    path: 'admin/students/edit/:id',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./components/student-form/student-form.component')
        .then(m => m.StudentFormComponent)
  },
  {
    path: 'student/profile',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./components/student-view/student-view.component')
        .then(m => m.StudentViewComponent)
  }
];
