import { Routes } from '@angular/router';

/**
 * app.routes.ts — feature/student-crud branch
 *
 * Dashboard branch owns:
 *   { path: '',        redirectTo: 'student', pathMatch: 'full' }
 *   { path: 'student', component: StudentDashboard }
 *   { path: 'admin',   component: AdminDashboard }
 *
 * This branch adds the CRUD routes below.
 * On merge the leader keeps dashboard's 3 routes and appends loadChildren.
 * Zero path collisions — 'admin/students' and 'student/profile' are
 * distinct from 'admin' and 'student'.
 */
export const routes: Routes = [
  // ── Redirect root (dashboard branch owns this, kept for standalone run) ──
  { path: '', redirectTo: 'admin/students', pathMatch: 'full' },

  // ── Student CRUD module (lazy loaded) ────────────────────────────────────
  {
    path: '',
    loadChildren: () =>
      import('./students/students.routes').then(m => m.studentRoutes)
  },

  // ── Catch-all ─────────────────────────────────────────────────────────────
  { path: '**', redirectTo: 'admin/students' }
];
