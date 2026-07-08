import { Routes } from '@angular/router';

export const studentRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/student-list/student-list.component').then(
        m => m.StudentListComponent
      )
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./components/student-form/student-form.component').then(
        m => m.StudentFormComponent
      )
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./components/student-form/student-form.component').then(
        m => m.StudentFormComponent
      )
  },
  {
    path: '**',
    redirectTo: ''
  }
];
