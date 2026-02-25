import { NextRequest, NextResponse } from 'next/server';
import { getPlaybookService } from '@/services/factory';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ playbookId: string }> }
) {
  try {
    const { playbookId } = await params;
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert File to base64 data URL
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    const service = await getPlaybookService();
    const attachment = await service.addAttachment(playbookId, {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      dataUrl,
    });
    return NextResponse.json(attachment, { status: 201 });
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    const status = err.code === 'PLAYBOOK_NOT_FOUND' ? 404 : 500;
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status }
    );
  }
}
