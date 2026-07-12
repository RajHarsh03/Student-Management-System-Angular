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
    this.assessments = adminList.map((a: any) => ({
      ...a,
      submitted: false,
      fileName: ''
    }));
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
