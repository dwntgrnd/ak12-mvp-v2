import { NextResponse } from 'next/server';
import { MOCK_DISTRICTS } from '@/services/providers/mock/fixtures/districts';
import { buildSnapshot } from '@/services/providers/mock/snapshot-builder';
import type { DistrictSnapshot } from '@/services/types/district';

/**
 * GET /api/districts/browse
 * Returns all district snapshots for the browse directory page.
 */
export async function GET() {
  try {
    const snapshots: DistrictSnapshot[] = MOCK_DISTRICTS.map((d) => buildSnapshot(d));
    // Sort alphabetically by name as default
    snapshots.sort((a, b) => a.name.localeCompare(b.name));
    return NextResponse.json({ items: snapshots, totalCount: snapshots.length });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 },
    );
  }
}
