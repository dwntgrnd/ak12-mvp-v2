// GET /api/playbooks/[playbookId] - Get playbook detail
// DELETE /api/playbooks/[playbookId] - Delete playbook

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-utils';
import * as playbookService from '@/services/playbook-service';

type RouteParams = {
  params: Promise<{ playbookId: string }>;
};

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Authenticate user
    const user = await getCurrentUser();

    // Extract params
    const { playbookId } = await params;

    // Get playbook
    const playbook = await playbookService.getPlaybook(user.id, playbookId);

    return NextResponse.json(playbook, { status: 200 });
  } catch (error: any) {
    console.error('Error in GET /api/playbooks/[playbookId]:', error);

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

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Authenticate user
    const user = await getCurrentUser();

    // Extract params
    const { playbookId } = await params;

    // Delete playbook
    await playbookService.deletePlaybook(user.id, playbookId);

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error('Error in DELETE /api/playbooks/[playbookId]:', error);

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

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
