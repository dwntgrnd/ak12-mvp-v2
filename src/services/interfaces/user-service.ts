// UserService interface

import type { TenantUser, InviteUserRequest } from '../types/user';

export interface IUserService {
  // Authorization: publisher-admin only
  // Errors: DUPLICATE_EMAIL, INVALID_EMAIL, INVITE_LIMIT_REACHED
  inviteUser(request: InviteUserRequest): Promise<TenantUser>;

  // Authorization: publisher-admin only
  getUsers(): Promise<TenantUser[]>;

  // Authorization: publisher-admin only
  // Errors: USER_NOT_FOUND, CANNOT_DEACTIVATE_SELF, LAST_ADMIN
  deactivateUser(userId: string): Promise<TenantUser>;

  // Authorization: publisher-admin only
  // Errors: USER_NOT_FOUND, USER_NOT_DEACTIVATED
  reactivateUser(userId: string): Promise<TenantUser>;
}
