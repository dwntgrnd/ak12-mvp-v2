import { NextRequest, NextResponse } from 'next/server';
import { getPlaybookService } from '@/services/factory';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ playbookId: string }> }
) {
  try {
    const { playbookId } = await params;
    const service = await getPlaybookService();
    const playbook = await service.getPlaybook(playbookId);
    return NextResponse.json(playbook);
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    const status = err.code === 'PLAYBOOK_NOT_FOUND' ? 404 : 500;
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ playbookId: string }> }
) {
  try {
    const { playbookId } = await params;
    const service = await getPlaybookService();
    await service.deletePlaybook(playbookId);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    const status = err.code === 'PLAYBOOK_NOT_FOUND' ? 404 : 500;
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status }
    );
  }
}
