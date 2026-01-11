import { NextRequest, NextResponse } from 'next/server';

const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV !== undefined;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { audit_id, name, email, consent } = body;

    if (!audit_id) {
      return NextResponse.json(
        { error: 'Audit ID is required' },
        { status: 400 }
      );
    }

    // On Vercel: Just return success (no persistent storage)
    if (isVercel) {
      return NextResponse.json({ 
        success: true, 
        id: `lead-${Date.now()}`
      });
    }

    const { createLead } = await import('@/lib/db');
    const lead = await createLead({
      audit_id,
      name,
      email,
      consent: consent || false
    });

    return NextResponse.json({ 
      success: true, 
      id: lead.id
    });
  } catch (error) {
    console.error('Lead creation error:', error);
    return NextResponse.json(
      { error: 'Failed to save lead' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  if (isVercel) {
    return NextResponse.json({ leads: [] });
  }

  try {
    const { getLeadByAuditId, getAllLeads } = await import('@/lib/db');
    const { searchParams } = new URL(request.url);
    const auditId = searchParams.get('audit_id');

    if (auditId) {
      const lead = await getLeadByAuditId(auditId);
      return NextResponse.json({ lead });
    }

    const leads = await getAllLeads();
    return NextResponse.json({ leads });
  } catch (error) {
    console.error('Lead fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}
