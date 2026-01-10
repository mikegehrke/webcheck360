import { chromium } from 'playwright';
import { AuditIssue } from '@/lib/types';

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

  let browser = null;
  let scorePoints = 0;
  const maxPoints = 100;

  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true
    });
    const page = await context.newPage();
    
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    const conversionData = await page.evaluate(() => {
      const html = document.documentElement.innerHTML.toLowerCase();
      const viewportHeight = window.innerHeight;

      // CTA Detection
      const ctaKeywords = ['jetzt', 'kontakt', 'termin', 'anfrage', 'buchen', 'bestellen', 
                          'kaufen', 'anrufen', 'starten', 'gratis', 'kostenlos', 'now', 
                          'contact', 'book', 'order', 'buy', 'call', 'start', 'free'];
      
      const buttons = Array.from(document.querySelectorAll('button, a.btn, a.button, [role="button"], .cta, .btn, .button'));
      const ctaButtons = buttons.filter(btn => {
        const text = btn.textContent?.toLowerCase() || '';
        return ctaKeywords.some(kw => text.includes(kw));
      });

      // Check if CTA is above fold
      let ctaAboveFold = false;
      ctaButtons.forEach(btn => {
        const rect = btn.getBoundingClientRect();
        if (rect.top < viewportHeight && rect.top > 0) {
          ctaAboveFold = true;
        }
      });

      // Contact Form
      const hasContactForm = document.querySelector('form') !== null && 
        (html.includes('kontakt') || html.includes('contact') || 
         html.includes('nachricht') || html.includes('message'));

      // Clickable Phone
      const hasPhoneClickable = document.querySelector('a[href^="tel:"]') !== null;

      // WhatsApp
      const hasWhatsapp = html.includes('whatsapp') || html.includes('wa.me');

      // Chat Widget
      const chatWidgets = ['tawk', 'intercom', 'drift', 'crisp', 'zendesk', 'livechat', 'tidio', 'hubspot'];
      const hasChatWidget = chatWidgets.some(widget => html.includes(widget));

      // Booking System
      const bookingSystems = ['calendly', 'acuity', 'timify', 'terminland', 'doctolib', 'booksy', 'treatwell', 'fresha'];
      const hasBookingSystem = bookingSystems.some(system => html.includes(system));

      // Mobile Menu
      const mobileMenu = document.querySelector('[class*="menu"], [class*="nav"], [class*="burger"], [aria-label*="menu"]');
      const mobileMenuAccessible = mobileMenu !== null;

      // Value Proposition (H1 or hero text)
      const h1 = document.querySelector('h1');
      const heroSection = document.querySelector('[class*="hero"], [class*="banner"], header');
      const hasValueProposition = (h1 !== null && (h1.textContent?.length || 0) > 10) || 
                                  (heroSection !== null && (heroSection.textContent?.length || 0) > 50);

      return {
        hasCta: ctaButtons.length > 0,
        ctaCount: ctaButtons.length,
        ctaAboveFold,
        hasContactForm,
        hasPhoneClickable,
        hasWhatsapp,
        hasChatWidget,
        hasBookingSystem,
        mobileMenuAccessible,
        hasValueProposition
      };
    });

    result.data = conversionData;

    // Scoring

    // CTA above fold (25 points)
    if (conversionData.ctaAboveFold) {
      scorePoints += 25;
    } else if (conversionData.hasCta) {
      scorePoints += 10;
      result.issues.push({
        id: 'conversion-cta-below-fold',
        category: 'conversion',
        severity: 'warning',
        title: 'CTA nicht sofort sichtbar',
        description: 'Der Haupt-Call-to-Action ist nicht im sichtbaren Bereich',
        recommendation: 'Platzieren Sie einen CTA-Button im sofort sichtbaren Bereich.'
      });
    } else {
      result.issues.push({
        id: 'conversion-no-cta',
        category: 'conversion',
        severity: 'critical',
        title: 'Kein Call-to-Action gefunden',
        description: 'Es wurde kein klarer Handlungsaufruf gefunden',
        recommendation: 'Fügen Sie auffällige CTA-Buttons hinzu (z.B. "Jetzt Termin buchen").'
      });
    }

    // Contact Form (15 points)
    if (conversionData.hasContactForm) {
      scorePoints += 15;
    } else {
      result.issues.push({
        id: 'conversion-no-form',
        category: 'conversion',
        severity: 'warning',
        title: 'Kein Kontaktformular',
        description: 'Es wurde kein Kontaktformular gefunden',
        recommendation: 'Ein Kontaktformular senkt die Hemmschwelle zur Kontaktaufnahme.'
      });
    }

    // Clickable Phone (15 points)
    if (conversionData.hasPhoneClickable) {
      scorePoints += 15;
    } else {
      result.issues.push({
        id: 'conversion-phone-not-clickable',
        category: 'conversion',
        severity: 'warning',
        title: 'Telefonnummer nicht klickbar',
        description: 'Die Telefonnummer ist nicht als tel:-Link formatiert',
        recommendation: 'Machen Sie die Telefonnummer klickbar für mobile Nutzer.'
      });
    }

    // Quick Contact Options (15 points)
    const quickContact = [conversionData.hasWhatsapp, conversionData.hasChatWidget, conversionData.hasBookingSystem]
      .filter(Boolean).length;
    
    if (quickContact >= 1) {
      scorePoints += 15;
    } else {
      result.issues.push({
        id: 'conversion-no-quick-contact',
        category: 'conversion',
        severity: 'info',
        title: 'Keine Schnellkontakt-Optionen',
        description: 'Keine modernen Kontaktoptionen wie WhatsApp, Chat oder Online-Buchung',
        recommendation: 'Erwägen Sie WhatsApp Business, einen Chat-Widget oder ein Buchungssystem.'
      });
    }

    // Mobile Navigation (15 points)
    if (conversionData.mobileMenuAccessible) {
      scorePoints += 15;
    } else {
      result.issues.push({
        id: 'conversion-mobile-nav',
        category: 'conversion',
        severity: 'warning',
        title: 'Mobile Navigation unklar',
        description: 'Die mobile Navigation ist nicht eindeutig erkennbar',
        recommendation: 'Stellen Sie sicher, dass die mobile Navigation leicht zugänglich ist.'
      });
    }

    // Value Proposition (15 points)
    if (conversionData.hasValueProposition) {
      scorePoints += 15;
    } else {
      result.issues.push({
        id: 'conversion-no-value-prop',
        category: 'conversion',
        severity: 'warning',
        title: 'Keine klare Wertaussage',
        description: 'Es fehlt eine klare Headline oder Value Proposition',
        recommendation: 'Kommunizieren Sie sofort, was Sie anbieten und warum.'
      });
    }

    result.score = Math.round((scorePoints / maxPoints) * 100);

  } catch (error) {
    console.error('Conversion analysis error:', error);
    result.issues.push({
      id: 'conversion-error',
      category: 'conversion',
      severity: 'warning',
      title: 'Conversion-Analyse unvollständig',
      description: 'Einige Conversion-Faktoren konnten nicht geprüft werden',
      recommendation: 'Überprüfen Sie die Website manuell.'
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  return result;
}
