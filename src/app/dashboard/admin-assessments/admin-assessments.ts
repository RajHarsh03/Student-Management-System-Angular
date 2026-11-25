import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Assessment, DEFAULT_ASSESSMENTS } from '../../models/assessment.model';

@Component({
  selector: 'app-admin-assessments',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './admin-assessments.html',
  styleUrls: ['./admin-assessments.css']
})
export class AdminAssessmentsComponent {
  showForm = false;
  showSubmissions = false;
  saved = false;
  searchQuery = '';
  editingAssessmentId: number | null = null;
  selectedAssessment: Assessment | null = null;
  assessments: Assessment[] = [];
  totalStudentsCount = 0;

  form = { title: '', subject: '', deadline: '', fileName: '' };

  constructor(private authService: AuthService) {
    const stored = localStorage.getItem('adminAssessments');
    const savedAssessments = stored
      ? JSON.parse(stored) as Assessment[]
      : DEFAULT_ASSESSMENTS;

    this.assessments = savedAssessments.map(assessment => ({
      ...assessment,
      submissions: assessment.submissions ?? []
    }));
    this.totalStudentsCount = Number(localStorage.getItem('totalStudents') ?? 0);
  }

  get filteredAssessments(): Assessment[] {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) return this.assessments;

    return this.assessments.filter(assessment =>
      `${assessment.title} ${assessment.subject}`.toLowerCase().includes(query)
    );
  }

  onFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.form.fileName = input.files[0].name;
    }
  }

  openNewForm(): void {
    this.editingAssessmentId = null;
    this.form = { title: '', subject: '', deadline: '', fileName: '' };
    this.showForm = true;
  }

  editAssessment(assessment: Assessment): void {
    this.editingAssessmentId = assessment.id;
    this.form = {
      title: assessment.title,
      subject: assessment.subject,
      deadline: assessment.deadline,
      fileName: assessment.fileName
    };
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingAssessmentId = null;
    this.form = { title: '', subject: '', deadline: '', fileName: '' };
  }

  save(): void {
    if (!this.form.title.trim() || !this.form.subject.trim() || !this.form.deadline) return;

    const today = new Date();
    const deadline = new Date(this.form.deadline);
    const diff = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const existing = this.assessments.find(item => item.id === this.editingAssessmentId);
    const assessment: Assessment = {
      id: this.editingAssessmentId ?? Date.now(),
      title: this.form.title.trim(),
      subject: this.form.subject.trim(),
      deadline: this.form.deadline,
      fileName: this.form.fileName || existing?.fileName || 'No file uploaded',
      isUrgent: diff <= 3,
      submissions: existing?.submissions ?? []
    };

    if (this.editingAssessmentId !== null) {
      this.assessments = this.assessments.map(item =>
        item.id === this.editingAssessmentId ? assessment : item
      );
    } else {
      this.assessments.unshift(assessment);
    }

    this.persistAssessments();
    this.closeForm();
    this.saved = true;
    setTimeout(() => this.saved = false, 3000);
  }

  delete(id: number): void {
    this.assessments = this.assessments.filter(assessment => assessment.id !== id);
    this.persistAssessments();
  }

  openSubmissions(assessment: Assessment): void {
    this.selectedAssessment = assessment;
    this.showSubmissions = true;
  }

  closeSubmissions(): void {
    this.showSubmissions = false;
    this.selectedAssessment = null;
  }

  submissionPercent(assessment: Assessment): number {
    if (!this.totalStudentsCount) return 0;
    return Math.min(100, Math.round((assessment.submissions.length / this.totalStudentsCount) * 100));
  }

  private persistAssessments(): void {
    localStorage.setItem('adminAssessments', JSON.stringify(this.assessments));
  }

  logout(): void { this.authService.logout(); }
}
