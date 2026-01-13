import { AuditIssue } from '@/lib/types';
import * as cheerio from 'cheerio';

export interface ConversionResult {
  score: number;
  issues: AuditIssue[];
  data: {
    hasCta: boolean;
    ctaCount: number;
    ctaAboveFold: boolean;
    hasContactForm: boolean;
    hasPhoneClickable: boolean;
    hasWhatsapp: boolean;
    hasChatWidget: boolean;
    hasBookingSystem: boolean;
    mobileMenuAccessible: boolean;
    hasValueProposition: boolean;
  };
}

export async function analyzeConversion(url: string): Promise<ConversionResult> {
  const result: ConversionResult = {
    score: 0,
    issues: [],
    data: {
      hasCta: false,
      ctaCount: 0,
      ctaAboveFold: false,
      hasContactForm: false,
      hasPhoneClickable: false,
      hasWhatsapp: false,
      hasChatWidget: false,
      hasBookingSystem: false,
      mobileMenuAccessible: false,
      hasValueProposition: false
    }
  };

  let scorePoints = 0;
  const maxPoints = 100;

  try {
    // Fetch HTML with fetch API (works on Vercel)
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
      },
      signal: AbortSignal.timeout(15000)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const textContent = $('body').text().toLowerCase();
    const htmlLower = html.toLowerCase();

    // CTA Detection
    const ctaPatterns = [
      /jetzt\s+(anfragen|buchen|bestellen|kaufen|kontakt|termin|testen|starten|analysieren|anrufen|loslegen)/i,
      /kostenlos\s+(anfragen|beraten|testen|starten|analysieren)/i,
      /termin\s+(vereinbaren|buchen|machen)/i,
      /(kontakt|anfrage|beratung)\s*(aufnehmen)?/i,
      /call\s+to\s+action|book\s+now|contact\s+us|get\s+started|try\s+now|start\s+now/i,
      /mehr\s+erfahren|zum\s+angebot|angebot\s+ansehen/i,
      /gratis|unverbindlich|sofort|direkt/i,
      /anrufen|schreiben|anfragen/i
    ];

    // Check buttons and links for CTAs
    // Extended selector to catch more CTA-like elements
    const buttons = $('button, a.btn, a.button, [class*="btn"], [class*="cta"], [role="button"], a[href*="funnel"], a[href*="contact"], a[href*="kontakt"], a[href*="termin"], a[href*="booking"]');
    let ctaCount = 0;
    
    buttons.each((_, el) => {
      const text = $(el).text().toLowerCase();
      const href = $(el).attr('href') || '';
      const classes = $(el).attr('class') || '';
      // Check for CTA patterns in text, href, or styling classes
      if (ctaPatterns.some(pattern => pattern.test(text)) || 
          href.includes('tel:') || 
          href.includes('mailto:') ||
          href.includes('kontakt') ||
          href.includes('contact') ||
          href.includes('termin') ||
          href.includes('booking') ||
          href.includes('funnel') ||
          href.includes('wa.me') ||
          href.includes('whatsapp') ||
          classes.includes('primary') ||
          classes.includes('cta') ||
          $(el).attr('aria-label')?.toLowerCase().includes('kontakt') ||
          $(el).attr('aria-label')?.toLowerCase().includes('anrufen') ||
          $(el).attr('aria-label')?.toLowerCase().includes('whatsapp')) {
        ctaCount++;
      }
    });

    result.data.ctaCount = ctaCount;
    result.data.hasCta = ctaCount > 0;
    
    // Assume CTA above fold if there's at least one in header or hero
    result.data.ctaAboveFold = 
      $('header, [class*="hero"], [class*="header"], nav').find('button, a.btn, [class*="btn"], [class*="cta"]').length > 0;

    // Contact Form Detection - also check for input fields outside forms
    result.data.hasContactForm = 
      $('form').filter((_, el) => {
        const formHtml = $(el).html()?.toLowerCase() || '';
        return formHtml.includes('email') || 
               formHtml.includes('name') || 
               formHtml.includes('nachricht') || 
               formHtml.includes('message') ||
               formHtml.includes('telefon') ||
               formHtml.includes('phone') ||
               formHtml.includes('url') ||
               formHtml.includes('website');
      }).length > 0 ||
      // Also check for standalone input fields that act as forms
      $('input[type="email"], input[type="tel"], input[type="url"], input[placeholder*="website" i], input[placeholder*="url" i]').length > 0;

    // Clickable Phone
    result.data.hasPhoneClickable = $('a[href^="tel:"]').length > 0;

    // WhatsApp Detection
    result.data.hasWhatsapp = 
      htmlLower.includes('whatsapp') ||
      htmlLower.includes('wa.me') ||
      $('a[href*="wa.me"], a[href*="whatsapp"]').length > 0;

    // Chat Widget Detection
    const chatPatterns = [
      /intercom|drift|zendesk|freshchat|tawk|livechat|hubspot|crisp|tidio/i,
      /chat-widget|chat-bubble|chat-button/i
    ];
    result.data.hasChatWidget = 
      chatPatterns.some(pattern => pattern.test(htmlLower)) ||
      $('[class*="chat"], [id*="chat"]').length > 0;

    // Booking System Detection
    const bookingPatterns = [
      /calendly|acuity|doctolib|treatwell|booksy|shore|timify|setmore|appointy/i,
      /online-buchung|online-termin|termine\s+buchen/i
    ];
    result.data.hasBookingSystem = 
      bookingPatterns.some(pattern => pattern.test(htmlLower)) ||
      $('iframe[src*="calendly"], iframe[src*="booking"]').length > 0;

    // Mobile Menu Detection
    result.data.mobileMenuAccessible = 
      $('[class*="mobile-menu"], [class*="hamburger"], [class*="menu-toggle"], [class*="burger"], button[aria-label*="menu" i], [class*="nav-toggle"]').length > 0 ||
      $('nav').length > 0;

    // Value Proposition Detection
    const valuePatterns = [
      /jahre\s+erfahrung|\d+\s*\+?\s*jahre/i,
      /zufriedene\s+kunden|\d+\s*\+?\s*kunden/i,
      /kostenlos|gratis|unverbindlich/i,
      /qualität|meister|zertifiziert|ausgezeichnet/i
    ];
    result.data.hasValueProposition = valuePatterns.some(pattern => pattern.test(textContent));

    // Scoring
    if (result.data.hasCta) {
      if (result.data.ctaCount >= 3) {
        scorePoints += 20;
      } else {
        scorePoints += 10;
        result.issues.push({
          id: 'conversion-few-ctas',
          category: 'conversion',
          severity: 'warning',
          title: 'Wenige Call-to-Actions',
          description: `Ihre Seite hat nur ${result.data.ctaCount} erkennbare CTAs.`,
          impact: 'Mehr strategisch platzierte CTAs können die Conversion-Rate erhöhen.',
          recommendation: 'Fügen Sie CTAs am Seitenende, nach wichtigen Abschnitten und im Header hinzu.'
        });
      }
    } else {
      result.issues.push({
        id: 'conversion-no-cta',
        category: 'conversion',
        severity: 'critical',
        title: 'Keine Call-to-Action erkannt',
        description: 'Wir konnten keine klaren Handlungsaufforderungen auf Ihrer Seite finden.',
        impact: 'Ohne CTAs wissen Besucher nicht, was sie tun sollen.',
        recommendation: 'Fügen Sie klare CTAs wie "Jetzt anfragen" oder "Termin buchen" hinzu.'
      });
    }

    if (result.data.ctaAboveFold) {
      scorePoints += 15;
    } else {
      result.issues.push({
        id: 'conversion-cta-below-fold',
        category: 'conversion',
        severity: 'high',
        title: 'Kein CTA im sichtbaren Bereich',
        description: 'Im oberen Bereich Ihrer Seite ist kein CTA sichtbar.',
        impact: 'Besucher sollten sofort eine Handlungsmöglichkeit sehen.',
        recommendation: 'Platzieren Sie einen prominenten CTA im Hero-Bereich oder Header.'
      });
    }

    if (result.data.hasContactForm) {
      scorePoints += 15;
    } else {
      result.issues.push({
        id: 'conversion-no-form',
        category: 'conversion',
        severity: 'high',
        title: 'Kein Kontaktformular gefunden',
        description: 'Ihre Seite scheint kein Kontaktformular zu haben.',
        impact: 'Formulare sind der einfachste Weg für Kunden, Kontakt aufzunehmen.',
        recommendation: 'Fügen Sie ein einfaches Kontaktformular auf der Startseite oder Kontaktseite hinzu.'
      });
    }

    if (result.data.hasPhoneClickable) {
      scorePoints += 15;
    } else {
      result.issues.push({
        id: 'conversion-phone-not-clickable',
        category: 'conversion',
        severity: 'high',
        title: 'Telefonnummer nicht klickbar',
        description: 'Die Telefonnummer ist nicht als klickbarer Link formatiert.',
        impact: 'Mobile Nutzer können nicht direkt anrufen.',
        recommendation: 'Formatieren Sie Telefonnummern als tel:-Links für direkte Anrufe.'
      });
    }

    if (result.data.hasWhatsapp || result.data.hasChatWidget) {
      scorePoints += 10;
    } else {
      result.issues.push({
        id: 'conversion-no-instant-contact',
        category: 'conversion',
        severity: 'warning',
        title: 'Keine Sofort-Kontaktmöglichkeit',
        description: 'Ihre Seite hat kein WhatsApp oder Chat-Widget.',
        impact: 'Viele Kunden bevorzugen schnelle Kommunikationswege.',
        recommendation: 'Integrieren Sie einen WhatsApp-Button oder ein Chat-Widget.'
      });
    }

    if (result.data.hasBookingSystem) {
      scorePoints += 10;
    }

    if (result.data.mobileMenuAccessible) {
      scorePoints += 10;
    } else {
      result.issues.push({
        id: 'conversion-no-mobile-menu',
        category: 'conversion',
        severity: 'high',
        title: 'Keine mobile Navigation erkannt',
        description: 'Wir konnten keine mobile Navigation (Hamburger-Menü) finden.',
        impact: 'Mobile Nutzer können nicht durch Ihre Seite navigieren.',
        recommendation: 'Stellen Sie sicher, dass ein mobiles Menü vorhanden ist.'
      });
    }

    if (result.data.hasValueProposition) {
      scorePoints += 5;
    } else {
      result.issues.push({
        id: 'conversion-no-value-proposition',
        category: 'conversion',
        severity: 'warning',
        title: 'Keine klaren Argumente erkennbar',
        description: 'Wir konnten keine klaren Verkaufsargumente auf Ihrer Seite finden.',
        impact: 'Besucher verstehen nicht sofort, warum sie Sie wählen sollten.',
        recommendation: 'Zeigen Sie Erfahrung, Qualifikationen und Kundenzahlen prominent an.'
      });
    }

    result.score = Math.round((scorePoints / maxPoints) * 100);

  } catch (error) {
    console.error('Conversion analysis error:', error);
    result.score = 50;
    result.issues.push({
      id: 'conversion-analysis-error',
      category: 'conversion',
      severity: 'warning',
      title: 'Conversion-Analyse unvollständig',
      description: 'Die Conversion-Analyse konnte nicht vollständig durchgeführt werden.',
      impact: 'Einige Conversion-Faktoren konnten nicht geprüft werden.',
      recommendation: 'Versuchen Sie es später erneut.'
    });
  }

  return result;
}
