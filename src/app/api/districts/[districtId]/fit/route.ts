// GET /api/districts/[districtId]/fit - Fit assessment endpoint

import { NextRequest, NextResponse } from 'next/server';
import { getDistrictFitAssessment } from '@/services/district-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ districtId: string }> }
) {
  try {
    const { districtId } = await params;
    const searchParams = request.nextUrl.searchParams;

    // Parse productIds (comma-separated)
    const productIdsParam = searchParams.get('productIds');
    if (!productIdsParam) {
      return NextResponse.json(
        { error: 'productIds query parameter required' },
        { status: 400 }
      );
    }

    const productIds = productIdsParam.split(',').map(id => id.trim());

    const fitAssessment = await getDistrictFitAssessment(districtId, productIds);

    return NextResponse.json(fitAssessment, { status: 200 });
  } catch (error: any) {
    console.error('Error in GET /api/districts/[districtId]/fit:', error);

    if (error.code === 'DISTRICT_NOT_FOUND') {
      return NextResponse.json(
        { error: 'District not found' },
        { status: 404 }
      );
    }

    if (error.code === 'PRODUCT_NOT_FOUND') {
      return NextResponse.json(
        { error: 'No matching products found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
