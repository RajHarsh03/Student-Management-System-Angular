import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';

interface Assessment {
  id: number;
  title: string;
  subject: string;
  deadline: string;
  fileName: string;
  isUrgent: boolean;
}

@Component({
  selector: 'app-admin-assessments',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './admin-assessments.html',
  styleUrls: ['./admin-assessments.css']
})
export class AdminAssessmentsComponent {

  showForm: boolean = false;
  saved: boolean = false;
  assessments: Assessment[] = [];

  form = { title: '', subject: '', deadline: '', fileName: '' };

  constructor(private authService: AuthService) {
    const stored = localStorage.getItem('adminAssessments');
    this.assessments = stored ? JSON.parse(stored) : [];
  }

  onFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.form.fileName = input.files[0].name;
    }
  }

  save(): void {
    if (!this.form.title || !this.form.subject || !this.form.deadline) return;
    const today = new Date();
    const deadline = new Date(this.form.deadline);
    const diff = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    const assessment: Assessment = {
      id: Date.now(),
      title: this.form.title,
      subject: this.form.subject,
      deadline: this.form.deadline,
      fileName: this.form.fileName || 'No file uploaded',
      isUrgent: diff <= 3
    };

    this.assessments.unshift(assessment);
    localStorage.setItem('adminAssessments', JSON.stringify(this.assessments));
    this.form = { title: '', subject: '', deadline: '', fileName: '' };
    this.showForm = false;
    this.saved = true;
    setTimeout(() => this.saved = false, 3000);
  }

  delete(id: number): void {
    this.assessments = this.assessments.filter(a => a.id !== id);
    localStorage.setItem('adminAssessments', JSON.stringify(this.assessments));
  }

  logout(): void { this.authService.logout(); }
}
