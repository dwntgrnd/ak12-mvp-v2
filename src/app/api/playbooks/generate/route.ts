import { NextRequest, NextResponse } from 'next/server';
import { getPlaybookService } from '@/services/factory';

export async function POST(request: NextRequest) {
  try {
    const service = await getPlaybookService();
    const body = await request.json();

    if (!body.districtId || !body.productIds || !Array.isArray(body.productIds)) {
      return NextResponse.json(
        { error: 'districtId and productIds are required' },
        { status: 400 }
      );
    }

    const result = await service.generatePlaybook({
      districtId: body.districtId,
      productIds: body.productIds,
    });
    return NextResponse.json(result, { status: 201 });
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    const status =
      err.code === 'DISTRICT_NOT_FOUND' || err.code === 'PRODUCT_NOT_FOUND' ? 404 :
      err.code === 'GENERATION_LIMIT_REACHED' ? 429 : 500;
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status }
    );
  }
}
