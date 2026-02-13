import { NextResponse } from 'next/server';
import { getConfigService } from '@/services/factory';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const service = await getConfigService();
    const values = await service.getControlledVocabulary(name);
    return NextResponse.json(values);
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    const status = err.code === 'VOCABULARY_NOT_FOUND' ? 404 : 500;
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status }
    );
  }
}
