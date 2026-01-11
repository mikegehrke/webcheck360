import { NextRequest, NextResponse } from 'next/server';
import { getAllAudits, supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'stats') {
      const { data: audits, error } = await supabase
        .from('audits')
        .select('score_total, created_at');
      
      if (error) {
        console.error('Stats error:', error);
        return NextResponse.json({ total: 0, leads: 0, avgScore: 0, today: 0 });
      }

      const { count: leadCount } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true });

      const today = new Date().toISOString().split('T')[0];
      const todayAudits = audits?.filter(a => a.created_at?.startsWith(today)) || [];
      const avgScore = audits?.length 
        ? Math.round(audits.reduce((sum, a) => sum + (a.score_total || 0), 0) / audits.length)
        : 0;

      return NextResponse.json({ 
        total: audits?.length || 0, 
        leads: leadCount || 0, 
        avgScore, 
        today: todayAudits.length 
      });
    }

    const audits = await getAllAudits();
    return NextResponse.json({ audits });
  } catch (error) {
    console.error('Admin audits fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audits' },
      { status: 500 }
    );
  }
}
