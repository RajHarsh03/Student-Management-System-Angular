import { Routes } from '@angular/router';

export const studentRoutes: Routes = [
  // Admin routes — full CRUD
  {
    path: 'admin/students',
    loadComponent: () =>
      import('./components/student-list/student-list.component').then(m => m.StudentListComponent)
  },
  {
    path: 'admin/students/add',
    loadComponent: () =>
      import('./components/student-form/student-form.component').then(m => m.StudentFormComponent)
  },
  {
    path: 'admin/students/edit/:id',
    loadComponent: () =>
      import('./components/student-form/student-form.component').then(m => m.StudentFormComponent)
  },

  // Student route — view own info only
  {
    path: 'student/dashboard',
    loadComponent: () =>
      import('./components/student-view/student-view.component').then(m => m.StudentViewComponent)
  }
];
