// User service implementation

import { prisma } from '@/lib/prisma';
import type { TenantUser, InviteUserRequest } from './types/user';
import { randomUUID } from 'crypto';

/**
 * Map Prisma User to TenantUser type
 */
function mapToTenantUser(user: any): TenantUser {
  return {
    userId: user.id,
    email: user.email,
    displayName: user.displayName,
    userRole: user.role as 'publisher-admin' | 'publisher-rep',
    status: user.status as 'pending' | 'active' | 'deactivated',
    invitedAt: user.invitedAt.toISOString(),
    lastActiveAt: user.lastActiveAt?.toISOString()
  };
}

/**
 * Invite a new user to the tenant
 * Creates a User record with status 'pending' and placeholder clerkId
 */
export async function inviteUser(
  tenantId: string,
  adminUserId: string,
  request: InviteUserRequest
): Promise<TenantUser> {
  // Validate email is not already in use within the tenant
  const existingUser = await prisma.user.findFirst({
    where: {
      email: request.email,
      tenantId: tenantId
    }
  });

  if (existingUser) {
    const error: any = new Error('Email already in use within this tenant');
    error.code = 'DUPLICATE_EMAIL';
    throw error;
  }

  // Create new User record
  const newUser = await prisma.user.create({
    data: {
      email: request.email,
      displayName: request.displayName,
      role: request.role,
      tenantId: tenantId,
      status: 'pending',
      clerkId: `pending_${randomUUID()}`,
      invitedAt: new Date()
    }
  });

  return mapToTenantUser(newUser);
}

/**
 * Get all users for a tenant
 */
export async function getUsers(tenantId: string): Promise<TenantUser[]> {
  const users = await prisma.user.findMany({
    where: { tenantId },
    orderBy: { createdAt: 'desc' }
  });

  return users.map(mapToTenantUser);
}

/**
 * Deactivate a user
 * Prevents self-deactivation and last admin removal
 */
export async function deactivateUser(
  tenantId: string,
  adminUserId: string,
  targetUserId: string
): Promise<TenantUser> {
  // Find user by id AND tenantId (tenant scoping)
  const user = await prisma.user.findFirst({
    where: {
      id: targetUserId,
      tenantId: tenantId
    }
  });

  if (!user) {
    const error: any = new Error('User not found');
    error.code = 'USER_NOT_FOUND';
    throw error;
  }

  // Prevent self-deactivation
  if (targetUserId === adminUserId) {
    const error: any = new Error('Cannot deactivate yourself');
    error.code = 'CANNOT_DEACTIVATE_SELF';
    throw error;
  }

  // Check if target is the last active admin in tenant
  if (user.role === 'publisher-admin') {
    const activeAdminCount = await prisma.user.count({
      where: {
        tenantId: tenantId,
        role: 'publisher-admin',
        status: 'active'
      }
    });

    if (activeAdminCount <= 1) {
      const error: any = new Error('Cannot deactivate the last active admin');
      error.code = 'LAST_ADMIN';
      throw error;
    }
  }

  // Update user status to 'deactivated'
  const updatedUser = await prisma.user.update({
    where: { id: targetUserId },
    data: { status: 'deactivated' }
  });

  return mapToTenantUser(updatedUser);
}

/**
 * Reactivate a deactivated user
 */
export async function reactivateUser(
  tenantId: string,
  targetUserId: string
): Promise<TenantUser> {
  // Find user by id AND tenantId
  const user = await prisma.user.findFirst({
    where: {
      id: targetUserId,
      tenantId: tenantId
    }
  });

  if (!user) {
    const error: any = new Error('User not found');
    error.code = 'USER_NOT_FOUND';
    throw error;
  }

  // Check if user is deactivated
  if (user.status !== 'deactivated') {
    const error: any = new Error('User is not deactivated');
    error.code = 'USER_NOT_DEACTIVATED';
    throw error;
  }

  // Update user status to 'active'
  const updatedUser = await prisma.user.update({
    where: { id: targetUserId },
    data: { status: 'active' }
  });

  return mapToTenantUser(updatedUser);
}
