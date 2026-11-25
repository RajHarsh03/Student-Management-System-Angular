import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

interface Assessment {
  id: number;
  title: string;
  subject: string;
  deadline: string;
  submitted: boolean;
  fileName: string;
  isUrgent: boolean;
}

@Component({
  selector: 'app-student-assessments',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './student-assessments.html',
  styleUrls: ['./student-assessments.css']
})
export class StudentAssessmentsComponent {

  assessments: Assessment[] = [];

  constructor(private authService: AuthService) {
    const stored = localStorage.getItem('adminAssessments');
    const adminList = stored ? JSON.parse(stored) : [];

    if (adminList.length > 0) {
      this.assessments = adminList.map((a: any) => ({
        ...a,
        submitted: false,
        fileName: ''
      }));
    } else {
      this.assessments = [
        { id: 1, title: 'Angular Components Assignment', subject: 'Introduction to Angular', deadline: '2026-07-20', submitted: false, fileName: '', isUrgent: false },
        { id: 2, title: 'Binary Trees Lab Report',       subject: 'Data Structures',         deadline: '2026-07-14', submitted: false, fileName: '', isUrgent: true  },
        { id: 3, title: 'SQL Query Practice',            subject: 'Database Management',     deadline: '2026-07-25', submitted: false, fileName: '', isUrgent: false },
      ];
    }
  }

  onFileSelect(event: Event, assessment: Assessment): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      assessment.fileName = input.files[0].name;
    }
  }

  submit(assessment: Assessment): void {
    if (!assessment.fileName) return;
    assessment.submitted = true;
  }

  logout(): void { this.authService.logout(); }
}
