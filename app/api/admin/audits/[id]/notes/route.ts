import { NextRequest, NextResponse } from 'next/server';
import { addNote, getNotesForAudit } from '@/lib/db';

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

    const note = await addNote(params.id, content);

    return NextResponse.json({ 
      success: true, 
      id: note.id 
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
    const notes = await getNotesForAudit(params.id);

    return NextResponse.json({ notes });
  } catch (error) {
    console.error('Admin notes fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    );
  }
}
