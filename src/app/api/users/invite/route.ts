// POST /api/users/invite - Invite user endpoint (admin only)

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-utils';
import * as userService from '@/services/user-service';
import type { InviteUserRequest } from '@/services/types/user';

export async function POST(request: NextRequest) {
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

    // Parse request body
    const body = await request.json() as InviteUserRequest;

    // Validate required fields
    if (!body.email || typeof body.email !== 'string' || body.email.trim() === '') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!body.displayName || typeof body.displayName !== 'string' || body.displayName.trim() === '') {
      return NextResponse.json(
        { error: 'Display name is required' },
        { status: 400 }
      );
    }

    if (!body.role || (body.role !== 'publisher-admin' && body.role !== 'publisher-rep')) {
      return NextResponse.json(
        { error: 'Role must be publisher-admin or publisher-rep' },
        { status: 400 }
      );
    }

    // Invite user
    const newUser = await userService.inviteUser(user.tenantId, user.id, body);

    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST /api/users/invite:', error);

    if (error.code === 'DUPLICATE_EMAIL') {
      return NextResponse.json(
        { error: error.message || 'Email already in use' },
        { status: 409 }
      );
    }

    if (error.code === 'INVALID_EMAIL') {
      return NextResponse.json(
        { error: error.message || 'Invalid email address' },
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
