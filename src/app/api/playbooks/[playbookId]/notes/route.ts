import { NextRequest, NextResponse } from 'next/server';
import { getPlaybookService } from '@/services/factory';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ playbookId: string }> }
) {
  try {
    const { playbookId } = await params;
    const body = await request.json();
    const service = await getPlaybookService();
    const note = await service.addNote(playbookId, body.content);
    return NextResponse.json(note, { status: 201 });
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    const status = err.code === 'PLAYBOOK_NOT_FOUND' ? 404 : 500;
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status }
    );
  }
}
