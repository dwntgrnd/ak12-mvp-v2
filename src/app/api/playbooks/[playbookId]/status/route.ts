// GET /api/playbooks/[playbookId]/status - Get generation status

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

    // Get status
    const status = await playbookService.getPlaybookStatus(user.id, playbookId);

    return NextResponse.json(status, { status: 200 });
  } catch (error: any) {
    console.error('Error in GET /api/playbooks/[playbookId]/status:', error);

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
