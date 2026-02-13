import { NextRequest, NextResponse } from 'next/server';
import { getDistrictYearData } from '@/services/providers/mock/fixtures/districts';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ districtId: string }> }
) {
  const { districtId } = await params;
  const years = getDistrictYearData(districtId);
  if (years.length === 0) {
    return NextResponse.json(
      { error: `No year data found for district ${districtId}` },
      { status: 404 }
    );
  }
  return NextResponse.json(years);
}
