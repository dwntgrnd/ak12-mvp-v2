// GET /api/districts/[districtId] - District detail endpoint

import { NextRequest, NextResponse } from 'next/server';
import { getDistrict } from '@/services/district-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ districtId: string }> }
) {
  try {
    const { districtId } = await params;

    const district = await getDistrict(districtId);

    return NextResponse.json(district, { status: 200 });
  } catch (error: any) {
    console.error('Error in GET /api/districts/[districtId]:', error);

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
