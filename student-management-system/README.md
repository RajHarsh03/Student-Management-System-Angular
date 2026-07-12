# Student Management System

Student Management System is an Angular capstone project built for internship learning and practice. The application focuses on the main Angular concepts covered during training: components, modules, routing, services, reactive forms, HTTP client, route guards, interceptors, RxJS basics, and Git workflow.

The project provides a role-based web interface where an admin can manage student records and a student can log in to view student-related information.

## Project Objective

The main objective of this project is to build a structured Angular application using simple and understandable implementation patterns. The project is intentionally kept close to the internship class notes, so the code should avoid unnecessary advanced logic unless the team specifically needs it.

## Main Features

### Authentication

- Login page
- Admin and student login
- Logout
- Fake JWT token simulation
- Session storage using `localStorage`
- Role storage using `localStorage`
- Route protection using `AuthGuard`
- Authorization header using a class-based HTTP interceptor

Demo login details:

| Role | Username | Password |
| --- | --- | --- |
| Admin | `admin` | `admin123` |
| Student | `student` | `student123` |

### Student Management

- View student list
- Add student
- Edit student
- Delete student
- Search students
- Display student details
- Connect to a local JSON server API

Student fields:

- Student ID
- Student name
- Age
- Course
- Email

### Dashboard

- Admin dashboard
- Student dashboard
- Welcome section
- Quick navigation
- Student summary area
- Basic role-based content

### Shared Module Scope

The shared area is planned for reusable layout components:

- Header
- Sidebar
- Footer
- Shared Angular imports and exports
- Simple `@Input()` and `@Output()` based communication

Shared components should stay focused on layout and navigation. They should not duplicate authentication, student CRUD, dashboard, or UI utility logic.

### UI and Utility Scope

The UI and utility area is planned for small reusable UI pieces:

- Loading spinner
- Toast notifications
- Pagination
- Search box
- Form validation message component
- Loading HTTP interceptor

These utilities should stay reusable and should not contain feature-specific business logic.

## Technology Stack

### Frontend

- Angular `21`
- TypeScript `5.9`
- HTML5
- CSS3

### Angular Concepts Used

- Components
- Feature modules and routing files
- Standalone route configuration
- Angular Router
- Services and dependency injection
- Reactive Forms
- Form validation
- `HttpClient`
- Route guards
- HTTP interceptors
- Observables and basic RxJS operators

### Development Tools

- Angular CLI
- npm
- JSON Server
- Vitest
- Git
- GitHub
- Visual Studio Code

## Project Structure

```text
student-management-system/
|-- db.json
|-- package.json
|-- README.md
`-- src/
    `-- app/
        |-- auth/
        |   |-- login/
        |   |-- auth-routing.module.ts
        |   |-- auth.module.ts
        |   |-- auth.service.ts
        |   |-- auth.guard.ts
        |   `-- auth.interceptor.ts
        |-- dashboard/
        |   |-- admin-dashboard/
        |   |-- admin-attendance/
        |   |-- admin-assessments/
        |   |-- admin-notices/
        |   |-- admin-account/
        |   |-- student-dashboard/
        |   |-- student-attendance/
        |   |-- student-assessments/
        |   |-- student-notices/
        |   `-- student-account/
        |-- students/
        |   |-- components/
        |   |   |-- student-list/
        |   |   `-- student-form/
        |   |-- services/
        |   `-- students.routes.ts
        |-- models/
        |   `-- student.model.ts
        |-- services/
        |   `-- student.service.ts
        |-- app.config.ts
        |-- app.routes.ts
        `-- app.routes.server.ts
