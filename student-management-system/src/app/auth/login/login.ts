import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  errorMessage: string = '';

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
      if (role === 'admin') {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/dashboard']);
      }
    } else {
      this.errorMessage = 'Invalid username or password';
    }
  }
}
