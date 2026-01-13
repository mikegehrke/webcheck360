import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Check env vars
    const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const urlStart = process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) || 'not set';
    const keyStart = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) || 'not set';
    
    // Try to fetch audits
    const { data: audits, error: auditsError } = await supabase
      .from('audits')
      .select('id')
      .limit(100);
    
    const { count: leadCount } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      env: {
        hasUrl,
        hasKey,
        urlStart,
        keyStart: keyStart + '...',
      },
      database: {
        auditsCount: audits?.length || 0,
        auditsError: auditsError?.message || null,
        leadsCount: leadCount || 0,
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
