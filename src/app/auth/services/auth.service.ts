import { Injectable, PLATFORM_ID, inject, signal, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AuthUser, LoginCredentials, AuthResult, UserRole } from '../models/auth.model';

// ---------------------------------------------------------------------------
// Simulated user database
// ---------------------------------------------------------------------------
interface SimulatedUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

const SIMULATED_USERS: SimulatedUser[] = [
  {
    id: 'usr-001',
    name: 'Admin User',
    email: 'admin@sms.com',
    password: 'Admin@123',
    role: 'admin',
  },
  {
    id: 'usr-002',
    name: 'John Student',
    email: 'student@sms.com',
    password: 'Student@123',
    role: 'student',
  },
];

// ---------------------------------------------------------------------------
// sessionStorage keys
// ---------------------------------------------------------------------------
const SESSION_TOKEN_KEY = 'sms_auth_token';
const SESSION_USER_KEY = 'sms_auth_user';

// Token TTL: 8 hours in milliseconds
const TOKEN_TTL_MS = 8 * 60 * 60 * 1000;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);

  // Reactive state signals
  private readonly _currentUser = signal<AuthUser | null>(null);
  private readonly _token = signal<string | null>(null);

  // Public read-only computed values
  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this._currentUser() !== null);

  constructor() {
    this.restoreSession();
  }

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  /**
   * Validate credentials against the simulated user database.
   * On success, generate a fake JWT, persist the session, and return an AuthResult.
   */
  login(credentials: LoginCredentials): AuthResult {
    const match = SIMULATED_USERS.find(
      (u) =>
        u.email.toLowerCase() === credentials.email.toLowerCase() &&
        u.password === credentials.password,
    );

    if (!match) {
      return { success: false, error: 'Invalid email or password.' };
    }

    const user: AuthUser = {
      id: match.id,
      name: match.name,
      email: match.email,
      role: match.role,
    };

    const token = this.generateToken(user);

    this._currentUser.set(user);
    this._token.set(token);
    this.persistSession(user, token);

    return { success: true, user, token };
  }

  /** Clear session state and navigate to /login. */
  logout(): void {
    this._currentUser.set(null);
    this._token.set(null);
    this.clearSession();
    this.router.navigate(['/login']);
  }

  /** Return the active JWT token string, or null if unauthenticated. */
  getToken(): string | null {
    return this._token();
  }

  /** Return the currently authenticated user, or null. */
  getCurrentUser(): AuthUser | null {
    return this._currentUser();
  }

  /** Check whether the current user has one of the specified roles. */
  hasRole(...roles: UserRole[]): boolean {
    const user = this._currentUser();
    return user !== null && roles.includes(user.role);
  }

  // ---------------------------------------------------------------------------
  // Token generation (fake JWT-shaped token)
  // ---------------------------------------------------------------------------

  private generateToken(user: AuthUser): string {
    const header = this.base64url({ alg: 'HS256', typ: 'JWT' });
    const now = Date.now();
    const payload = this.base64url({
      sub: user.id,
      email: user.email,
      role: user.role,
      iat: Math.floor(now / 1000),
      exp: Math.floor((now + TOKEN_TTL_MS) / 1000),
    });
    // Signature is a placeholder — this is a simulation, not a real JWT
    const signature = this.base64url({ sig: 'simulated' });
    return `${header}.${payload}.${signature}`;
  }

  private base64url(obj: object): string {
    return btoa(JSON.stringify(obj))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  // ---------------------------------------------------------------------------
  // Session persistence (sessionStorage — browser only due to SSR)
  // ---------------------------------------------------------------------------

  private persistSession(user: AuthUser, token: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    sessionStorage.setItem(SESSION_TOKEN_KEY, token);
    sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
  }

  private clearSession(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    sessionStorage.removeItem(SESSION_TOKEN_KEY);
    sessionStorage.removeItem(SESSION_USER_KEY);
  }

  /**
   * Restore the session from sessionStorage on app start.
   * Automatically clears an expired token.
   */
  private restoreSession(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const token = sessionStorage.getItem(SESSION_TOKEN_KEY);
    const userJson = sessionStorage.getItem(SESSION_USER_KEY);

    if (!token || !userJson) return;

    if (this.isTokenExpired(token)) {
      this.clearSession();
      return;
    }

    try {
      const user: AuthUser = JSON.parse(userJson);
      this._currentUser.set(user);
      this._token.set(token);
    } catch {
      // Corrupted session data — clear it
      this.clearSession();
    }
  }

  /**
   * Decode the payload section of the fake JWT and check the expiry claim.
   */
  private isTokenExpired(token: string): boolean {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return true;

      // Re-add base64 padding
      const padded = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(padded));

      if (typeof payload.exp !== 'number') return true;
      return Date.now() / 1000 > payload.exp;
    } catch {
      return true;
    }
  }
}
