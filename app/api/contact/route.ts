import { NextRequest, NextResponse } from 'next/server';
import { createLead } from '@/lib/supabase';

const FORMSPREE_URL = 'https://formspree.io/f/mkoowolk';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, message, auditId, domain, score, locale } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    if (auditId) {
      try {
        await createLead({
          id: `lead-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          audit_id: auditId,
          name,
          email,
          phone: phone || null,
          message: message || null,
        });
        console.log('Lead created for audit:', auditId);
      } catch (dbError) {
        console.error('Database error:', dbError);
      }
    }

    const formData = {
      _replyto: email,
      _subject: `WebCheck360: Neue Anfrage fuer ${domain}`,
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
