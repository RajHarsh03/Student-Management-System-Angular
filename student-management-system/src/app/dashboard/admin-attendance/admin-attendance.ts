import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { StudentService } from '../../services/student.service';

interface AttendanceRow {
  id: string;
  name: string;
  status: 'Present' | 'Absent' | null;
}

@Component({
  selector: 'app-admin-attendance',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-attendance.html',
  styleUrls: ['./admin-attendance.css']
})
export class AdminAttendanceComponent implements OnInit {

  today: string = new Date().toLocaleDateString();
  rows: AttendanceRow[] = [];
  saved: boolean = false;

  constructor(private authService: AuthService, private studentService: StudentService) {}

  ngOnInit(): void {
    this.studentService.getStudents().subscribe({
      next: students => {
        this.rows = students.map(s => ({ id: s.id, name: s.name, status: null }));
      }
    });
  }

  mark(row: AttendanceRow, status: 'Present' | 'Absent'): void {
    row.status = status;
  }

  markAll(status: 'Present' | 'Absent'): void {
    this.rows.forEach(r => r.status = status);
  }

  save(): void {
    const record = {
      date: this.today,
      attendance: this.rows.map(r => ({ id: r.id, name: r.name, status: r.status ?? 'Absent' }))
    };
    const existing = localStorage.getItem('attendanceRecords');
    const records = existing ? JSON.parse(existing) : [];
    records.unshift(record);
    localStorage.setItem('attendanceRecords', JSON.stringify(records));
    this.saved = true;
  }

  get markedCount(): number { return this.rows.filter(r => r.status !== null).length; }

  logout(): void { this.authService.logout(); }
}
