import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  const timestamp = new Date().toISOString();
  let dbStatus: 'ok' | 'down' = 'down';
  let dbLatencyMs: number | null = null;

  try {
    const start = Date.now();
    await prisma.$queryRaw(Prisma.sql`SELECT 1`);
    dbLatencyMs = Date.now() - start;
    dbStatus = 'ok';
  } catch {
    dbStatus = 'down';
  }

  const overallStatus = dbStatus === 'ok' ? 'ok' : 'degraded';

  return NextResponse.json(
    {
      status: overallStatus,
      timestamp,
      version: '0.2.0',
      checks: {
        database: {
          status: dbStatus,
          latencyMs: dbLatencyMs,
        },
      },
    },
    { status: overallStatus === 'ok' ? 200 : 503 }
  );
}
