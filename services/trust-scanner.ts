import { chromium } from 'playwright';
import { AuditIssue } from '@/lib/types';

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

  let browser = null;
  let scorePoints = 0;
  const maxPoints = 100;

  try {
    // Check HTTPS
    result.data.hasHttps = url.startsWith('https://');
    
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    const trustData = await page.evaluate(() => {
      const bodyText = document.body.innerText.toLowerCase();
      const html = document.documentElement.innerHTML.toLowerCase();
      
      // Get all links
      const links = Array.from(document.querySelectorAll('a'))
        .map(a => ({
          href: a.href.toLowerCase(),
          text: a.textContent?.toLowerCase() || ''
        }));

      // Check for legal pages
      const hasImpressum = links.some(l => 
        l.href.includes('impressum') || 
        l.text.includes('impressum') ||
        l.href.includes('imprint') ||
        l.text.includes('imprint')
      );

      const hasPrivacy = links.some(l => 
        l.href.includes('datenschutz') || 
        l.text.includes('datenschutz') ||
        l.href.includes('privacy') ||
        l.text.includes('privacy')
      );

      const hasContact = links.some(l => 
        l.href.includes('kontakt') || 
        l.text.includes('kontakt') ||
        l.href.includes('contact') ||
        l.text.includes('contact')
      );

      // Check for contact info
      const phoneRegex = /(\+49|0049|0)\s*\d{2,4}\s*[\d\s\-\/]{6,}/;
      const hasPhone = phoneRegex.test(bodyText);

      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
      const hasEmail = emailRegex.test(bodyText) || document.querySelector('a[href^="mailto:"]') !== null;

      // Check for address (German format)
      const addressRegex = /\d{5}\s+[a-zA-ZäöüßÄÖÜ]+/;
      const hasAddress = addressRegex.test(bodyText);

      // Check for social proof
      const socialKeywords = ['bewertung', 'review', 'kundenstimm', 'testimonial', 'erfahrung', 'rating', 'sterne', 'stars'];
      const hasSocialProof = socialKeywords.some(kw => bodyText.includes(kw));

      // Check for review platforms
      const reviewPlatforms = ['google', 'trustpilot', 'provenexpert', 'yelp', 'tripadvisor', 'kununu'];
      const hasReviews = reviewPlatforms.some(platform => html.includes(platform));

      // Check for trust logos
      const trustLogos = ['tuev', 'tüv', 'trusted', 'siegel', 'zertifiziert', 'ssl', 'secure', 'verified'];
      const hasLogos = trustLogos.some(logo => html.includes(logo));

      // Check for cookie banner
      const cookieKeywords = ['cookie', 'dsgvo', 'gdpr', 'consent'];
      const hasCookieBanner = cookieKeywords.some(kw => html.includes(kw));

      return {
        hasImpressum,
        hasPrivacy,
        hasContact,
        hasPhone,
        hasEmail,
        hasAddress,
        hasSocialProof,
        hasReviews,
        hasLogos,
        hasCookieBanner
      };
    });

    result.data = { ...result.data, ...trustData };

    // Scoring

    // HTTPS (15 points)
    if (result.data.hasHttps) {
      scorePoints += 15;
    } else {
      result.issues.push({
        id: 'trust-no-https',
        category: 'trust',
        severity: 'critical',
        title: 'Keine HTTPS-Verschlüsselung',
        description: 'Die Website verwendet kein HTTPS',
        recommendation: 'Aktivieren Sie ein SSL-Zertifikat für Ihre Domain.'
      });
    }

    // Impressum (20 points - legally required in Germany)
    if (result.data.hasImpressum) {
      scorePoints += 20;
    } else {
      result.issues.push({
        id: 'trust-no-impressum',
        category: 'trust',
        severity: 'critical',
        title: 'Impressum fehlt',
        description: 'Kein Impressum-Link gefunden',
        recommendation: 'Ein Impressum ist in Deutschland gesetzlich vorgeschrieben.'
      });
    }

    // Privacy Policy (15 points)
    if (result.data.hasPrivacy) {
      scorePoints += 15;
    } else {
      result.issues.push({
        id: 'trust-no-privacy',
        category: 'trust',
        severity: 'critical',
        title: 'Datenschutzerklärung fehlt',
        description: 'Keine Datenschutzerklärung gefunden',
        recommendation: 'Eine Datenschutzerklärung ist gesetzlich vorgeschrieben.'
      });
    }

    // Contact Options (15 points)
    const contactPoints = [
      result.data.hasContact,
      result.data.hasPhone,
      result.data.hasEmail
    ].filter(Boolean).length;

    if (contactPoints >= 2) {
      scorePoints += 15;
    } else if (contactPoints === 1) {
      scorePoints += 8;
      result.issues.push({
        id: 'trust-limited-contact',
        category: 'trust',
        severity: 'warning',
        title: 'Wenige Kontaktmöglichkeiten',
        description: 'Nur eine Kontaktmöglichkeit gefunden',
        recommendation: 'Bieten Sie mehrere Kontaktmöglichkeiten an (Telefon, E-Mail, Kontaktformular).'
      });
    } else {
      result.issues.push({
        id: 'trust-no-contact',
        category: 'trust',
        severity: 'critical',
        title: 'Keine Kontaktdaten',
        description: 'Keine Kontaktmöglichkeiten gefunden',
        recommendation: 'Fügen Sie Kontaktinformationen hinzu (Telefon, E-Mail).'
      });
    }

    // Address (10 points)
    if (result.data.hasAddress) {
      scorePoints += 10;
    } else {
      result.issues.push({
        id: 'trust-no-address',
        category: 'trust',
        severity: 'info',
        title: 'Keine Adresse sichtbar',
        description: 'Keine Geschäftsadresse auf der Seite gefunden',
        recommendation: 'Eine sichtbare Adresse erhöht das Vertrauen.'
      });
    }

    // Social Proof (15 points)
    if (result.data.hasSocialProof || result.data.hasReviews) {
      scorePoints += 15;
    } else {
      result.issues.push({
        id: 'trust-no-social-proof',
        category: 'trust',
        severity: 'warning',
        title: 'Kein Social Proof',
        description: 'Keine Kundenbewertungen oder Testimonials gefunden',
        recommendation: 'Zeigen Sie Kundenbewertungen oder Referenzen.'
      });
    }

    // Cookie Banner/DSGVO (10 points)
    if (result.data.hasCookieBanner) {
      scorePoints += 10;
    } else {
      result.issues.push({
        id: 'trust-no-cookie-banner',
        category: 'trust',
        severity: 'warning',
        title: 'Cookie-Banner nicht erkannt',
        description: 'Kein Cookie-Consent-Banner gefunden',
        recommendation: 'Ein Cookie-Banner ist für DSGVO-Konformität wichtig.'
      });
    }

    result.score = Math.round((scorePoints / maxPoints) * 100);

  } catch (error) {
    console.error('Trust scan error:', error);
    result.issues.push({
      id: 'trust-error',
      category: 'trust',
      severity: 'warning',
      title: 'Trust-Analyse unvollständig',
      description: 'Einige Trust-Faktoren konnten nicht geprüft werden',
      recommendation: 'Überprüfen Sie die Website manuell.'
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  return result;
}
