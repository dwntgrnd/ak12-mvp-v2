import { NextRequest, NextResponse } from 'next/server';
import { getDistrictService } from '@/services/factory';

export async function GET(request: NextRequest) {
  try {
    const service = await getDistrictService();
    const { searchParams } = new URL(request.url);

    const districtId = searchParams.get('districtId');
    const productIds = searchParams.get('productIds')?.split(',').filter(Boolean);

    if (!districtId || !productIds?.length) {
      return NextResponse.json(
        { error: 'districtId and productIds are required' },
        { status: 400 }
      );
    }

    const assessment = await service.getDistrictFitAssessment(districtId, productIds);
    return NextResponse.json(assessment);
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    const status = err.code === 'DISTRICT_NOT_FOUND' ? 404 : 500;
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status }
    );
  }
}
