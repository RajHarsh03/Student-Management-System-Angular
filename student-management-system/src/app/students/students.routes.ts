import { Routes } from '@angular/router';

/**
 * Student CRUD routes — feature/student-crud branch
 *
 * These routes are designed to nest under the existing dashboard routes.
 * Dashboard branch owns:
 *   path: 'student'  → StudentDashboard
 *   path: 'admin'    → AdminDashboard
 *
 * This module adds:
 *   path: 'admin/students'          → student list  (admin CRUD)
 *   path: 'admin/students/add'      → add student   (admin CRUD)
 *   path: 'admin/students/edit/:id' → edit student  (admin CRUD)
 *   path: 'student/profile'         → student's own info (student view)
 *
 * On merge the leader just adds these to app.routes.ts alongside the
 * existing 'student' and 'admin' routes — zero path collisions.
 */
export const studentRoutes: Routes = [
  // ── Admin side — full CRUD ──────────────────────────
  {
    path: 'admin/students',
    loadComponent: () =>
      import('./components/student-list/student-list.component')
        .then(m => m.StudentListComponent)
  },
  {
    path: 'admin/students/add',
    loadComponent: () =>
      import('./components/student-form/student-form.component')
        .then(m => m.StudentFormComponent)
  },
  {
    path: 'admin/students/edit/:id',
    loadComponent: () =>
      import('./components/student-form/student-form.component')
        .then(m => m.StudentFormComponent)
  },

  // ── Student side — read-only own profile ────────────
  {
    path: 'student/profile',
    loadComponent: () =>
      import('./components/student-view/student-view.component')
        .then(m => m.StudentViewComponent)
  }
];
