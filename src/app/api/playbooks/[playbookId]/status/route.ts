import { NextRequest, NextResponse } from 'next/server';
import { getPlaybookService } from '@/services/factory';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ playbookId: string }> }
) {
  try {
    const { playbookId } = await params;
    const service = await getPlaybookService();
    const status = await service.getPlaybookStatus(playbookId);
    return NextResponse.json(status);
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    const httpStatus = err.code === 'PLAYBOOK_NOT_FOUND' ? 404 : 500;
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: httpStatus }
    );
  }
}
