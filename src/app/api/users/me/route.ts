import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-utils';

export async function GET() {
  try {
    const user = await getCurrentUser();

    // Return the user's role
    return NextResponse.json(
      { role: user.role },
      { status: 200 }
    );
  } catch (error) {
    // On auth error, return null role (don't break sidebar)
    return NextResponse.json(
      { role: null },
      { status: 200 }
    );
  }
}
