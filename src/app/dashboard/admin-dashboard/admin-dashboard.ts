import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboard {

  adminName: string = 'Director Sarah Stone';
  adminRole: string = 'Super Admin';
  totalStudentsCount: number = 0;
  showNoticeForm: boolean = false;
  noticeText: string = '';

  mockStudentId: string = 'STU-2026-089';
  mockStudentName: string = 'Michael Scott';
  mockStudentDept: string = 'Computer Science & Engineering';
  mockStudentStatus: string = 'Active Enrolled / No Fees Owed';

  approvalTask1: string = 'ID-204: Medical Leave Request Form';
  approvalTask2: string = 'ID-112: Profile Last Name Change Review';

  logTimestamp: string = 'July 04, 2026 - 18:42:10 UTC';
  logActionMessage: string = 'Admin Account (Sarah Stone) updated tuition fee waiver status flags for 14 scholarship applicants.';

  constructor(private authService: AuthService, private router: Router) {
    const stored = localStorage.getItem('totalStudents');
    this.totalStudentsCount = stored ? parseInt(stored, 10) : 0;
  }

  registerStudent(): void {
    this.router.navigate(['/admin/students/add']);
  }

  postNotice(): void {
    this.showNoticeForm = true;
  }

  submitNotice(): void {
    if (!this.noticeText.trim()) return;
    const existing = localStorage.getItem('adminNotices');
    const notices = existing ? JSON.parse(existing) : [];
    notices.unshift({ text: this.noticeText.trim(), date: new Date().toLocaleString() });
    localStorage.setItem('adminNotices', JSON.stringify(notices));
    this.showNoticeForm = false;
    this.noticeText = '';
  }

  cancelNotice(): void {
    this.showNoticeForm = false;
    this.noticeText = '';
  }

  logout(): void {
    this.authService.logout();
  }
}
