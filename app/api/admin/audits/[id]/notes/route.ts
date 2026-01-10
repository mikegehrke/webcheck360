import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import db from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { error: 'Note content is required' },
        { status: 400 }
      );
    }

    const noteId = uuidv4();
    db.prepare(`
      INSERT INTO admin_notes (id, audit_id, content)
      VALUES (?, ?, ?)
    `).run(noteId, params.id, content);

    return NextResponse.json({ 
      success: true, 
      id: noteId 
    });
  } catch (error) {
    console.error('Admin note creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create note' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const notes = db.prepare(`
      SELECT * FROM admin_notes 
      WHERE audit_id = ? 
      ORDER BY created_at DESC
    `).all(params.id);

    return NextResponse.json({ notes });
  } catch (error) {
    console.error('Admin notes fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    );
  }
}
