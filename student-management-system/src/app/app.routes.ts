import { Routes } from '@angular/router';

export const routes: Routes = [
  // Student management module (admin + student views)
  {
    path: '',
    loadChildren: () =>
      import('./students/students.routes').then(m => m.studentRoutes)
  },

  // Default redirect → admin student list
  { path: '', redirectTo: 'admin/students', pathMatch: 'full' },

  // Catch-all
  { path: '**', redirectTo: 'admin/students' }
];
