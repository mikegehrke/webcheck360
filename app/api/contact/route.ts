import { NextRequest, NextResponse } from 'next/server';

const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV !== undefined;

// Formspree Endpoint - kein API-Key nötig!
const FORMSPREE_URL = 'https://formspree.io/f/mkoowolk';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, message, auditId, domain, score, locale } = await request.json();

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // 1. Lead in Datenbank speichern (nur lokal)
    if (auditId && !isVercel) {
      try {
        const { createLead, addNote } = await import('@/lib/db');
        
        await createLead({
          audit_id: auditId,
          name,
          email,
          consent: true
        });

        // Notiz mit Kontaktdetails hinzufügen
        const noteContent = [
          `📧 Kontaktanfrage erhalten`,
          `Name: ${name}`,
          `Email: ${email}`,
          phone ? `Telefon: ${phone}` : null,
          message ? `Nachricht: ${message}` : null
        ].filter(Boolean).join('\n');

        await addNote(auditId, noteContent);

        console.log('Lead created for audit:', auditId);
      } catch (dbError) {
        console.error('Database error:', dbError);
        // Continue to send email even if DB fails
      }
    }

    // 2. An Formspree senden (Email) - funktioniert immer!
    const formData = {
      _replyto: email,
      _subject: `🎯 WebCheck360: Neue Anfrage für ${domain}`,
      name,
      email,
      phone: phone || 'Nicht angegeben',
      website: domain,
      score: `${score}/100`,
      message: message || 'Keine Nachricht',
      sprache: locale === 'de' ? 'Deutsch' : 'English',
    };

    const response = await fetch(FORMSPREE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Formspree error:', error);
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Nachricht erfolgreich gesendet!'
    });

  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
