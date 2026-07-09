# Student CRUD Module — Merge Guide

Branch: `feature/student-crud`  
Owner: Samya Khastagir  

---

## Routes this branch adds

| Route path               | Component            | Who uses it         |
|--------------------------|----------------------|---------------------|
| `/admin/students`        | StudentListComponent | Admin — view all    |
| `/admin/students/add`    | StudentFormComponent | Admin — add student |
| `/admin/students/edit/:id` | StudentFormComponent | Admin — edit student |
| `/student/profile`       | StudentViewComponent | Student — own info  |

These do NOT conflict with dashboard routes (`/admin`, `/student`) — they are separate paths.

---

## Step 1 — Merge app.routes.ts

Dashboard branch has:
```typescript
export const routes: Routes = [
  { path: '', redirectTo: 'student', pathMatch: 'full' },
  { path: 'student', component: StudentDashboard },
  { path: 'admin',   component: AdminDashboard }
];
```

After merge, `app.routes.ts` should be:
```typescript
import { Routes } from '@angular/router';
import { StudentDashboard } from './dashboard/student-dashboard/student-dashboard';
import { AdminDashboard }   from './dashboard/admin-dashboard/admin-dashboard';

export const routes: Routes = [
  // Dashboard routes (owned by feature/dashboard)
  { path: '', redirectTo: 'student', pathMatch: 'full' },
  { path: 'student', component: StudentDashboard },
  { path: 'admin',   component: AdminDashboard },

  // Student CRUD routes (owned by feature/student-crud) ← ADD THIS BLOCK
  {
    path: '',
    loadChildren: () =>
      import('./students/students.routes').then(m => m.studentRoutes)
  },

  { path: '**', redirectTo: 'student' }
];
```

---

## Step 2 — Wire admin-dashboard.html buttons

File: `src/app/dashboard/admin-dashboard/admin-dashboard.html`

**Add `RouterModule` to admin-dashboard.ts imports first:**
```typescript
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterModule],   // ← add this
  ...
})
```

**Then replace placeholder links/buttons:**

```html
<!-- Sidebar: Manage Students -->
<!-- FROM: <a href="#">Manage Students</a> -->
<!-- TO:                                   -->
<a routerLink="/admin/students">Manage Students</a>

<!-- Quick Controls: Register New Student -->
<!-- FROM: <button class="btn-add">+ Register New Student</button> -->
<!-- TO:                                                            -->
<button class="btn-add" routerLink="/admin/students/add">+ Register New Student</button>

<!-- Student Record Editor: Edit Details -->
<!-- FROM: <button class="btn-edit">✏️ Edit Details</button> -->
<!-- TO (replace mockStudentId with actual student id):       -->
<button class="btn-edit" [routerLink]="['/admin/students/edit', mockStudentId]">✏️ Edit Details</button>
```

---

## Step 3 — Wire student-dashboard.html (student profile link)

File: `src/app/dashboard/student-dashboard/student-dashboard.html`

**Add `RouterModule` to student-dashboard.ts imports first:**
```typescript
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterModule],   // ← add this
  ...
})
```

**Then add a "My Profile" link in the sidebar or quick nav:**
```html
<!-- Sidebar — add below Dashboard link -->
<a routerLink="/student/profile">My Profile</a>

<!-- OR in Quick Navigation buttons -->
<button routerLink="/student/profile">View My Profile</button>
```

---

## Step 4 — Verify app.ts has RouterOutlet

After merge, `app.ts` must import `RouterOutlet`:
```typescript
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterOutlet, StudentDashboard, AdminDashboard],  // keep all three
  ...
})
```

---

## Files owned by this branch (do NOT modify these during merge)

```
src/app/models/student.model.ts
src/app/services/student.service.ts
src/app/students/
  ├── students.routes.ts
  ├── services/toast.service.ts
  └── components/
      ├── student-list/   (admin CRUD list)
      ├── student-form/   (admin add/edit)
      └── student-view/   (student profile)
db.json                   (mock API data)
ROUTES.md                 (this file)
```

## Files the merge leader needs to update (conflict resolution)

```
src/app/app.routes.ts   ← combine dashboard routes + loadChildren block
src/app/app.ts          ← keep RouterOutlet + both dashboard component imports
```
