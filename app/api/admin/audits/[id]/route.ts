import { NextRequest, NextResponse } from 'next/server';
import { getAuditWithLead, updateLeadStatus, getNotesForAudit } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auditData = await getAuditWithLead(params.id);
    
    if (!auditData) {
      return NextResponse.json(
        { error: 'Audit not found' },
        { status: 404 }
      );
    }

    // Get notes for this audit
    const notes = await getNotesForAudit(params.id);

    return NextResponse.json({ audit: auditData, notes });
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
      await updateLeadStatus(params.id, status);
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
