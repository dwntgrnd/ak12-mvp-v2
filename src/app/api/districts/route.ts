// GET /api/districts - District search endpoint

import { NextRequest, NextResponse } from 'next/server';
import { searchDistricts } from '@/services/district-service';
import type { DistrictSearchRequest } from '@/services/types/district';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse query parameters
    const searchQuery = searchParams.get('q') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = Math.min(
      parseInt(searchParams.get('pageSize') || '25', 10),
      100
    );

    // Parse filters
    const filters: Record<string, string | number | string[]> = {};

    // County filter (comma-separated)
    const countyParam = searchParams.get('county');
    if (countyParam) {
      filters.county = countyParam.split(',').map(c => c.trim());
    }

    // Enrollment filters
    const enrollmentMin = searchParams.get('enrollmentMin');
    if (enrollmentMin) {
      filters.enrollmentMin = parseInt(enrollmentMin, 10);
    }

    const enrollmentMax = searchParams.get('enrollmentMax');
    if (enrollmentMax) {
      filters.enrollmentMax = parseInt(enrollmentMax, 10);
    }

    // Build request
    const searchRequest: DistrictSearchRequest = {
      searchQuery,
      filters,
      page,
      pageSize
    };

    // Execute search
    const result = await searchDistricts(searchRequest);

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Error in GET /api/districts:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
