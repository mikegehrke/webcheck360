// Issue translations for WebCheck360
// Maps issue IDs to their translations

export interface IssueTranslation {
  title: string;
  description: string;
  recommendation: string;
  impact?: string;
}

export const issueTranslations: Record<string, Record<'de' | 'en', IssueTranslation>> = {
  // SEO Issues
  'seo-title-length': {
    de: {
      title: 'Title-Tag Länge optimieren',
      description: 'Ihr Title-Tag ist zu lang oder zu kurz. Optimal sind 30-60 Zeichen.',
      recommendation: 'Optimieren Sie Ihren Title-Tag auf 30-60 Zeichen mit relevanten Keywords.'
    },
    en: {
      title: 'Optimize Title Tag Length',
      description: 'Your title tag is too long or too short. Optimal is 30-60 characters.',
      recommendation: 'Optimize your title tag to 30-60 characters with relevant keywords.'
    }
  },
  'seo-no-title': {
    de: {
      title: 'Kein Title-Tag vorhanden',
      description: 'Ihre Seite hat keinen Title-Tag.',
      recommendation: 'Fügen Sie einen aussagekräftigen Title-Tag mit 30-60 Zeichen hinzu.',
      impact: 'Ohne Title-Tag kann Google Ihre Seite nicht richtig indexieren.'
    },
    en: {
      title: 'No Title Tag Found',
      description: 'Your page has no title tag.',
      recommendation: 'Add a meaningful title tag with 30-60 characters.',
      impact: 'Without a title tag, Google cannot properly index your page.'
    }
  },
  'seo-description-length': {
    de: {
      title: 'Meta-Description Länge optimieren',
      description: 'Ihre Meta-Description ist zu lang oder zu kurz. Optimal sind 120-160 Zeichen.',
      recommendation: 'Schreiben Sie eine prägnante Meta-Description mit 120-160 Zeichen.'
    },
    en: {
      title: 'Optimize Meta Description Length',
      description: 'Your meta description is too long or too short. Optimal is 120-160 characters.',
      recommendation: 'Write a concise meta description with 120-160 characters.'
    }
  },
  'seo-no-description': {
    de: {
      title: 'Keine Meta-Description vorhanden',
      description: 'Ihre Seite hat keine Meta-Description.',
      recommendation: 'Fügen Sie eine aussagekräftige Meta-Description hinzu.',
      impact: 'Ohne Meta-Description entscheidet Google selbst, was in den Suchergebnissen angezeigt wird.'
    },
    en: {
      title: 'No Meta Description Found',
      description: 'Your page has no meta description.',
      recommendation: 'Add a meaningful meta description.',
      impact: 'Without a meta description, Google decides what to show in search results.'
    }
  },
  'seo-multiple-h1': {
    de: {
      title: 'Mehrere H1-Überschriften',
      description: 'Ihre Seite hat mehrere H1-Überschriften.',
      recommendation: 'Verwenden Sie nur eine H1-Überschrift pro Seite.',
      impact: 'Mehrere H1s können Google verwirren.'
    },
    en: {
      title: 'Multiple H1 Headings',
      description: 'Your page has multiple H1 headings.',
      recommendation: 'Use only one H1 heading per page.',
      impact: 'Multiple H1s can confuse Google.'
    }
  },
  'seo-no-h1': {
    de: {
      title: 'Keine H1-Überschrift',
      description: 'Ihre Seite hat keine H1-Überschrift.',
      recommendation: 'Fügen Sie genau eine H1-Überschrift hinzu.',
      impact: 'Die H1 ist wichtig für SEO und Barrierefreiheit.'
    },
    en: {
      title: 'No H1 Heading',
      description: 'Your page has no H1 heading.',
      recommendation: 'Add exactly one H1 heading.',
      impact: 'The H1 is important for SEO and accessibility.'
    }
  },
  'seo-images-alt': {
    de: {
      title: 'Bilder ohne Alt-Text',
      description: 'Einige Bilder haben keinen Alt-Text.',
      recommendation: 'Fügen Sie beschreibende Alt-Texte zu allen Bildern hinzu.'
    },
    en: {
      title: 'Images Without Alt Text',
      description: 'Some images have no alt text.',
      recommendation: 'Add descriptive alt text to all images.'
    }
  },
  'seo-no-canonical': {
    de: {
      title: 'Kein Canonical-Tag',
      description: 'Ihre Seite hat kein Canonical-Tag.',
      recommendation: 'Fügen Sie ein Canonical-Tag hinzu, um Duplicate Content zu vermeiden.'
    },
    en: {
      title: 'No Canonical Tag',
      description: 'Your page has no canonical tag.',
      recommendation: 'Add a canonical tag to avoid duplicate content issues.'
    }
  },
  'seo-og-incomplete': {
    de: {
      title: 'Open Graph Tags unvollständig',
      description: 'Ihre Seite hat nicht alle wichtigen Open Graph Tags.',
      recommendation: 'Fügen Sie og:title, og:description und og:image hinzu.'
    },
    en: {
      title: 'Open Graph Tags Incomplete',
      description: 'Your page is missing important Open Graph tags.',
      recommendation: 'Add og:title, og:description, and og:image tags.'
    }
  },
  'seo-no-og': {
    de: {
      title: 'Keine Open Graph Tags',
      description: 'Ihre Seite hat keine Open Graph Tags.',
      recommendation: 'Fügen Sie Open Graph Tags für bessere Social Media Darstellung hinzu.',
      impact: 'Ohne OG-Tags sehen Links in Social Media schlecht aus.'
    },
    en: {
      title: 'No Open Graph Tags',
      description: 'Your page has no Open Graph tags.',
      recommendation: 'Add Open Graph tags for better social media appearance.',
      impact: 'Without OG tags, links on social media will look poor.'
    }
  },
  'seo-no-structured-data': {
    de: {
      title: 'Keine strukturierten Daten',
      description: 'Ihre Seite enthält keine strukturierten Daten (Schema.org).',
      recommendation: 'Fügen Sie strukturierte Daten für Rich Snippets in Google hinzu.'
    },
    en: {
      title: 'No Structured Data',
      description: 'Your page has no structured data (Schema.org).',
      recommendation: 'Add structured data for rich snippets in Google.'
    }
  },
  'seo-analysis-error': {
    de: {
      title: 'SEO-Analyse unvollständig',
      description: 'Die SEO-Analyse konnte nicht vollständig durchgeführt werden.',
      recommendation: 'Prüfen Sie, ob Ihre Website erreichbar ist.'
    },
    en: {
      title: 'SEO Analysis Incomplete',
      description: 'The SEO analysis could not be fully completed.',
      recommendation: 'Check if your website is reachable.'
    }
  },

  // Trust Issues
  'trust-no-https': {
    de: {
      title: 'Keine HTTPS-Verschlüsselung',
      description: 'Ihre Website verwendet kein HTTPS.',
      recommendation: 'Aktivieren Sie ein SSL-Zertifikat für Ihre Domain.',
      impact: 'Ohne HTTPS zeigen Browser Warnungen an und Google stuft Sie schlechter.'
    },
    en: {
      title: 'No HTTPS Encryption',
      description: 'Your website does not use HTTPS.',
      recommendation: 'Activate an SSL certificate for your domain.',
      impact: 'Without HTTPS, browsers show warnings and Google ranks you lower.'
    }
  },
  'trust-no-impressum': {
    de: {
      title: 'Kein Impressum gefunden',
      description: 'Ihre Seite scheint kein Impressum zu haben.',
      recommendation: 'Fügen Sie ein vollständiges Impressum hinzu (gesetzlich vorgeschrieben in DE/AT/CH).',
      impact: 'Fehlendes Impressum ist ein Vertrauensproblem und rechtliches Risiko.'
    },
    en: {
      title: 'No Imprint Found',
      description: 'Your page appears to have no legal notice/imprint.',
      recommendation: 'Add a complete imprint (legally required in DE/AT/CH).',
      impact: 'Missing imprint is a trust issue and legal risk.'
    }
  },
  'trust-no-privacy': {
    de: {
      title: 'Keine Datenschutzerklärung gefunden',
      description: 'Ihre Seite scheint keine Datenschutzerklärung zu haben.',
      recommendation: 'Fügen Sie eine DSGVO-konforme Datenschutzerklärung hinzu.',
      impact: 'Ohne Datenschutzerklärung riskieren Sie DSGVO-Strafen.'
    },
    en: {
      title: 'No Privacy Policy Found',
      description: 'Your page appears to have no privacy policy.',
      recommendation: 'Add a GDPR-compliant privacy policy.',
      impact: 'Without a privacy policy, you risk GDPR fines.'
    }
  },
  'trust-no-contact': {
    de: {
      title: 'Keine Kontaktseite gefunden',
      description: 'Wir konnten keine Kontaktseite finden.',
      recommendation: 'Erstellen Sie eine gut sichtbare Kontaktseite.',
      impact: 'Besucher finden keinen einfachen Weg, Sie zu kontaktieren.'
    },
    en: {
      title: 'No Contact Page Found',
      description: 'We could not find a contact page.',
      recommendation: 'Create a clearly visible contact page.',
      impact: 'Visitors cannot find an easy way to contact you.'
    }
  },
  'trust-no-phone': {
    de: {
      title: 'Keine Telefonnummer sichtbar',
      description: 'Auf Ihrer Seite ist keine Telefonnummer erkennbar.',
      recommendation: 'Zeigen Sie eine Telefonnummer im Header oder Footer an.'
    },
    en: {
      title: 'No Phone Number Visible',
      description: 'No phone number is visible on your page.',
      recommendation: 'Display a phone number in the header or footer.'
    }
  },
  'trust-no-address': {
    de: {
      title: 'Keine Adresse sichtbar',
      description: 'Auf Ihrer Seite ist keine Geschäftsadresse erkennbar.',
      recommendation: 'Zeigen Sie Ihre Adresse im Footer oder Impressum an.'
    },
    en: {
      title: 'No Address Visible',
      description: 'No business address is visible on your page.',
      recommendation: 'Display your address in the footer or imprint.'
    }
  },
  'trust-no-social-proof': {
    de: {
      title: 'Keine Kundenstimmen oder Bewertungen',
      description: 'Wir konnten keine Testimonials oder Bewertungen finden.',
      recommendation: 'Fügen Sie Kundenmeinungen oder Bewertungen hinzu.'
    },
    en: {
      title: 'No Testimonials or Reviews',
      description: 'We could not find any testimonials or reviews.',
      recommendation: 'Add customer testimonials or reviews.'
    }
  },
  'trust-no-cookie-banner': {
    de: {
      title: 'Kein Cookie-Banner gefunden',
      description: 'Ihre Seite scheint keinen Cookie-Hinweis zu haben.',
      recommendation: 'Implementieren Sie einen DSGVO-konformen Cookie-Banner.'
    },
    en: {
      title: 'No Cookie Banner Found',
      description: 'Your page appears to have no cookie notice.',
      recommendation: 'Implement a GDPR-compliant cookie banner.'
    }
  },
  'trust-scan-error': {
    de: {
      title: 'Vertrauensanalyse unvollständig',
      description: 'Die Vertrauensanalyse konnte nicht vollständig durchgeführt werden.',
      recommendation: 'Prüfen Sie, ob Ihre Website erreichbar ist.'
    },
    en: {
      title: 'Trust Analysis Incomplete',
      description: 'The trust analysis could not be fully completed.',
      recommendation: 'Check if your website is reachable.'
    }
  },

  // Conversion Issues
  'conversion-few-ctas': {
    de: {
      title: 'Wenige Call-to-Actions',
      description: 'Ihre Seite hat nur wenige CTAs.',
      recommendation: 'Fügen Sie mehr auffällige CTAs an strategischen Stellen hinzu.'
    },
    en: {
      title: 'Few Call-to-Actions',
      description: 'Your page has only a few CTAs.',
      recommendation: 'Add more prominent CTAs at strategic locations.'
    }
  },
  'conversion-no-cta': {
    de: {
      title: 'Keine Call-to-Action erkannt',
      description: 'Wir konnten keine klaren Handlungsaufforderungen auf Ihrer Seite finden.',
      recommendation: 'Fügen Sie klare CTAs wie "Jetzt anfragen" oder "Termin buchen" hinzu.',
      impact: 'Ohne CTAs wissen Besucher nicht, was sie tun sollen.'
    },
    en: {
      title: 'No Call-to-Action Found',
      description: 'We could not find any clear calls-to-action on your page.',
      recommendation: 'Add clear CTAs like "Contact now" or "Book appointment".',
      impact: 'Without CTAs, visitors do not know what to do.'
    }
  },
  'conversion-cta-below-fold': {
    de: {
      title: 'Kein CTA im sichtbaren Bereich',
      description: 'Im direkt sichtbaren Bereich ist keine Handlungsaufforderung erkennbar.',
      recommendation: 'Platzieren Sie einen auffälligen CTA-Button im Header-Bereich.'
    },
    en: {
      title: 'No CTA Above the Fold',
      description: 'No call-to-action is visible in the immediately visible area.',
      recommendation: 'Place a prominent CTA button in the header area.'
    }
  },
  'conversion-no-form': {
    de: {
      title: 'Kein Kontaktformular gefunden',
      description: 'Wir konnten kein Kontaktformular auf Ihrer Seite finden.',
      recommendation: 'Fügen Sie ein einfaches Kontaktformular hinzu.',
      impact: 'Formulare senken die Hemmschwelle zur Kontaktaufnahme.'
    },
    en: {
      title: 'No Contact Form Found',
      description: 'We could not find a contact form on your page.',
      recommendation: 'Add a simple contact form.',
      impact: 'Forms lower the barrier to making contact.'
    }
  },
  'conversion-phone-not-clickable': {
    de: {
      title: 'Telefonnummer nicht klickbar',
      description: 'Die Telefonnummer ist nicht als klickbarer Link hinterlegt.',
      recommendation: 'Machen Sie Telefonnummern mit tel: Links klickbar.'
    },
    en: {
      title: 'Phone Number Not Clickable',
      description: 'The phone number is not a clickable link.',
      recommendation: 'Make phone numbers clickable with tel: links.'
    }
  },
  'conversion-no-instant-contact': {
    de: {
      title: 'Keine Sofort-Kontaktmöglichkeit',
      description: 'Ihre Seite hat kein WhatsApp oder Chat-Widget.',
      recommendation: 'Integrieren Sie einen WhatsApp-Button oder ein Chat-Widget.'
    },
    en: {
      title: 'No Instant Contact Option',
      description: 'Your page has no WhatsApp or chat widget.',
      recommendation: 'Add a WhatsApp button or chat widget.'
    }
  },
  'conversion-no-mobile-menu': {
    de: {
      title: 'Keine mobile Navigation erkannt',
      description: 'Wir konnten keine Hamburger-Menü auf Ihrer mobilen Seite erkennen.',
      recommendation: 'Stellen Sie sicher, dass Ihre Seite eine mobile Navigation hat.'
    },
    en: {
      title: 'No Mobile Navigation Found',
      description: 'We could not find a hamburger menu on your mobile page.',
      recommendation: 'Make sure your page has mobile navigation.'
    }
  },
  'conversion-no-value-proposition': {
    de: {
      title: 'Keine klaren Argumente erkennbar',
      description: 'Wir konnten keine klaren Verkaufsargumente auf Ihrer Seite finden.',
      recommendation: 'Zeigen Sie Erfahrung, Qualifikationen und Kundenzahlen prominent an.',
      impact: 'Ohne USPs wissen Besucher nicht, warum sie Sie wählen sollten.'
    },
    en: {
      title: 'No Clear USPs Found',
      description: 'We could not find clear selling points on your page.',
      recommendation: 'Prominently display experience, qualifications, and customer numbers.',
      impact: 'Without USPs, visitors do not know why they should choose you.'
    }
  },
  'conversion-analysis-error': {
    de: {
      title: 'Conversion-Analyse unvollständig',
      description: 'Die Conversion-Analyse konnte nicht vollständig durchgeführt werden.',
      recommendation: 'Prüfen Sie, ob Ihre Website erreichbar ist.'
    },
    en: {
      title: 'Conversion Analysis Incomplete',
      description: 'The conversion analysis could not be fully completed.',
      recommendation: 'Check if your website is reachable.'
    }
  },

  // Performance Issues
  'perf-slow': {
    de: {
      title: 'Langsame Ladezeit',
      description: 'Ihre Website lädt zu langsam.',
      recommendation: 'Optimieren Sie Bilder, nutzen Sie Caching und minimieren Sie JavaScript.'
    },
    en: {
      title: 'Slow Loading Time',
      description: 'Your website loads too slowly.',
      recommendation: 'Optimize images, use caching, and minimize JavaScript.'
    }
  },
  'perf-mobile-poor': {
    de: {
      title: 'Schlechte Mobile-Performance',
      description: 'Ihre Website hat auf Mobilgeräten Performance-Probleme.',
      recommendation: 'Optimieren Sie Ihre Seite für mobile Geräte.'
    },
    en: {
      title: 'Poor Mobile Performance',
      description: 'Your website has performance issues on mobile devices.',
      recommendation: 'Optimize your page for mobile devices.'
    }
  }
};

// Helper function to translate an issue
export function translateIssue(
  issueId: string,
  locale: 'de' | 'en',
  fallback: { title: string; description: string; recommendation: string; impact?: string }
): { title: string; description: string; recommendation: string; impact?: string } {
  const translation = issueTranslations[issueId]?.[locale];
  if (translation) {
    return translation;
  }
  // Return fallback (original text) if no translation found
  return fallback;
}

// Category translations
export const categoryTranslations: Record<string, Record<'de' | 'en', string>> = {
  performance: { de: 'Performance', en: 'Performance' },
  mobile_ux: { de: 'Mobile UX', en: 'Mobile UX' },
  seo: { de: 'SEO', en: 'SEO' },
  trust: { de: 'Vertrauen', en: 'Trust' },
  conversion: { de: 'Conversion', en: 'Conversion' }
};
// Build trigger Tue Jan 13 18:13:58 CET 2026
