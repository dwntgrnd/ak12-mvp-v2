// GET /api/playbooks - List playbooks
// POST /api/playbooks - Generate new playbook

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-utils';
import * as playbookService from '@/services/playbook-service';
import type { PlaybookFilters } from '@/services/types/playbook';

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const user = await getCurrentUser();

    const searchParams = request.nextUrl.searchParams;

    // Build filters from query params
    const filters: PlaybookFilters = {};

    const fitCategory = searchParams.get('fitCategory');
    if (fitCategory) {
      filters.fitCategory = fitCategory as any;
    }

    const sortBy = searchParams.get('sortBy');
    if (sortBy) {
      filters.sortBy = sortBy as any;
    }

    const sortOrder = searchParams.get('sortOrder');
    if (sortOrder) {
      filters.sortOrder = sortOrder as any;
    }

    // Get playbooks
    const playbooks = await playbookService.getPlaybooks(user.id, filters);

    return NextResponse.json({ playbooks }, { status: 200 });
  } catch (error: any) {
    console.error('Error in GET /api/playbooks:', error);

    if (error.code === 'UNAUTHENTICATED' || error.code === 'USER_NOT_FOUND') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const user = await getCurrentUser();

    // Parse request body
    const body = await request.json();

    // Generate playbook
    const result = await playbookService.generatePlaybook(
      user.id,
      body.districtId,
      body.productIds
    );

    return NextResponse.json(result, { status: 202 });
  } catch (error: any) {
    console.error('Error in POST /api/playbooks:', error);

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

    if (error.code === 'PRODUCT_NOT_FOUND') {
      return NextResponse.json(
        { error: 'No valid products found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
