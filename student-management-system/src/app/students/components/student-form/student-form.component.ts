import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl
} from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { StudentService } from '../../../services/student.service';
import { ToastService } from '../../services/toast.service';
import { ToastComponent } from '../toast/toast.component';

/** Whole-number validator */
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
        next: student => {
          this.form.patchValue({
            name:   student.name,
            age:    student.age,
            course: student.course,
            email:  student.email
          });
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.toastService.show('Could not load student data.', 'error');
          this.router.navigate(['/students']);
        }
      });
  }

  onSubmit(): void {
    // Mark all fields as touched so inline errors appear
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const value = this.form.value;

    if (this.isEditMode()) {
      const id = this.studentId()!;
      this.submitting.set(true);
      this.studentService.updateStudent(id, { id, ...value })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.submitting.set(false);
            this.toastService.show('Student updated successfully.', 'success');
            this.router.navigate(['/students']);
          },
          error: () => {
            this.submitting.set(false);
            this.toastService.show('Failed to update student. Please try again.', 'error');
          }
        });
    } else {
      this.submitting.set(true);
      this.studentService.createStudent(value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.submitting.set(false);
            this.toastService.show('Student added successfully.', 'success');
            this.router.navigate(['/students']);
          },
          error: () => {
            this.submitting.set(false);
            this.toastService.show('Failed to add student. Please try again.', 'error');
          }
        });
    }
  }

  onCancel(): void {
    this.router.navigate(['/students']);
  }

  /** Helper used in template */
  hasError(field: string, error: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl && ctrl.touched && ctrl.hasError(error));
  }

  isFieldInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl && ctrl.touched && ctrl.invalid);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
