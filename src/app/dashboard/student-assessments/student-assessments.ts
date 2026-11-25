import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Assessment, DEFAULT_ASSESSMENTS } from '../../models/assessment.model';

interface StudentAssessment extends Assessment {
  submitted: boolean;
  fileName: string;
}

@Component({
  selector: 'app-student-assessments',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './student-assessments.html',
  styleUrls: ['./student-assessments.css']
})
export class StudentAssessmentsComponent {
  studentName: string;
  studentInitials: string;
  assessments: StudentAssessment[] = [];

  constructor(private authService: AuthService) {
    this.studentName = this.authService.getName() || 'Student';
    this.studentInitials = this.studentName
      .split(/\s+/)
      .map(part => part.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase();
    const stored = localStorage.getItem('adminAssessments');
    const adminList = stored
      ? JSON.parse(stored) as Assessment[]
      : DEFAULT_ASSESSMENTS;
    const username = this.authService.getUsername() || 'student';

    this.assessments = adminList.map(assessment => {
      const submissions = assessment.submissions ?? [];
      const ownSubmission = submissions.find(item => item.username === username);

      return {
        ...assessment,
        submissions,
        submitted: !!ownSubmission,
        fileName: ownSubmission?.fileName ?? ''
      };
    });
  }

  onFileSelect(event: Event, assessment: StudentAssessment): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      assessment.fileName = input.files[0].name;
    }
  }

  submit(assessment: StudentAssessment): void {
    if (!assessment.fileName || assessment.submitted) return;

    const stored = localStorage.getItem('adminAssessments');
    const adminList = stored
      ? JSON.parse(stored) as Assessment[]
      : DEFAULT_ASSESSMENTS.map(item => ({ ...item, submissions: [...item.submissions] }));
    const record = adminList.find(item => item.id === assessment.id);
    if (!record) return;
    record.submissions ??= [];

    const username = this.authService.getUsername() || 'student';
    const existing = record.submissions.find(item => item.username === username);
    if (existing) return;

    const submission = {
      username,
      studentName: this.authService.getName() || 'Student',
      fileName: assessment.fileName,
      submittedAt: new Date().toISOString()
    };

    record.submissions.push(submission);
    localStorage.setItem('adminAssessments', JSON.stringify(adminList));
    assessment.submissions = record.submissions;
    assessment.submitted = true;
  }

  logout(): void { this.authService.logout(); }
}
