import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';

interface AttendanceRecord {
  attendance?: Array<{ status: string }>;
}

interface EnrollmentEvent {
  date: string;
}

interface EnrollmentMonth {
  label: string;
  count: number;
  height: number;
}

interface ApprovalTask {
  id: string;
  description: string;
}

interface AuditEntry {
  timestamp: string;
  message: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboard {
  adminName = 'Director Sarah Stone';
  adminRole = 'Super Admin';
  totalStudentsCount = 0;
  presentStudentsCount = 0;
  attendancePercentage = 0;
  activeNoticesCount = 0;
  showNoticeForm = false;
  noticeText = '';
  todayDisplay = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  mockStudentId = 'STU-2026-089';
  mockStudentName = 'Michael Scott';
  mockStudentDept = 'Computer Science & Engineering';
  mockStudentStatus = 'Active Enrolled / No Fees Owed';

  pendingApprovals: ApprovalTask[] = [
    { id: 'ID-204', description: 'Medical Leave Request Form' },
    { id: 'ID-112', description: 'Profile Last Name Change Review' }
  ];

  enrollmentTrend: EnrollmentMonth[] = [];

  auditLogs: AuditEntry[] = [
    {
      timestamp: 'Today',
      message: 'Admin dashboard activity will appear here as records are updated.'
    },
    {
      timestamp: 'Today',
      message: 'Student enrollment and assessment activity is tracked from the portal.'
    }
  ];

  constructor(private authService: AuthService, private router: Router) {
    this.totalStudentsCount = Number(localStorage.getItem('totalStudents') ?? 0);
    const savedApprovals = localStorage.getItem('pendingApprovals');
    if (savedApprovals) {
      this.pendingApprovals = JSON.parse(savedApprovals) as ApprovalTask[];
    }
    const savedAuditLogs = localStorage.getItem('adminAuditLogs');
    if (savedAuditLogs) {
      this.auditLogs = JSON.parse(savedAuditLogs) as AuditEntry[];
    }
    this.loadDashboardMetrics();
  }

  registerStudent(): void {
    this.router.navigate(['/admin/students'], { queryParams: { action: 'add' } });
  }

  openStudentRecords(): void {
    this.router.navigate(['/admin/students']);
  }

  postNotice(): void {
    this.showNoticeForm = true;
  }

  submitNotice(): void {
    if (!this.noticeText.trim()) return;
    const existing = localStorage.getItem('adminNotices');
    const notices = existing ? JSON.parse(existing) : [];
    notices.unshift({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: 'System Notice',
      audience: 'All Students',
      text: this.noticeText.trim(),
      date: new Date().toLocaleString()
    });
    localStorage.setItem('adminNotices', JSON.stringify(notices));
    this.activeNoticesCount = notices.length;
    this.recordAudit('Published a new system notice.');
    this.showNoticeForm = false;
    this.noticeText = '';
  }

  cancelNotice(): void {
    this.showNoticeForm = false;
    this.noticeText = '';
  }

  reviewApproval(approvalId: string, decision: 'approved' | 'rejected'): void {
    const approval = this.pendingApprovals.find(item => item.id === approvalId);
    if (!approval) return;

    this.pendingApprovals = this.pendingApprovals.filter(item => item.id !== approvalId);
    localStorage.setItem('pendingApprovals', JSON.stringify(this.pendingApprovals));
    this.recordAudit(`${approval.description} ${decision}.`);
  }

  get pendingApprovalCount(): number {
    return this.pendingApprovals.length;
  }

  get hasEnrollmentHistory(): boolean {
    return this.enrollmentTrend.some(month => month.count > 0);
  }

  private loadDashboardMetrics(): void {
    const attendanceStored = localStorage.getItem('attendanceRecords');
    const attendanceRecords = attendanceStored
      ? JSON.parse(attendanceStored) as AttendanceRecord[]
      : [];
    const latestAttendance = attendanceRecords[0]?.attendance ?? [];
    this.presentStudentsCount = latestAttendance.filter(row => row.status === 'Present').length;
    this.attendancePercentage = latestAttendance.length
      ? Math.round((this.presentStudentsCount / latestAttendance.length) * 100)
      : 0;

    const noticesStored = localStorage.getItem('adminNotices');
    const notices = noticesStored ? JSON.parse(noticesStored) as unknown[] : [];
    this.activeNoticesCount = notices.length;
    this.enrollmentTrend = this.buildEnrollmentTrend();
  }

  private buildEnrollmentTrend(): EnrollmentMonth[] {
    const historyStored = localStorage.getItem('studentEnrollmentHistory');
    const history = historyStored ? JSON.parse(historyStored) as EnrollmentEvent[] : [];
    const currentMonth = new Date();
    const months = Array.from({ length: 6 }, (_, index) => {
      const month = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - (5 - index), 1);
      const count = history.filter(event => {
        const enrolledAt = new Date(event.date);
        return enrolledAt.getFullYear() === month.getFullYear() &&
          enrolledAt.getMonth() === month.getMonth();
      }).length;
      return {
        label: month.toLocaleDateString('en-US', { month: 'short' }),
        count,
        height: 0
      };
    });
    const maxCount = Math.max(...months.map(month => month.count), 1);

    return months.map(month => ({
      ...month,
      height: month.count ? Math.max(12, Math.round((month.count / maxCount) * 100)) : 0
    }));
  }

  private recordAudit(message: string): void {
    this.auditLogs.unshift({
      timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      message
    });
    this.auditLogs = this.auditLogs.slice(0, 5);
    localStorage.setItem('adminAuditLogs', JSON.stringify(this.auditLogs));
  }

  logout(): void {
    this.authService.logout();
  }
}
