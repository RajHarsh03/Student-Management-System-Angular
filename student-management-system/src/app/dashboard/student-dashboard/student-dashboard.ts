import { Component } from '@angular/core';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './student-dashboard.html',
  styleUrls: ['./student-dashboard.css']
})
export class StudentDashboard {
  // Simple TypeScript variables for interpolation (Week 1-2 concepts)
  studentName: string = 'Ayush Prakash';
  totalAssignmentsDue: number = 3;
  attendancePercentage: number = 92;

  // Course Details
  currentCourseTitle: string = 'Introduction to Angular 21';
  instructorName: string = 'Shikha Prasad';
  nextClassTime: string = 'Monday at 10:00 AM';

  // To-Do List Items
  todoItem1: string = 'Submit Angular Assignment 1';
  todoItem2: string = 'Read Chapter 4 of UI Design Book';
  todoItem3: string = 'Prepare for JavaScript Quiz';

  // Notice Board
  noticeTitle: string = 'Midterm Exam Schedule Posted';
  noticeContent: string = 'The midterm examination timetable has been updated on the main university portal. Please verify your room details.';
}