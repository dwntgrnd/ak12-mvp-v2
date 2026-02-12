// PATCH /api/users/[userId]/reactivate - Reactivate user endpoint (admin only)

import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-utils';
import * as userService from '@/services/user-service';

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    // Extract userId from route params (Next.js 15 pattern)
    const { userId } = await params;

    // Authenticate user
    const user = await getCurrentUser();

    // Check admin role
    if (user.role !== 'publisher-admin' && user.role !== 'super-admin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Reactivate user
    const updatedUser = await userService.reactivateUser(user.tenantId, userId);

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error: any) {
    console.error('Error in PATCH /api/users/[userId]/reactivate:', error);

    if (error.code === 'USER_NOT_FOUND') {
      return NextResponse.json(
        { error: error.message || 'User not found' },
        { status: 404 }
      );
    }

    if (error.code === 'USER_NOT_DEACTIVATED') {
      return NextResponse.json(
        { error: error.message || 'User is not deactivated' },
        { status: 400 }
      );
    }

    if (error.code === 'UNAUTHENTICATED' || error.code === 'USER_NOT_FOUND') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
