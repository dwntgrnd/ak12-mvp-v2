import { NextRequest, NextResponse } from 'next/server';
import { getPlaybookService } from '@/services/factory';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ playbookId: string; sectionId: string }> }
) {
  try {
    const { playbookId, sectionId } = await params;
    const service = await getPlaybookService();
    const section = await service.getPlaybookSection(playbookId, sectionId);
    return NextResponse.json(section);
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    const status =
      err.code === 'PLAYBOOK_NOT_FOUND' || err.code === 'SECTION_NOT_FOUND' ? 404 : 500;
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ playbookId: string; sectionId: string }> }
) {
  try {
    const { playbookId, sectionId } = await params;
    const service = await getPlaybookService();
    const body = await request.json();

    if (!body.content || typeof body.content !== 'string') {
      return NextResponse.json(
        { error: 'content (string) is required' },
        { status: 400 }
      );
    }

    const section = await service.updatePlaybookSection(playbookId, sectionId, body.content);
    return NextResponse.json(section);
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    const status =
      err.code === 'PLAYBOOK_NOT_FOUND' || err.code === 'SECTION_NOT_FOUND' ? 404 : 500;
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status }
    );
  }
}
