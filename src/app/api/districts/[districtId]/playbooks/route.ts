import { NextRequest, NextResponse } from 'next/server';
import { getPlaybookService } from '@/services/factory';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ districtId: string }> }
) {
  try {
    const { districtId } = await params;
    const service = await getPlaybookService();
    const playbooks = await service.getExistingPlaybooks(districtId);
    return NextResponse.json(playbooks);
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    const status = err.code === 'DISTRICT_NOT_FOUND' ? 404 : 500;
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status }
    );
  }
}
