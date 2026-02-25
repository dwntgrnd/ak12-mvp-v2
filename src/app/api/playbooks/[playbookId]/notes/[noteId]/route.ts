import { NextRequest, NextResponse } from 'next/server';
import { getPlaybookService } from '@/services/factory';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ playbookId: string; noteId: string }> }
) {
  try {
    const { playbookId, noteId } = await params;
    const body = await request.json();
    const service = await getPlaybookService();
    const note = await service.updateNote(playbookId, noteId, body.content);
    return NextResponse.json(note);
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    const status = err.code === 'PLAYBOOK_NOT_FOUND' || err.code === 'NOTE_NOT_FOUND' ? 404 : 500;
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ playbookId: string; noteId: string }> }
) {
  try {
    const { playbookId, noteId } = await params;
    const service = await getPlaybookService();
    await service.deleteNote(playbookId, noteId);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    const status = err.code === 'PLAYBOOK_NOT_FOUND' || err.code === 'NOTE_NOT_FOUND' ? 404 : 500;
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status }
    );
  }
}
