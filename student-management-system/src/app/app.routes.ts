import { Routes } from '@angular/router';

export const routes: Routes = [
  // Redirect root to admin student list
  { path: '', redirectTo: 'admin/students', pathMatch: 'full' },

  // Student management module (admin + student views) — lazy loaded
  {
    path: '',
    loadChildren: () =>
      import('./students/students.routes').then(m => m.studentRoutes)
  },

  // Catch-all
  { path: '**', redirectTo: 'admin/students' }
];
