import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './student-dashboard.html',
  styleUrls: ['./student-dashboard.css']
})
export class StudentDashboard {

  studentName: string = '';
  studentInitials = '';
  totalAssignmentsDue: number = 3;
  attendancePercentage: number = 88;

  currentCourseTitle: string = 'Introduction to Angular 21';
  instructorName: string = 'Shikha Prasad';
  nextClassTime: string = 'Monday at 10:00 AM';

  todoItem1: string = 'Submit Binary Trees Lab Report';
  todoItem2: string = 'Complete Angular Components Assignment';
  todoItem3: string = 'Finish SQL Query Practice Sheet';

  noticeTitle: string = 'Mid-semester exam schedule released';
  noticeContent: string = 'Theory and lab timetables starting 08 Dec 2026 are now finalized and available for download.';

  constructor(private authService: AuthService) {
    this.studentName = this.authService.getName() || 'Student';
    this.studentInitials = this.studentName
      .split(/\s+/)
      .map(part => part.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  logout(): void {
    this.authService.logout();
  }
}
