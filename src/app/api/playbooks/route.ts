import { NextRequest, NextResponse } from 'next/server';
import { getPlaybookService } from '@/services/factory';

export async function GET(request: NextRequest) {
  try {
    const service = await getPlaybookService();
    const { searchParams } = new URL(request.url);

    const filters: Record<string, unknown> = {};
    if (searchParams.get('fitScoreMin')) filters.fitScoreMin = Number(searchParams.get('fitScoreMin'));
    if (searchParams.get('fitScoreMax')) filters.fitScoreMax = Number(searchParams.get('fitScoreMax'));
    if (searchParams.get('sortBy')) filters.sortBy = searchParams.get('sortBy');
    if (searchParams.get('sortOrder')) filters.sortOrder = searchParams.get('sortOrder');

    const pagination = {
      page: Number(searchParams.get('page')) || 1,
      pageSize: Number(searchParams.get('pageSize')) || 25,
    };

    const result = await service.getPlaybooks(filters as any, pagination);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
