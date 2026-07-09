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

  studentName: string = 'Ayush Prakash';
  totalAssignmentsDue: number = 3;
  attendancePercentage: number = 92;

  currentCourseTitle: string = 'Introduction to Angular 21';
  instructorName: string = 'Shikha Prasad';
  nextClassTime: string = 'Monday at 10:00 AM';

  todoItem1: string = 'Submit Angular Assignment 1';
  todoItem2: string = 'Read Chapter 4 of UI Design Book';
  todoItem3: string = 'Prepare for JavaScript Quiz';

  noticeTitle: string = 'Midterm Exam Schedule Posted';
  noticeContent: string = 'The midterm examination timetable has been updated on the main university portal. Please verify your room details.';

  constructor(private authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
