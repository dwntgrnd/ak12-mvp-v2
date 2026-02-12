// POST /api/playbooks/[playbookId]/sections/[sectionId]/regenerate - Regenerate section

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-utils';
import * as playbookService from '@/services/playbook-service';

type RouteParams = {
  params: Promise<{ playbookId: string; sectionId: string }>;
};

export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Authenticate user
    const user = await getCurrentUser();

    // Extract params
    const { playbookId, sectionId } = await params;

    // Regenerate section
    const result = await playbookService.regenerateSection(
      user.id,
      playbookId,
      sectionId
    );

    return NextResponse.json(result, { status: 202 });
  } catch (error: any) {
    console.error('Error in POST /api/playbooks/[playbookId]/sections/[sectionId]/regenerate:', error);

    if (error.code === 'UNAUTHENTICATED' || error.code === 'USER_NOT_FOUND') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (error.code === 'PLAYBOOK_NOT_FOUND') {
      return NextResponse.json(
        { error: 'Playbook not found' },
        { status: 404 }
      );
    }

    if (error.code === 'SECTION_NOT_FOUND') {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      );
    }

    if (error.code === 'NOT_REGENERABLE') {
      return NextResponse.json(
        { error: 'Section cannot be regenerated' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
