import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import db from '@/lib/db';

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

    // Check if lead already exists for this audit
    const existingLead = db.prepare('SELECT id FROM leads WHERE audit_id = ?').get(audit_id);
    
    if (existingLead) {
      // Update existing lead
      const stmt = db.prepare(`
        UPDATE leads 
        SET name = ?, email = ?, consent = ?, updated_at = datetime('now')
        WHERE audit_id = ?
      `);
      stmt.run(name || null, email || null, consent ? 1 : 0, audit_id);
      
      return NextResponse.json({ 
        success: true, 
        id: (existingLead as { id: string }).id,
        updated: true 
      });
    }

    // Create new lead
    const leadId = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO leads (id, audit_id, name, email, consent, status)
      VALUES (?, ?, ?, ?, ?, 'new')
    `);
    stmt.run(leadId, audit_id, name || null, email || null, consent ? 1 : 0);

    return NextResponse.json({ 
      success: true, 
      id: leadId,
      created: true 
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
      const lead = db.prepare('SELECT * FROM leads WHERE audit_id = ?').get(auditId);
      return NextResponse.json({ lead });
    }

    const leads = db.prepare(`
      SELECT l.*, a.url, a.domain, a.score_total
      FROM leads l
      JOIN audits a ON l.audit_id = a.id
      ORDER BY l.created_at DESC
      LIMIT 100
    `).all();

    return NextResponse.json({ leads });
  } catch (error) {
    console.error('Lead fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}
