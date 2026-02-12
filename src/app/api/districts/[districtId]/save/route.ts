// POST /api/districts/[districtId]/save - Save a district
// DELETE /api/districts/[districtId]/save - Unsave a district

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-utils';
import { saveDistrict, removeSavedDistrict } from '@/services/district-service';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ districtId: string }> }
) {
  try {
    const { districtId } = await params;

    // Resolve authenticated user
    const user = await getCurrentUser();

    // Save district
    const savedDistrict = await saveDistrict(user.id, districtId);

    return NextResponse.json(savedDistrict, { status: 200 });
  } catch (error: any) {
    console.error('Error in POST /api/districts/[districtId]/save:', error);

    if (error.code === 'UNAUTHENTICATED' || error.code === 'USER_NOT_FOUND') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (error.code === 'DISTRICT_NOT_FOUND') {
      return NextResponse.json(
        { error: 'District not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ districtId: string }> }
) {
  try {
    const { districtId } = await params;

    // Resolve authenticated user
    const user = await getCurrentUser();

    // Remove saved district
    await removeSavedDistrict(user.id, districtId);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Error in DELETE /api/districts/[districtId]/save:', error);

    if (error.code === 'UNAUTHENTICATED' || error.code === 'USER_NOT_FOUND') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (error.code === 'NOT_SAVED') {
      return NextResponse.json(
        { error: 'District is not saved' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
