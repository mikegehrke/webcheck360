import { NextRequest, NextResponse } from 'next/server';
import { createLead, getLeadByAuditId, getAllLeads } from '@/lib/db';

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
  try {
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
