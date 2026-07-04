import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboard {
  adminName: string = 'Director Sarah Stone';
  adminRole: string = 'Super Admin';
  activeSessions: number = 142;
  totalStudentsCount: number = 3840;

  mockStudentId: string = 'STU-2026-089';
  mockStudentName: string = 'Michael Scott';
  mockStudentDept: string = 'Computer Science & Engineering';
  mockStudentStatus: string = 'Active Enrolled / No Fees Owed';

  approvalTask1: string = 'ID-204: Medical Leave Request Form';
  approvalTask2: string = 'ID-112: Profile Last Name Change Review';

  logTimestamp: string = 'July 04, 2026 - 18:42:10 UTC';
  logActionMessage: string =
    'Admin Account (Sarah Stone) updated tuition fee waiver status flags for 14 scholarship applicants.';
}