import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  errorMessage: string = '';
  isAdminMode: boolean = false;
  showPassword: boolean = false;

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  constructor(private authService: AuthService, private router: Router) {}

  get username() {
    return this.loginForm.get('username')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

  toggleMode(): void {
    this.isAdminMode = !this.isAdminMode;
    this.errorMessage = '';
    this.showPassword = false;
    this.loginForm.reset();
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      return;
    }

    const username = this.username.value!;
    const password = this.password.value!;
    const success = this.authService.login(username, password);

    if (success) {
      const role = this.authService.getRole();
      const expectedRole = this.isAdminMode ? 'admin' : 'student';

      if (role !== expectedRole) {
        this.authService.logout();
        this.errorMessage = this.isAdminMode
          ? 'Access denied. Use admin credentials here.'
          : 'Access denied. Use student credentials here.';
        return;
      }

      if (role === 'admin') {
        this.router.navigate(['/admin-dashboard']);
      } else {
        this.router.navigate(['/student-dashboard']);
      }
    } else {
      this.errorMessage = 'Invalid username or password';
    }
  }
}
