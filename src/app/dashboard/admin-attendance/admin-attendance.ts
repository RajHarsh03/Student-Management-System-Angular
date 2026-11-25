import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

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
export class AdminAttendanceComponent {

  today: string = new Date().toLocaleDateString();
  saved: boolean = false;

  rows: AttendanceRow[] = [
    { id: '1',  name: 'Aarav Sharma',  status: null },
    { id: '2',  name: 'Priya Patel',   status: null },
    { id: '3',  name: 'Rohit Verma',   status: null },
    { id: '4',  name: 'Sneha Iyer',    status: null },
    { id: '5',  name: 'Karan Mehta',   status: null },
    { id: '6',  name: 'Anjali Singh',  status: null },
    { id: '7',  name: 'Vikram Nair',   status: null },
    { id: '8',  name: 'Pooja Gupta',   status: null },
    { id: '9',  name: 'Arjun Reddy',   status: null },
    { id: '10', name: 'Neha Joshi',    status: null },
  ];

  constructor(private authService: AuthService) {}

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
