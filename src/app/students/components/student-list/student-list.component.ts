import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { StudentService } from '../../../services/student.service';
import { ToastService } from '../../services/toast.service';
import { ToastComponent } from '../toast/toast.component';
import { Student } from '../../../models/student.model';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, ToastComponent],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.css'
})
export class StudentListComponent implements OnInit, OnDestroy {
  private studentService = inject(StudentService);
  private toastService   = inject(ToastService);
  private router         = inject(Router);
  private authService    = inject(AuthService);
  private destroy$       = new Subject<void>();

  allStudents  = signal<Student[]>([]);
  displayed    = signal<Student[]>([]);
  loading      = signal(false);
  errorMsg     = signal('');
  deleteTarget = signal<Student | null>(null);
  deleting     = signal(false);

  searchCtrl  = new FormControl('');
  searchError = signal('');

  ngOnInit(): void {
    this.loadStudents();

    // Instant clear — bypass debounce
    this.searchCtrl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(raw => {
        const val = raw ?? '';
        if (val.length > 100) {
          this.searchError.set('Search keyword must not exceed 100 characters.');
          return;
        }
        this.searchError.set('');
        if (!val.trim()) {
          this.displayed.set(this.allStudents());
        }
      });

    // Debounced filter (300 ms)
    this.searchCtrl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(raw => {
        const val = (raw ?? '').trim();
        if (!val || val.length > 100) return;
        const lower = val.toLowerCase();
        this.displayed.set(
          this.allStudents().filter(s =>
            s.name.toLowerCase().includes(lower) ||
            s.course.toLowerCase().includes(lower) ||
            s.email.toLowerCase().includes(lower)
          )
        );
      });
  }

  loadStudents(): void {
    this.loading.set(true);
    this.errorMsg.set('');
    this.studentService.getStudents()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: students => {
          this.allStudents.set(students);
          this.applyCurrentFilter();
          this.loading.set(false);
          localStorage.setItem('totalStudents', String(students.length));
        },
        error: () => {
          this.errorMsg.set('Failed to load student data. Please try again.');
          this.loading.set(false);
        }
      });
  }

  private applyCurrentFilter(): void {
    const val = (this.searchCtrl.value ?? '').trim().toLowerCase();
    if (!val) {
      this.displayed.set(this.allStudents());
    } else {
      this.displayed.set(
        this.allStudents().filter(s =>
          s.name.toLowerCase().includes(val) ||
          s.course.toLowerCase().includes(val) ||
          s.email.toLowerCase().includes(val)
        )
      );
    }
  }

  onEdit(id: string): void {
    this.router.navigate(['/admin/students/edit', id]);
  }

  onDeleteClick(student: Student): void {
    this.deleteTarget.set(student);
  }

  onDeleteCancel(): void {
    this.deleteTarget.set(null);
  }

  onDeleteConfirm(): void {
    const target = this.deleteTarget();
    if (!target) return;
    this.deleting.set(true);
    this.studentService.deleteStudent(target.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.allStudents.update(list => list.filter(s => s.id !== target.id));
          this.applyCurrentFilter();
          this.deleteTarget.set(null);
          this.deleting.set(false);
          this.toastService.show(`"${target.name}" deleted successfully.`, 'success');
        },
        error: () => {
          this.deleting.set(false);
          this.deleteTarget.set(null);
          this.toastService.show('Failed to delete student. Please try again.', 'error');
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout(): void {
    this.authService.logout();
  }
}
