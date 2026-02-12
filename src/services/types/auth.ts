// AuthService domain types

import type { UserRole } from './common';

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthSession {
  token: string;
  expiresAt: string;       // ISO 8601
  user: UserProfile;
}

export interface UserProfile {
  userId: string;
  tenantId: string;
  userRole: UserRole;
  displayName: string;
  email: string;
  organizationName: string;
}
