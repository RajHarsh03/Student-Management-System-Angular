import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'students',
    loadChildren: () =>
      import('./students/students.routes').then(m => m.studentRoutes)
  },
  {
    path: '',
    redirectTo: 'students',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'students'
  }
];
