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

  assessments: Assessment[] = [
    { id: 1, title: 'Angular Components Assignment', subject: 'Introduction to Angular', deadline: '2026-07-15', submitted: false, fileName: '', isUrgent: false },
    { id: 2, title: 'Binary Trees Lab Report',       subject: 'Data Structures',          deadline: '2026-07-12', submitted: false, fileName: '', isUrgent: true  },
    { id: 3, title: 'SQL Query Practice',            subject: 'Database Management',      deadline: '2026-07-20', submitted: true,  fileName: 'sql_practice.pdf', isUrgent: false },
    { id: 4, title: 'UI Design Mockup',              subject: 'Introduction to Angular',  deadline: '2026-07-10', submitted: false, fileName: '', isUrgent: true  },
  ];

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

  constructor(private authService: AuthService) {}

  logout(): void { this.authService.logout(); }
}
