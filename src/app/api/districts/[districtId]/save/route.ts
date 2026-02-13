import { NextRequest, NextResponse } from 'next/server';
import { getDistrictService } from '@/services/factory';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ districtId: string }> }
) {
  try {
    const { districtId } = await params;
    const service = await getDistrictService();
    const saved = await service.saveDistrict(districtId);
    return NextResponse.json(saved);
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    const status = err.code === 'DISTRICT_NOT_FOUND' ? 404 : 500;
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ districtId: string }> }
) {
  try {
    const { districtId } = await params;
    const service = await getDistrictService();
    await service.removeSavedDistrict(districtId);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    const status = err.code === 'NOT_SAVED' ? 404 : 500;
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status }
    );
  }
}
