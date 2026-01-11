import { NextRequest, NextResponse } from 'next/server';

const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV !== undefined;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (isVercel) {
    return NextResponse.json({ 
      error: 'Admin not available on Vercel deployment',
      audit: null 
    }, { status: 404 });
  }

  try {
    const { getAuditWithLead, getNotesForAudit } = await import('@/lib/db');
    const auditData = await getAuditWithLead(params.id);
    
    if (!auditData) {
      return NextResponse.json(
        { error: 'Audit not found' },
        { status: 404 }
      );
    }

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
  if (isVercel) {
    return NextResponse.json({ error: 'Admin not available on Vercel' }, { status: 403 });
  }

  try {
    const { updateLeadStatus } = await import('@/lib/db');
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
