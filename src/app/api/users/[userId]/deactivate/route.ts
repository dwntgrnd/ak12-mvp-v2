// PATCH /api/users/[userId]/deactivate - Deactivate user endpoint (admin only)

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

    // Deactivate user
    const updatedUser = await userService.deactivateUser(user.tenantId, user.id, userId);

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error: any) {
    console.error('Error in PATCH /api/users/[userId]/deactivate:', error);

    if (error.code === 'USER_NOT_FOUND') {
      return NextResponse.json(
        { error: error.message || 'User not found' },
        { status: 404 }
      );
    }

    if (error.code === 'CANNOT_DEACTIVATE_SELF') {
      return NextResponse.json(
        { error: error.message || 'Cannot deactivate yourself' },
        { status: 400 }
      );
    }

    if (error.code === 'LAST_ADMIN') {
      return NextResponse.json(
        { error: error.message || 'Cannot deactivate the last admin' },
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
