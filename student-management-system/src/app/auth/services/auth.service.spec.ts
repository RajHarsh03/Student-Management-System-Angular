import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Component } from '@angular/core';
import { AuthService } from './auth.service';

// Minimal stub component for the /login route used by logout()
@Component({ standalone: true, template: '' })
class StubComponent {}

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'login', component: StubComponent }]),
      ],
    });
    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  // ---------------------------------------------------------------------------
  // Login
  // ---------------------------------------------------------------------------

  it('should log in a valid admin user', () => {
    const result = service.login({ email: 'admin@sms.com', password: 'Admin@123' });
    expect(result.success).toBe(true);
    expect(result.user?.role).toBe('admin');
    expect(result.token).toBeDefined();
  });

  it('should log in a valid student user', () => {
    const result = service.login({ email: 'student@sms.com', password: 'Student@123' });
    expect(result.success).toBe(true);
    expect(result.user?.role).toBe('student');
  });

  it('should reject invalid credentials', () => {
    const result = service.login({ email: 'wrong@sms.com', password: 'wrongpass' });
    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('should reject correct email with wrong password', () => {
    const result = service.login({ email: 'admin@sms.com', password: 'wrongpass' });
    expect(result.success).toBe(false);
  });

  // ---------------------------------------------------------------------------
  // Authentication state
  // ---------------------------------------------------------------------------

  it('should be unauthenticated before login', () => {
    expect(service.isAuthenticated()).toBe(false);
    expect(service.getCurrentUser()).toBeNull();
  });

  it('should be authenticated after a successful login', () => {
    service.login({ email: 'admin@sms.com', password: 'Admin@123' });
    expect(service.isAuthenticated()).toBe(true);
    expect(service.getCurrentUser()).not.toBeNull();
  });

  it('should expose the active token after login', () => {
    service.login({ email: 'admin@sms.com', password: 'Admin@123' });
    expect(service.getToken()).toBeTruthy();
  });

  // ---------------------------------------------------------------------------
  // Session storage
  // ---------------------------------------------------------------------------

  it('should persist the session in sessionStorage after login', () => {
    service.login({ email: 'admin@sms.com', password: 'Admin@123' });
    expect(sessionStorage.getItem('sms_auth_token')).toBeTruthy();
    expect(sessionStorage.getItem('sms_auth_user')).toBeTruthy();
  });

  it('should clear sessionStorage on logout', () => {
    service.login({ email: 'admin@sms.com', password: 'Admin@123' });
    service.logout();
    expect(sessionStorage.getItem('sms_auth_token')).toBeNull();
    expect(sessionStorage.getItem('sms_auth_user')).toBeNull();
  });

  // ---------------------------------------------------------------------------
  // Logout
  // ---------------------------------------------------------------------------

  it('should clear the current user on logout', () => {
    service.login({ email: 'admin@sms.com', password: 'Admin@123' });
    service.logout();
    expect(service.isAuthenticated()).toBe(false);
    expect(service.getCurrentUser()).toBeNull();
    expect(service.getToken()).toBeNull();
  });

  // ---------------------------------------------------------------------------
  // Role checking
  // ---------------------------------------------------------------------------

  it('should return true for the correct role', () => {
    service.login({ email: 'admin@sms.com', password: 'Admin@123' });
    expect(service.hasRole('admin')).toBe(true);
  });

  it('should return false for an incorrect role', () => {
    service.login({ email: 'student@sms.com', password: 'Student@123' });
    expect(service.hasRole('admin')).toBe(false);
  });

  it('should accept multiple role arguments', () => {
    service.login({ email: 'admin@sms.com', password: 'Admin@123' });
    expect(service.hasRole('admin', 'student')).toBe(true);
  });

  // ---------------------------------------------------------------------------
  // Session restoration
  // ---------------------------------------------------------------------------

  it('should restore a valid session from sessionStorage', () => {
    service.login({ email: 'admin@sms.com', password: 'Admin@123' });
    const token = service.getToken()!;
    const user = service.getCurrentUser()!;

    sessionStorage.setItem('sms_auth_token', token);
    sessionStorage.setItem('sms_auth_user', JSON.stringify(user));

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: 'login', component: StubComponent }])],
    });
    const freshService = TestBed.inject(AuthService);

    expect(freshService.isAuthenticated()).toBe(true);
    expect(freshService.getCurrentUser()?.email).toBe('admin@sms.com');
  });

  it('should clear an expired token on restore', () => {
    const expiredPayload = btoa(
      JSON.stringify({ sub: 'usr-001', role: 'admin', iat: 0, exp: 1 }),
    )
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    const expiredToken = `header.${expiredPayload}.sig`;
    sessionStorage.setItem('sms_auth_token', expiredToken);
    sessionStorage.setItem(
      'sms_auth_user',
      JSON.stringify({ id: 'usr-001', name: 'Admin', email: 'admin@sms.com', role: 'admin' }),
    );

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: 'login', component: StubComponent }])],
    });
    const freshService = TestBed.inject(AuthService);

    expect(freshService.isAuthenticated()).toBe(false);
    expect(sessionStorage.getItem('sms_auth_token')).toBeNull();
  });
});
