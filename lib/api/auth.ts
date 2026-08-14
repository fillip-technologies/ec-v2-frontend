import { BACKEND_URL } from '@/config/api';

export interface LoginPayload {
  email: string;
  password: string;
  role?: string;
}

export interface StudentRegisterPayload {
  name: string;
  email: string;
  password: string;
  college_name: string;
}

export interface CollegeRegisterPayload {
  email: string;
  password: string;
  phoneNo?: string;
  countryId?: number;
  collegeName: string;
  address?: string;
}

export interface AuthResponse {
  accessToken?: string;
  refreshToken?: string;
  user?: any;
  message?: string;
}

/**
 * POST /auth/login
 * Authenticate user with email, password, and optional role
 */
export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const res = await fetch(`${BACKEND_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || 'Invalid email or password');
  }

  return data;
}

/**
 * POST /auth/register/student
 * Self-registration for student accounts
 */
export async function registerStudent(payload: StudentRegisterPayload): Promise<AuthResponse> {
  const res = await fetch(`${BACKEND_URL}/auth/register/student`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errorMsg = Array.isArray(data.message)
      ? data.message.join(', ')
      : data.message || 'Registration failed';
    throw new Error(errorMsg);
  }

  return data;
}

/**
 * POST /auth/register/college
 * Institutional registration for college administrators
 */
export async function registerCollege(payload: CollegeRegisterPayload): Promise<AuthResponse> {
  const res = await fetch(`${BACKEND_URL}/auth/register/college`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errorMsg = Array.isArray(data.message)
      ? data.message.join(', ')
      : data.message || 'Registration failed';
    throw new Error(errorMsg);
  }

  return data;
}

/**
 * POST /auth/logout
 * Revoke refresh token and invalidate active session
 */
export async function logout(refreshToken?: string | null): Promise<void> {
  try {
    await fetch(`${BACKEND_URL}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ refreshToken }),
    });
  } catch (e) {
    console.warn('[API logout] network error during logout request:', e);
  }
}

/**
 * POST /auth/refresh
 * Refresh active access token using valid refresh token
 */
export async function refreshSession(refreshToken: string): Promise<AuthResponse> {
  const res = await fetch(`${BACKEND_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ refreshToken }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || 'Session refresh failed');
  }

  return data;
}
