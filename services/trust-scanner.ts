import { AuditIssue } from '@/lib/types';
import * as cheerio from 'cheerio';

export interface TrustResult {
  score: number;
  issues: AuditIssue[];
  data: {
    hasHttps: boolean;
    hasImpressum: boolean;
    hasPrivacy: boolean;
    hasContact: boolean;
    hasPhone: boolean;
    hasEmail: boolean;
    hasAddress: boolean;
    hasSocialProof: boolean;
    hasReviews: boolean;
    hasLogos: boolean;
    hasCookieBanner: boolean;
  };
}

export async function scanTrustFactors(url: string): Promise<TrustResult> {
  const result: TrustResult = {
    score: 0,
    issues: [],
    data: {
      hasHttps: false,
      hasImpressum: false,
      hasPrivacy: false,
      hasContact: false,
      hasPhone: false,
      hasEmail: false,
      hasAddress: false,
      hasSocialProof: false,
      hasReviews: false,
      hasLogos: false,
      hasCookieBanner: false
    }
  };

  let scorePoints = 0;
  const maxPoints = 100;

  try {
    // Check HTTPS
    result.data.hasHttps = url.startsWith('https://');
    
    // Fetch HTML with fetch API (works on Vercel)
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
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

    // Check for legal pages in links
    const allLinks = $('a').map((_, el) => $(el).attr('href') || '').get().join(' ').toLowerCase();
    const allLinkTexts = $('a').map((_, el) => $(el).text()).get().join(' ').toLowerCase();

    result.data.hasImpressum = 
      allLinks.includes('impressum') || 
      allLinkTexts.includes('impressum') ||
      allLinks.includes('imprint') ||
      allLinkTexts.includes('imprint');

    result.data.hasPrivacy = 
      allLinks.includes('datenschutz') || 
      allLinks.includes('privacy') ||
      allLinkTexts.includes('datenschutz') ||
      allLinkTexts.includes('privacy');

    result.data.hasContact = 
      allLinks.includes('kontakt') || 
      allLinks.includes('contact') ||
      allLinkTexts.includes('kontakt') ||
      allLinkTexts.includes('contact');

    // Phone detection
    const phoneRegex = /(\+49|0049|0)\s*[1-9][0-9]{1,4}\s*[\/\-]?\s*[0-9]{3,}/g;
    const phoneInternational = /\+\d{1,3}[\s.-]?\(?\d{1,4}\)?[\s.-]?\d{1,4}[\s.-]?\d{1,9}/g;
    result.data.hasPhone = phoneRegex.test(textContent) || phoneInternational.test(textContent) || htmlLower.includes('tel:');

    // Email detection
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    result.data.hasEmail = emailRegex.test(textContent) || htmlLower.includes('mailto:');

    // Address detection
    const addressPatterns = [
      /\d{5}\s+[a-zäöüß]+/i, // German postal code
      /straße|strasse|str\.|weg|platz|allee|ring/i,
      /street|road|avenue|lane/i
    ];
    result.data.hasAddress = addressPatterns.some(pattern => pattern.test(textContent));

    // Social proof detection
    const socialProofPatterns = [
      /kunde|kunden|kundenstimme|referenz|partner|zertifiziert|ausgezeichnet|award/i,
      /customer|client|testimonial|partner|certified|award/i,
      /google|facebook|instagram|linkedin|xing|trustpilot|provenexpert/i
    ];
    result.data.hasSocialProof = socialProofPatterns.some(pattern => pattern.test(textContent));

    // Reviews detection
    const reviewPatterns = [
      /bewertung|rezension|sterne|★|⭐|rating|review/i,
      /google\s*bewertung|facebook\s*bewertung/i,
      /trustpilot|provenexpert|yelp|tripadvisor/i
    ];
    result.data.hasReviews = 
      reviewPatterns.some(pattern => pattern.test(textContent)) ||
      $('[class*="review"], [class*="rating"], [class*="stars"], [class*="testimonial"]').length > 0;

    // Trust logos detection
    const logoPatterns = [
      /tuev|tüv|iso|din|gütesiegel|trusted|ssl|secure/i,
      /mastercard|visa|paypal|klarna|sofort/i
    ];
    result.data.hasLogos = 
      logoPatterns.some(pattern => pattern.test(textContent)) ||
      $('[class*="trust"], [class*="badge"], [class*="seal"], [class*="partner"]').length > 0;

    // Cookie banner detection
    result.data.hasCookieBanner = 
      $('[class*="cookie"], [id*="cookie"], [class*="consent"], [id*="consent"]').length > 0 ||
      /cookie|consent|dsgvo|gdpr/i.test(htmlLower);

    // Scoring
    if (result.data.hasHttps) {
      scorePoints += 15;
    } else {
      result.issues.push({
        id: 'trust-no-https',
        category: 'trust',
        severity: 'critical',
        title: 'Keine HTTPS-Verschlüsselung',
        description: 'Ihre Website verwendet kein HTTPS.',
        impact: 'Browser zeigen Warnungen an und Google wertet HTTPS als Ranking-Faktor.',
        recommendation: 'Installieren Sie ein SSL-Zertifikat und erzwingen Sie HTTPS.'
      });
    }

    if (result.data.hasImpressum) {
      scorePoints += 15;
    } else {
      result.issues.push({
        id: 'trust-no-impressum',
        category: 'trust',
        severity: 'critical',
        title: 'Kein Impressum gefunden',
        description: 'Wir konnten keinen Impressum-Link auf Ihrer Seite finden.',
        impact: 'Ein fehlendes Impressum ist in Deutschland ein Gesetzesverstoß und zerstört Vertrauen.',
        recommendation: 'Fügen Sie ein vollständiges Impressum hinzu, das von jeder Seite erreichbar ist.'
      });
    }

    if (result.data.hasPrivacy) {
      scorePoints += 15;
    } else {
      result.issues.push({
        id: 'trust-no-privacy',
        category: 'trust',
        severity: 'critical',
        title: 'Keine Datenschutzerklärung gefunden',
        description: 'Wir konnten keine Datenschutzerklärung auf Ihrer Seite finden.',
        impact: 'Eine fehlende Datenschutzerklärung verstößt gegen die DSGVO.',
        recommendation: 'Fügen Sie eine DSGVO-konforme Datenschutzerklärung hinzu.'
      });
    }

    if (result.data.hasContact) {
      scorePoints += 10;
    } else {
      result.issues.push({
        id: 'trust-no-contact',
        category: 'trust',
        severity: 'high',
        title: 'Keine Kontaktseite gefunden',
        description: 'Wir konnten keine Kontaktseite auf Ihrer Website finden.',
        impact: 'Kunden können Sie nicht einfach erreichen.',
        recommendation: 'Erstellen Sie eine Kontaktseite mit allen Kontaktmöglichkeiten.'
      });
    }

    if (result.data.hasPhone) {
      scorePoints += 10;
    } else {
      result.issues.push({
        id: 'trust-no-phone',
        category: 'trust',
        severity: 'warning',
        title: 'Keine Telefonnummer sichtbar',
        description: 'Auf Ihrer Seite ist keine Telefonnummer sichtbar.',
        impact: 'Viele Kunden möchten lieber anrufen als schreiben.',
        recommendation: 'Zeigen Sie Ihre Telefonnummer prominent an, idealerweise im Header.'
      });
    }

    if (result.data.hasEmail) {
      scorePoints += 5;
    }

    if (result.data.hasAddress) {
      scorePoints += 10;
    } else {
      result.issues.push({
        id: 'trust-no-address',
        category: 'trust',
        severity: 'warning',
        title: 'Keine Adresse sichtbar',
        description: 'Auf Ihrer Seite ist keine Geschäftsadresse sichtbar.',
        impact: 'Eine sichtbare Adresse erhöht das Vertrauen und hilft bei Local SEO.',
        recommendation: 'Zeigen Sie Ihre Geschäftsadresse auf der Website an.'
      });
    }

    if (result.data.hasSocialProof || result.data.hasReviews) {
      scorePoints += 10;
    } else {
      result.issues.push({
        id: 'trust-no-social-proof',
        category: 'trust',
        severity: 'warning',
        title: 'Keine Kundenstimmen oder Bewertungen',
        description: 'Ihre Seite zeigt keine Kundenbewertungen oder Referenzen.',
        impact: 'Social Proof erhöht die Conversion-Rate erheblich.',
        recommendation: 'Integrieren Sie Kundenbewertungen von Google, ProvenExpert oder Testimonials.'
      });
    }

    if (result.data.hasLogos) {
      scorePoints += 5;
    }

    if (result.data.hasCookieBanner) {
      scorePoints += 5;
    } else {
      result.issues.push({
        id: 'trust-no-cookie-banner',
        category: 'trust',
        severity: 'high',
        title: 'Kein Cookie-Banner gefunden',
        description: 'Ihre Website scheint keinen Cookie-Banner zu haben.',
        impact: 'Ein fehlender Cookie-Banner kann zu DSGVO-Verstößen führen.',
        recommendation: 'Implementieren Sie einen DSGVO-konformen Cookie-Banner.'
      });
    }

    result.score = Math.round((scorePoints / maxPoints) * 100);

  } catch (error) {
    console.error('Trust scan error:', error);
    result.score = 50;
    result.issues.push({
      id: 'trust-scan-error',
      category: 'trust',
      severity: 'warning',
      title: 'Vertrauensanalyse unvollständig',
      description: 'Die Vertrauensanalyse konnte nicht vollständig durchgeführt werden.',
      impact: 'Einige Vertrauensfaktoren konnten nicht geprüft werden.',
      recommendation: 'Versuchen Sie es später erneut.'
    });
  }

  return result;
}
