// POST /api/districts/[districtId]/exclude - Exclude a district with reason

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-utils';
import { excludeDistrict } from '@/services/district-service';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ districtId: string }> }
) {
  try {
    const { districtId } = await params;

    // Parse request body
    const body = await request.json();
    const { category, note } = body;

    // Validate category is present
    if (!category) {
      return NextResponse.json(
        { error: 'Exclusion category is required' },
        { status: 400 }
      );
    }

    // Resolve authenticated user
    const user = await getCurrentUser();

    // Exclude district
    const excludedDistrict = await excludeDistrict(user.id, districtId, {
      category,
      note
    });

    return NextResponse.json(excludedDistrict, { status: 200 });
  } catch (error: any) {
    console.error('Error in POST /api/districts/[districtId]/exclude:', error);

    if (error.code === 'UNAUTHENTICATED' || error.code === 'USER_NOT_FOUND') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (error.code === 'INVALID_CATEGORY') {
      return NextResponse.json(
        { error: 'Invalid exclusion category' },
        { status: 400 }
      );
    }

    if (error.code === 'DISTRICT_NOT_FOUND') {
      return NextResponse.json(
        { error: 'District not found' },
        { status: 404 }
      );
    }

    if (error.code === 'ALREADY_EXCLUDED') {
      return NextResponse.json(
        { error: 'District is already excluded' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
