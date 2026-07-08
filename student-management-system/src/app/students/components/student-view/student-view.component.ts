import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StudentService } from '../../../services/student.service';
import { Student } from '../../../models/student.model';

@Component({
  selector: 'app-student-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './student-view.component.html',
  styleUrl: './student-view.component.css'
})
export class StudentViewComponent implements OnInit {
  private studentService = inject(StudentService);

  // In a real app this ID comes from AuthService after login.
  // For now we use the first student as a demo of the student role view.
  private readonly myStudentId = '1';

  student  = signal<Student | null>(null);
  loading  = signal(false);
  errorMsg = signal('');

  ngOnInit(): void {
    this.loading.set(true);
    this.studentService.getStudentById(this.myStudentId).subscribe({
      next: s  => { this.student.set(s); this.loading.set(false); },
      error: () => { this.errorMsg.set('Could not load your information.'); this.loading.set(false); }
    });
  }
}
