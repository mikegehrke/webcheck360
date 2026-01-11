import { NextRequest, NextResponse } from 'next/server';

const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV !== undefined;

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (isVercel) {
    return NextResponse.json({ error: 'Admin not available on Vercel' }, { status: 403 });
  }

  try {
    const { addNote } = await import('@/lib/db');
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { error: 'Note content is required' },
        { status: 400 }
      );
    }

    const note = await addNote(params.id, content);
    return NextResponse.json({ success: true, id: note.id });
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
  if (isVercel) {
    return NextResponse.json({ notes: [] });
  }

  try {
    const { getNotesForAudit } = await import('@/lib/db');
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
