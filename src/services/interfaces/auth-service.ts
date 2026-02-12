// AuthService interface

import type { AuthCredentials, AuthSession, UserProfile } from '../types/auth';

export interface IAuthService {
  // Authorization: none (pre-auth)
  // Errors: INVALID_CREDENTIALS, ACCOUNT_LOCKED, TENANT_INACTIVE
  authenticate(credentials: AuthCredentials): Promise<AuthSession>;

  // Authorization: any authenticated user
  // Errors: NOT_AUTHENTICATED
  getCurrentUser(): Promise<UserProfile>;

  // Authorization: none
  healthCheck(): Promise<{ status: 'ok' | 'degraded' | 'down'; timestamp: string }>;
}
