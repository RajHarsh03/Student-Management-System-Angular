import { Component } from '@angular/core';
import { StudentDashboard } from './dashboard/student-dashboard/student-dashboard';
import { AdminDashboard } from './dashboard/admin-dashboard/admin-dashboard';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [StudentDashboard, AdminDashboard],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}