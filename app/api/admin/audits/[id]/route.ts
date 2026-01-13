import { NextRequest, NextResponse } from 'next/server';
import { getAudit, getLeadByAuditId, supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const audit = await getAudit(params.id);
    
    if (!audit) {
      return NextResponse.json(
        { error: 'Audit not found' },
        { status: 404 }
      );
    }

    // Get associated lead if exists
    const lead = await getLeadByAuditId(params.id);

    // Get notes for this audit
    const { data: notes } = await supabase
      .from('notes')
      .select('*')
      .eq('audit_id', params.id)
      .order('created_at', { ascending: false });

    // Build scores object from separate fields
    const scores = {
      performance: audit.score_performance || 0,
      mobile_ux: audit.score_mobile_ux || 0,
      seo: audit.score_seo || 0,
      trust: audit.score_trust || 0,
      conversion: audit.score_conversion || 0,
    };

    // Build screenshots object
    const screenshots = {
      desktop: audit.screenshot_desktop || null,
      mobile: audit.screenshot_mobile || null,
    };

    return NextResponse.json({ 
      audit: {
        ...audit,
        scores,
        screenshots,
        lead: lead || null
      }, 
      notes: notes || [] 
    });
  } catch (error) {
    console.error('Admin audit fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audit' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status } = body;

    if (status) {
      // Update lead status
      const { error } = await supabase
        .from('leads')
        .update({ status })
        .eq('audit_id', params.id);
      
      if (error) {
        console.error('Error updating lead status:', error);
        return NextResponse.json(
          { error: 'Failed to update status' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin audit update error:', error);
    return NextResponse.json(
      { error: 'Failed to update audit' },
      { status: 500 }
    );
  }
}
