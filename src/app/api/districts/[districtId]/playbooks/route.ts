// GET /api/districts/[districtId]/playbooks - Get existing playbooks for district

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-utils';
import * as playbookService from '@/services/playbook-service';

type RouteParams = {
  params: Promise<{ districtId: string }>;
};

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Authenticate user
    const user = await getCurrentUser();

    // Extract params
    const { districtId } = await params;

    // Get existing playbooks for district
    const playbooks = await playbookService.getExistingPlaybooks(
      user.id,
      districtId
    );

    return NextResponse.json({ playbooks }, { status: 200 });
  } catch (error: any) {
    console.error('Error in GET /api/districts/[districtId]/playbooks:', error);

    if (error.code === 'UNAUTHENTICATED' || error.code === 'USER_NOT_FOUND') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (error.code === 'DISTRICT_NOT_FOUND') {
      return NextResponse.json(
        { error: 'District not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
