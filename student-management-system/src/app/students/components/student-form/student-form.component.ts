import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  FormBuilder, FormGroup, ReactiveFormsModule,
  Validators, AbstractControl
} from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { StudentService } from '../../../services/student.service';
import { ToastService } from '../../services/toast.service';
import { ToastComponent } from '../toast/toast.component';

function integerValidator(control: AbstractControl) {
  const v = control.value;
  if (v === null || v === '') return null;
  return Number.isInteger(Number(v)) ? null : { integer: true };
}

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, ToastComponent],
  templateUrl: './student-form.component.html',
  styleUrl: './student-form.component.css'
})
export class StudentFormComponent implements OnInit, OnDestroy {
  private fb             = inject(FormBuilder);
  private studentService = inject(StudentService);
  private toastService   = inject(ToastService);
  private router         = inject(Router);
  private route          = inject(ActivatedRoute);
  private destroy$       = new Subject<void>();

  isEditMode = signal(false);
  loading    = signal(false);
  submitting = signal(false);
  studentId  = signal<string | null>(null);

  form: FormGroup = this.fb.group({
    name:   ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    age:    [null, [Validators.required, Validators.min(5), Validators.max(100), integerValidator]],
    course: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    email:  ['', [Validators.required, Validators.email]]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.studentId.set(id);
      this.loadStudent(id);
    }
  }

  private loadStudent(id: string): void {
    this.loading.set(true);
    this.studentService.getStudentById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: s => {
          this.form.patchValue({ name: s.name, age: s.age, course: s.course, email: s.email });
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.toastService.show('Could not load student data.', 'error');
          this.router.navigate(['/admin/students']);
        }
      });
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const value = this.form.value;

    this.submitting.set(true);
    const request$ = this.isEditMode()
      ? this.studentService.updateStudent(this.studentId()!, { id: this.studentId()!, ...value })
      : this.studentService.createStudent(value);

    request$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.submitting.set(false);
        this.toastService.show(
          this.isEditMode() ? 'Student updated successfully.' : 'Student added successfully.',
          'success'
        );
        this.router.navigate(['/admin/students']);
      },
      error: () => {
        this.submitting.set(false);
        this.toastService.show(
          this.isEditMode() ? 'Failed to update student.' : 'Failed to add student.',
          'error'
        );
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/students']);
  }

  hasError(field: string, error: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.touched && ctrl.hasError(error));
  }

  isFieldInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.touched && ctrl.invalid);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
