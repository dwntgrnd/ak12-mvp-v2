// Auth utility for resolving Clerk session to internal User record

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

/**
 * Get the current authenticated user from Clerk session
 * Resolves Clerk userId (clerkId) to internal User record
 *
 * @throws Error with code 'UNAUTHENTICATED' if no Clerk session
 * @throws Error with code 'USER_NOT_FOUND' if Clerk user not in database
 * @returns User object with id, tenantId, and role
 */
export async function getCurrentUser(): Promise<{
  id: string;
  tenantId: string;
  role: string;
}> {
  // Get Clerk session
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    const error: any = new Error('Not authenticated');
    error.code = 'UNAUTHENTICATED';
    throw error;
  }

  // Look up internal User record by clerkId
  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: {
      id: true,
      tenantId: true,
      role: true
    }
  });

  if (!user) {
    const error: any = new Error('User not found in database');
    error.code = 'USER_NOT_FOUND';
    throw error;
  }

  return user;
}
