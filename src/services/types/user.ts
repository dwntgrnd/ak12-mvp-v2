// UserService domain types

export interface TenantUser {
  userId: string;
  email: string;
  displayName: string;
  userRole: 'publisher-admin' | 'publisher-rep';
  status: 'pending' | 'active' | 'deactivated';
  invitedAt: string;        // ISO 8601
  lastActiveAt?: string;    // ISO 8601, null if never logged in
}

export interface InviteUserRequest {
  email: string;
  displayName: string;
  role: 'publisher-admin' | 'publisher-rep';
}
