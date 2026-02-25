import { NextRequest, NextResponse } from 'next/server';
import { getPlaybookService } from '@/services/factory';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ playbookId: string; attachmentId: string }> }
) {
  try {
    const { playbookId, attachmentId } = await params;
    const service = await getPlaybookService();
    await service.removeAttachment(playbookId, attachmentId);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    const status = err.code === 'PLAYBOOK_NOT_FOUND' || err.code === 'ATTACHMENT_NOT_FOUND' ? 404 : 500;
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status }
    );
  }
}
