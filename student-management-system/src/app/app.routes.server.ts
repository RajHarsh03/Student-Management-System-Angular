import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: 'admin-dashboard',         renderMode: RenderMode.Client },
  { path: 'student-dashboard',       renderMode: RenderMode.Client },
  { path: 'admin/students',          renderMode: RenderMode.Client },
  { path: 'admin/students/add',      renderMode: RenderMode.Client },
  { path: 'admin/students/edit/:id', renderMode: RenderMode.Client },
  { path: 'admin/notices',           renderMode: RenderMode.Client },
  { path: 'admin/account',           renderMode: RenderMode.Client },
  { path: 'student/attendance',      renderMode: RenderMode.Client },
  { path: 'student/assessments',     renderMode: RenderMode.Client },
  { path: 'student/notices',         renderMode: RenderMode.Client },
  { path: 'student/account',         renderMode: RenderMode.Client },
  { path: '**',                      renderMode: RenderMode.Prerender }
];
