import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Force dynamic rendering to avoid static generation errors
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Create client fresh each request to ensure env vars are read
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key);
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase();
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

    // Get all audits with their associated leads
    const { data: audits, error: auditsError } = await supabase
      .from('audits')
      .select('*')
      .order('created_at', { ascending: false });

    if (auditsError) {
      console.error('Error fetching audits:', auditsError);
      return NextResponse.json({ audits: [] });
    }

    // Get all leads
    const { data: leads } = await supabase
      .from('leads')
      .select('*');

    // Combine audits with their leads
    const auditsWithLeads = audits?.map(audit => {
      const lead = leads?.find(l => l.audit_id === audit.id);
      return {
        ...audit,
        lead: lead || null
      };
    }) || [];

    return NextResponse.json({ audits: auditsWithLeads });
  } catch (error) {
    console.error('Admin audits fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audits' },
      { status: 500 }
    );
  }
}
