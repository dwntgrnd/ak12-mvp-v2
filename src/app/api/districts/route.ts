import { NextRequest, NextResponse } from 'next/server';
import { getDistrictService } from '@/services/factory';

export async function GET(request: NextRequest) {
  try {
    const service = await getDistrictService();
    const { searchParams } = new URL(request.url);

    const searchRequest: Record<string, unknown> = {};
    if (searchParams.get('searchQuery')) searchRequest.searchQuery = searchParams.get('searchQuery');
    if (searchParams.get('exclusionStatus')) searchRequest.exclusionStatus = searchParams.get('exclusionStatus');
    searchRequest.page = Number(searchParams.get('page')) || 1;
    searchRequest.pageSize = Number(searchParams.get('pageSize')) || 25;

    const result = await service.searchDistricts(searchRequest as any);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
