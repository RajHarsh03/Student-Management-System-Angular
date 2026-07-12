import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private platformId = inject(PLATFORM_ID);

  private users = [
    { username: 'admin', password: 'admin123', role: 'admin', name: 'Admin User' },
    { username: 'student', password: 'student123', role: 'student', name: 'Demo Student' }
  ];

  constructor(private router: Router) {}

  login(username: string, password: string): boolean {
    const user = this.users.find(
      u => u.username === username && u.password === password
    );

    if (user && isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', 'fake-jwt-token');
      localStorage.setItem('role', user.role);
      localStorage.setItem('name', user.name);
      localStorage.setItem('username', user.username);
      return true;
    }

    return user !== undefined;
  }

  loginDynamic(username: string, name: string, role: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.setItem('token', 'fake-jwt-token');
    localStorage.setItem('role', role);
    localStorage.setItem('name', name);
    localStorage.setItem('username', username);
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('name');
      localStorage.removeItem('username');
    }
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    return localStorage.getItem('token') !== null;
  }

  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem('role');
  }

  getName(): string {
    if (!isPlatformBrowser(this.platformId)) return '';
    return localStorage.getItem('name') ?? '';
  }

  getUsername(): string {
    if (!isPlatformBrowser(this.platformId)) return '';
    return localStorage.getItem('username') ?? '';
  }
}