```

Planned integration areas:

```text
src/app/shared/
src/app/ui/
```

## API Setup

The project uses `json-server` with `db.json` for local student data.

API endpoint:

```text
http://localhost:3000/students
```

The student service uses this API for:

- `GET` students
- `GET` student by ID
- `POST` student
- `PUT` student
- `DELETE` student

## Getting Started

Go inside the Angular project folder:

```bash
cd student-management-system
```

Install dependencies:

```bash
npm install
```

Start the local API server:

```bash
npm run api
```

In another terminal, start the Angular development server:

```bash
npm start
```

Open the app in the browser:

```text
http://localhost:4200
```

## Available Commands

| Command | Purpose |
| --- | --- |
| `npm start` | Starts the Angular development server |
| `npm run api` | Starts JSON Server on port `3000` |
| `npm run build` | Creates a production build |
| `npm test` | Runs unit tests |
| `npm run watch` | Builds the app in watch mode |

## Routing Overview

Current route flow:

- `/login` opens the login page
- `/admin-dashboard` opens the admin dashboard after login
- `/student-dashboard` opens the student dashboard after login
- `/admin/students` opens the admin student list after login
- `/admin/students/add` opens the add student form
- `/admin/students/edit/:id` opens the edit student form

Protected routes use `AuthGuard`.

## Branch Plan

Recommended project branches:

| Branch | Purpose |
| --- | --- |
| `feature/auth` | Authentication and login |
| `feature/student-crud` | Student management CRUD |
| `feature/dashboard` | Dashboard module, if approved by the team |
| `shared-module` | Header, sidebar, footer, and shared layout |
| `feature/ui` | Loading spinner, toast, pagination, search, and form error utilities |
| `main` | Final stable project branch |

## Learning Outcome

This project helps interns practice building a complete Angular application with a clear module structure, role-based access, CRUD operations, API integration, form validation, basic RxJS usage, and Git collaboration. The implementation should remain readable, maintainable, and aligned with the Angular concepts taught during the internship.

---

## Project Update

The following features have been added beyond the original plan.

### Authentication Updates

- Student signup form added to the login page — new students can register and their credentials are saved to `db.json` via the API
- Login mode toggle — default view is Student Login, switch to Admin Login using the toggle button
- Dynamic student login — students created via signup or added by admin can log in with their own credentials
- Session persists on browser refresh — the app does not log out on page reload
- Login API call has a 3-second timeout — if json-server is not running, the login fails quickly instead of hanging

### Admin Panel Updates

The admin sidebar now includes the following pages:

| Page | Route | Purpose |
| --- | --- | --- |
| Dashboard | `/admin-dashboard` | Welcome banner, quick controls, student count, audit log |
| Manage Students | `/admin/students` | Full CRUD — add, edit, delete, search students |
| Manage Attendance | `/admin/attendance` | Mark present or absent for each student, save to localStorage |
| Manage Assessments | `/admin/assessments` | Upload assessment title, subject, deadline, and file name, saved to localStorage |
| Manage Notices | `/admin/notices` | Post and delete notices — visible to all students |
| Account | `/admin/account` | View logged-in admin username and name |

### Student Panel Updates

The student sidebar now includes the following pages:

| Page | Route | Purpose |
| --- | --- | --- |
| Dashboard | `/student-dashboard` | Welcome with dynamic name, attendance circle, course info, to-do list, notices |
| Attendance | `/student/attendance` | View attendance records with present, absent, and percentage stats |
| Assessments | `/student/assessments` | View and submit assessments posted by admin |
| Notices | `/student/notices` | Read notices posted by admin |
| Account | `/student/account` | View logged-in student username, name, and role |

### UI Updates

- Consistent color scheme across all pages — dark navy sidebar (`#0d2248`), cyan accent (`#17c3d4`), light blue-gray background (`#dde8f0`)
- Collapsible sidebar on all pages — icons remain visible when collapsed, text hides
- User avatar and name shown at the bottom of the sidebar
- Sticky top header with logout button on all pages
- Login page updated with two-column layout, cyan geometric accent, and toggle between Student Login, Admin Login, and Sign Up

### Updated Routing

| Route | Access |
| --- | --- |
| `/login` | Public |
| `/admin-dashboard` | Admin only |
| `/admin/students` | Admin only |
| `/admin/students/add` | Admin only |
| `/admin/students/edit/:id` | Admin only |
| `/admin/attendance` | Admin only |
| `/admin/assessments` | Admin only |
| `/admin/notices` | Admin only |
| `/admin/account` | Admin only |
| `/student-dashboard` | Student only |
| `/student/attendance` | Student only |
| `/student/assessments` | Student only |
| `/student/notices` | Student only |
| `/student/account` | Student only |

All protected routes use `AuthGuard`. The server-side rendering config sets all dashboard and CRUD routes to client-side render mode to avoid localStorage conflicts with SSR.

### Important API Note

Always start json-server using the npm script, not `npx json-server`:

```bash
npm run api
```

Using `npx json-server` picks up the globally installed version 1 beta which generates random IDs and does not behave like version 0.17.4 used by this project.
