// GET /api/districts/saved - List saved districts for authenticated user

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-utils';
import { getSavedDistricts } from '@/services/district-service';

export async function GET(request: NextRequest) {
  try {
    // Resolve authenticated user
    const user = await getCurrentUser();

    // Get saved districts
    const savedDistricts = await getSavedDistricts(user.id);

    return NextResponse.json({ items: savedDistricts }, { status: 200 });
  } catch (error: any) {
    console.error('Error in GET /api/districts/saved:', error);

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
