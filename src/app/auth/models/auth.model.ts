// Supported user roles
export type UserRole = 'admin' | 'student';

// Credentials submitted on the login form
export interface LoginCredentials {
  email: string;
  password: string;
}

// Authenticated user stored in session
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Result returned from a login attempt
export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  token?: string;
  error?: string;
}
