import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  private route          = inject(ActivatedRoute);
  private authService    = inject(AuthService);
  private fb             = inject(FormBuilder);
  private destroy$       = new Subject<void>();

  allStudents  = signal<Student[]>([]);
  displayed    = signal<Student[]>([]);
  loading      = signal(false);
  showStudentModal = signal(false);
  savingStudent = signal(false);
  editingStudentId = signal<string | null>(null);
  errorMsg     = signal('');
  deleteTarget = signal<Student | null>(null);
  deleting     = signal(false);

  searchCtrl  = new FormControl('');
  searchError = signal('');

  addForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    age: [null, [Validators.required, Validators.min(5), Validators.max(100), Validators.pattern(/^\d+$/)]],
    course: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]]
  });

  ngOnInit(): void {
    this.loadStudents();

    this.route.queryParamMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        if (params.get('action') !== 'add') return;

        this.openAddModal();
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { action: null },
          queryParamsHandling: 'merge',
          replaceUrl: true
        });
      });

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
    const student = this.allStudents().find(item => item.id === id);
    if (student) {
      this.openEditModal(student);
      return;
    }

    this.router.navigate(['/admin/students/edit', id]);
  }

  openAddModal(): void {
    this.editingStudentId.set(null);
    this.addForm.reset();
    this.showStudentModal.set(true);
  }

  openEditModal(student: Student): void {
    this.editingStudentId.set(student.id);
    this.addForm.patchValue({
      name: student.name,
      age: student.age,
      course: student.course,
      email: student.email
    });
    this.showStudentModal.set(true);
  }

  closeStudentModal(): void {
    if (this.savingStudent()) return;
    this.showStudentModal.set(false);
    this.editingStudentId.set(null);
    this.addForm.reset();
  }

  saveStudent(): void {
    this.addForm.markAllAsTouched();
    if (this.addForm.invalid) return;

    const value = this.addForm.getRawValue();
    const editingId = this.editingStudentId();
    const studentData = {
      name: value.name.trim(),
      age: Number(value.age),
      course: value.course.trim(),
      email: value.email.trim()
    };
    const request$ = editingId
      ? this.studentService.updateStudent(editingId, { id: editingId, ...studentData })
      : this.studentService.createStudent(studentData);

    this.savingStudent.set(true);
    request$.pipe(takeUntil(this.destroy$)).subscribe({
      next: student => {
        if (editingId) {
          this.allStudents.update(list =>
            list.map(existing => existing.id === editingId ? student : existing)
          );
        } else {
          this.allStudents.update(list => [...list, student]);
          localStorage.setItem('totalStudents', String(this.allStudents().length));
          this.recordEnrollment(student.id);
        }
        this.applyCurrentFilter();
        this.savingStudent.set(false);
        this.showStudentModal.set(false);
        this.editingStudentId.set(null);
        this.addForm.reset();
        this.toastService.show(
          editingId ? 'Student updated successfully.' : 'Student added successfully.',
          'success'
        );
      },
      error: () => {
        this.savingStudent.set(false);
        this.toastService.show(
          editingId ? 'Failed to update student. Please try again.' : 'Failed to add student. Please try again.',
          'error'
        );
      }
    });
  }

  hasAddError(field: string, error: string): boolean {
    const control = this.addForm.get(field);
    return !!(control?.touched && control.hasError(error));
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
          localStorage.setItem('totalStudents', String(this.allStudents().length));
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

  private recordEnrollment(studentId: string): void {
    const stored = localStorage.getItem('studentEnrollmentHistory');
    const history = stored
      ? JSON.parse(stored) as Array<{ studentId: string; date: string }>
      : [];
    history.push({ studentId, date: new Date().toISOString() });
    localStorage.setItem('studentEnrollmentHistory', JSON.stringify(history));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout(): void {
    this.authService.logout();
  }
}
