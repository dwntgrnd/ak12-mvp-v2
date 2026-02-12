// GET /api/playbooks/[playbookId]/sections/[sectionId] - Get section detail
// PATCH /api/playbooks/[playbookId]/sections/[sectionId] - Edit section content

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-utils';
import * as playbookService from '@/services/playbook-service';

type RouteParams = {
  params: Promise<{ playbookId: string; sectionId: string }>;
};

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Authenticate user
    const user = await getCurrentUser();

    // Extract params
    const { playbookId, sectionId } = await params;

    // Get section
    const section = await playbookService.getPlaybookSection(
      user.id,
      playbookId,
      sectionId
    );

    return NextResponse.json(section, { status: 200 });
  } catch (error: any) {
    console.error('Error in GET /api/playbooks/[playbookId]/sections/[sectionId]:', error);

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

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Authenticate user
    const user = await getCurrentUser();

    // Extract params
    const { playbookId, sectionId } = await params;

    // Parse body
    const body = await request.json();

    // Update section
    const section = await playbookService.updatePlaybookSection(
      user.id,
      playbookId,
      sectionId,
      body.content
    );

    return NextResponse.json(section, { status: 200 });
  } catch (error: any) {
    console.error('Error in PATCH /api/playbooks/[playbookId]/sections/[sectionId]:', error);

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

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
