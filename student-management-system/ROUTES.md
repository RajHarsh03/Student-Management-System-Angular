# Student CRUD Module — Route Reference

This file documents the routes exposed by the `feature/student-crud` branch.
When merging, replace `href="#"` placeholders in the dashboard with `routerLink` values below.

---

## Admin Routes

| Action                        | routerLink                        | Notes                          |
|-------------------------------|-----------------------------------|--------------------------------|
| View all students (list)      | `/admin/students`                 | "Manage Students" sidebar link |
| Add new student               | `/admin/students/add`             | "+ Register New Student" btn   |
| Edit a student                | `/admin/students/edit/:id`        | Pass student id dynamically    |

### How to wire "Manage Students" sidebar link (admin-dashboard.html)
```html
<!-- Replace: <a href="#">Manage Students</a> -->
<a routerLink="/admin/students">Manage Students</a>
```

### How to wire "+ Register New Student" button (admin-dashboard.html)
```html
<!-- Replace: <button class="btn-add">+ Register New Student</button> -->
<button class="btn-add" routerLink="/admin/students/add">+ Register New Student</button>
```

### How to wire "Edit Details" button (admin-dashboard.html)
```html
<!-- Replace: <button class="btn-edit">✏️ Edit Details</button> -->
<button class="btn-edit" [routerLink]="['/admin/students/edit', student.id]">✏️ Edit Details</button>
```

---

## Student Routes

| Action                        | routerLink                        | Notes                                    |
|-------------------------------|-----------------------------------|------------------------------------------|
| Student view own info         | `/student/dashboard`              | Student role — read-only profile view    |

### How to wire student dashboard link (student-dashboard.html or sidebar)
```html
<!-- Replace: <a href="#">Dashboard</a> -->
<a routerLink="/student/dashboard">Dashboard</a>
```

---

## Important — RouterModule must be imported

For `routerLink` to work in the dashboard components, add `RouterModule` to their imports:

```typescript
// admin-dashboard.ts
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterModule],   // ← add this
  ...
})
```

---

## No conflicts expected

- All route paths are unique and do not overlap with `/student` or `/admin` dashboard routes.
- The dashboard branch currently uses `path: 'student'` and `path: 'admin'` — these are **different** from `/student/dashboard` and `/admin/students`.
- No shared files are modified by this branch. Only files under `src/app/students/` and `src/app/services/` and `src/app/models/` are owned by this branch.
