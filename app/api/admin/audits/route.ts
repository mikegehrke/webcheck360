import { NextRequest, NextResponse } from 'next/server';
import { getAllAudits, getAuditStats } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
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
