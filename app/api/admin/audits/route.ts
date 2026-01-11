import { NextRequest, NextResponse } from 'next/server';

const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV !== undefined;

export async function GET(request: NextRequest) {
  // On Vercel: Return empty data (no persistent DB)
  if (isVercel) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'stats') {
      return NextResponse.json({ total: 0, leads: 0, avgScore: 0, today: 0 });
    }
    return NextResponse.json({ audits: [], message: 'Admin not available on Vercel deployment' });
  }

  try {
    const { getAllAudits, getAuditStats } = await import('@/lib/db');
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'stats') {
      const stats = await getAuditStats();
      return NextResponse.json(stats);
    }

    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    const audits = await getAllAudits(limit, offset);
    return NextResponse.json({ audits });
  } catch (error) {
    console.error('Admin audits fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audits' },
      { status: 500 }
    );
  }
}
