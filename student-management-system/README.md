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
        |   `-- student-dashboard/
        |-- students/
        |   |-- components/
        |   |-- services/
        |   `-- students.routes.ts
        |-- models/
        |-- services/
        |-- app.config.ts
        `-- app.routes.ts
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
