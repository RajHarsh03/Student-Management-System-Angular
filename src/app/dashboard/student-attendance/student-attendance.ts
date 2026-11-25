import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

interface AttendanceRecord {
  date: string;
  subject: string;
  status: 'Present' | 'Absent';
}

@Component({
  selector: 'app-student-attendance',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './student-attendance.html',
  styleUrls: ['./student-attendance.css']
})
export class StudentAttendanceComponent {
  studentName: string;
  studentInitials: string;

  records: AttendanceRecord[] = [
    { date: '2026-07-01', subject: 'Introduction to Angular', status: 'Present' },
    { date: '2026-07-02', subject: 'Data Structures', status: 'Present' },
    { date: '2026-07-03', subject: 'Database Management', status: 'Absent' },
    { date: '2026-07-04', subject: 'Introduction to Angular', status: 'Present' },
    { date: '2026-07-05', subject: 'Data Structures', status: 'Absent' },
    { date: '2026-07-07', subject: 'Database Management', status: 'Present' },
    { date: '2026-07-08', subject: 'Introduction to Angular', status: 'Present' },
    { date: '2026-07-09', subject: 'Data Structures', status: 'Present' },
  ];

  get total()   { return this.records.length; }
  get present() { return this.records.filter(r => r.status === 'Present').length; }
  get absent()  { return this.records.filter(r => r.status === 'Absent').length; }
  get percentage() { return this.total ? Math.round((this.present / this.total) * 100) : 0; }
  get subjectAttendance() {
    return [...new Set(this.records.map(record => record.subject))].map(name => {
      const subjectRecords = this.records.filter(record => record.subject === name);
      const presentCount = subjectRecords.filter(record => record.status === 'Present').length;
      return {
        name,
        percentage: Math.round((presentCount / subjectRecords.length) * 100)
      };
    });
  }

  constructor(private authService: AuthService) {
    this.studentName = this.authService.getName() || 'Student';
    this.studentInitials = this.studentName
      .split(/\s+/)
      .map(part => part.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  logout(): void { this.authService.logout(); }
}
