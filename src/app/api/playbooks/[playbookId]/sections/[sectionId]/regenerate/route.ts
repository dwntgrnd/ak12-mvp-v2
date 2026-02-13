import { NextRequest, NextResponse } from 'next/server';
import { getPlaybookService } from '@/services/factory';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ playbookId: string; sectionId: string }> }
) {
  try {
    const { playbookId, sectionId } = await params;
    const service = await getPlaybookService();
    const result = await service.regenerateSection(playbookId, sectionId);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    const status =
      err.code === 'PLAYBOOK_NOT_FOUND' || err.code === 'SECTION_NOT_FOUND' ? 404 :
      err.code === 'NOT_REGENERABLE' ? 400 : 500;
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status }
    );
  }
}
