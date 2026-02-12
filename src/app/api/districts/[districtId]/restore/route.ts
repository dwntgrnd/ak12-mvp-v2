// POST /api/districts/[districtId]/restore - Restore an excluded district

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-utils';
import { restoreDistrict } from '@/services/district-service';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ districtId: string }> }
) {
  try {
    const { districtId } = await params;

    // Resolve authenticated user
    const user = await getCurrentUser();

    // Restore district
    await restoreDistrict(user.id, districtId);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Error in POST /api/districts/[districtId]/restore:', error);

    if (error.code === 'UNAUTHENTICATED' || error.code === 'USER_NOT_FOUND') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (error.code === 'NOT_EXCLUDED') {
      return NextResponse.json(
        { error: 'District is not excluded' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
