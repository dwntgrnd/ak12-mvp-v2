import { NextResponse } from 'next/server';
import { getExcludedDistricts } from '@/services/district-service';
import { getCurrentUser } from '@/lib/auth-utils';

export async function GET() {
  try {
    const user = await getCurrentUser();
    const excludedDistricts = await getExcludedDistricts(user.id);

    return NextResponse.json({ items: excludedDistricts });
  } catch (error: unknown) {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      (error.code === 'UNAUTHENTICATED' || error.code === 'USER_NOT_FOUND')
    ) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.error('Error fetching excluded districts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch excluded districts' },
      { status: 500 }
    );
  }
}
