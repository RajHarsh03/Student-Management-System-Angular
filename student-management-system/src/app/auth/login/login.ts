import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';

type PageMode = 'student-login' | 'admin-login' | 'signup';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  mode: PageMode = 'student-login';
  errorMessage: string = '';
  successMessage: string = '';
  showPassword: boolean = false;
  showSignupPassword: boolean = false;

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  signupForm = new FormGroup({
    name:     new FormControl('', [Validators.required, Validators.minLength(2)]),
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email:    new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  get username() { return this.loginForm.get('username')!; }
  get password() { return this.loginForm.get('password')!; }
  get sName()    { return this.signupForm.get('name')!; }
  get sUsername(){ return this.signupForm.get('username')!; }
  get sEmail()   { return this.signupForm.get('email')!; }
  get sPassword(){ return this.signupForm.get('password')!; }

  get isStudentLogin() { return this.mode === 'student-login'; }
  get isAdminLogin()   { return this.mode === 'admin-login'; }
  get isSignup()       { return this.mode === 'signup'; }

  setMode(m: PageMode): void {
    this.mode = m;
    this.errorMessage = '';
    this.successMessage = '';
    this.showPassword = false;
    this.showSignupPassword = false;
    this.loginForm.reset();
    this.signupForm.reset();
  }

  togglePassword(): void      { this.showPassword = !this.showPassword; }
  toggleSignupPassword(): void { this.showSignupPassword = !this.showSignupPassword; }

  onSubmit(): void {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) return;

    const username = this.username.value!;
    const password = this.password.value!;
    const expectedRole = this.isAdminLogin ? 'admin' : 'student';

    // First try hardcoded users (admin + demo student)
    const success = this.authService.login(username, password);

    if (success) {
      const role = this.authService.getRole();

      if (role !== expectedRole) {
        this.authService.logout();
        this.errorMessage = this.isAdminLogin
          ? 'Access denied. Use admin credentials here.'
          : 'Access denied. Use student credentials here.';
        return;
      }

      this.router.navigate([role === 'admin' ? '/admin-dashboard' : '/student-dashboard']);
      return;
    }

    // Hardcoded login failed — try dynamic students from API (student mode only)
    if (!this.isAdminLogin) {
      this.http.get<any[]>('http://localhost:3000/students').subscribe({
        next: students => {
          const match = students.find(
            s => s.username === username && s.password === password
          );

          if (match) {
            this.authService.loginDynamic(match.username, match.name, 'student');
            this.router.navigate(['/student-dashboard']);
          } else {
            this.errorMessage = 'Invalid username or password';
          }
        },
        error: () => {
          this.errorMessage = 'Could not connect to server. Please try again.';
        }
      });
    } else {
      this.errorMessage = 'Invalid username or password';
    }
  }

  onSignup(): void {
    this.signupForm.markAllAsTouched();
    if (this.signupForm.invalid) return;

    const { name, username, email, password } = this.signupForm.value;

    this.http.get<any[]>('http://localhost:3000/students').subscribe({
      next: students => {
        const duplicate = students.find(
          s => s.username === username || s.email === email
        );

        if (duplicate) {
          this.errorMessage = 'Username or email already exists.';
          return;
        }

        const maxId = students.reduce((max, s) => {
          const n = parseInt(s.id, 10);
          return !isNaN(n) && n > max ? n : max;
        }, 0);

        const newStudent = {
          id: String(maxId + 1),
          name,
          username,
          email,
          password,
          age: 0,
          course: 'Not assigned'
        };

        this.http.post('http://localhost:3000/students', newStudent).subscribe({
          next: () => {
            this.successMessage = 'Account created! You can now log in as a student.';
            this.errorMessage = '';
            setTimeout(() => this.setMode('student-login'), 2000);
          },
          error: () => {
            this.errorMessage = 'Signup failed. Please try again.';
          }
        });
      },
      error: () => {
        this.errorMessage = 'Could not connect to server.';
      }
    });
  }
}
