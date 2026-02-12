// GET /api/districts/filters - Filter facets endpoint

import { NextRequest, NextResponse } from 'next/server';
import { getAvailableFilters } from '@/services/district-service';

export async function GET(request: NextRequest) {
  try {
    const filters = await getAvailableFilters();

    return NextResponse.json(filters, { status: 200 });
  } catch (error: any) {
    console.error('Error in GET /api/districts/filters:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
