import { NextResponse } from 'next/server';
import { getDistrictService } from '@/services/factory';

export async function GET() {
  try {
    const service = await getDistrictService();
    const result = await service.getSavedDistricts();
    return NextResponse.json(result);
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
