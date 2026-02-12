// GET /api/users - List users endpoint (admin only)

import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-utils';
import * as userService from '@/services/user-service';

export async function GET() {
  try {
    // Authenticate user
    const user = await getCurrentUser();

    // Check admin role
    if (user.role !== 'publisher-admin' && user.role !== 'super-admin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Get users for tenant
    const users = await userService.getUsers(user.tenantId);

    return NextResponse.json({ users }, { status: 200 });
  } catch (error: any) {
    console.error('Error in GET /api/users:', error);

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
