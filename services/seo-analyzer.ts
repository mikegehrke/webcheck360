import { chromium } from 'playwright';
import { AuditIssue } from '@/lib/types';

export interface SEOResult {
  score: number;
  issues: AuditIssue[];
  data: {
    title: string | null;
    titleLength: number;
    description: string | null;
    descriptionLength: number;
    h1Count: number;
    h1Text: string[];
    h2Count: number;
    imageCount: number;
    imagesWithAlt: number;
    imagesWithoutAlt: number;
    internalLinks: number;
    externalLinks: number;
    canonicalUrl: string | null;
    robotsMeta: string | null;
    ogTags: Record<string, string>;
    structuredData: boolean;
  };
}

export async function analyzeSEO(url: string): Promise<SEOResult> {
  const result: SEOResult = {
    score: 0,
    issues: [],
    data: {
      title: null,
      titleLength: 0,
      description: null,
      descriptionLength: 0,
      h1Count: 0,
      h1Text: [],
      h2Count: 0,
      imageCount: 0,
      imagesWithAlt: 0,
      imagesWithoutAlt: 0,
      internalLinks: 0,
      externalLinks: 0,
      canonicalUrl: null,
      robotsMeta: null,
      ogTags: {},
      structuredData: false
    }
  };

  let browser = null;
  let scorePoints = 0;
  const maxPoints = 100;

  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Extract SEO data
    const seoData = await page.evaluate(() => {
      const getMetaContent = (name: string): string | null => {
        const meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
        return meta?.getAttribute('content') || null;
      };

      const title = document.title || null;
      const description = getMetaContent('description');
      
      const h1Elements = document.querySelectorAll('h1');
      const h1Text = Array.from(h1Elements).map(h => h.textContent?.trim() || '');
      
      const h2Elements = document.querySelectorAll('h2');
      
      const images = document.querySelectorAll('img');
      const imagesWithAlt = Array.from(images).filter(img => img.alt && img.alt.trim().length > 0);
      
      const links = document.querySelectorAll('a[href]');
      const currentHost = window.location.hostname;
      let internalLinks = 0;
      let externalLinks = 0;
      
      links.forEach(link => {
        try {
          const href = link.getAttribute('href') || '';
          if (href.startsWith('/') || href.startsWith('#')) {
            internalLinks++;
          } else {
            const linkUrl = new URL(href, window.location.origin);
            if (linkUrl.hostname === currentHost) {
              internalLinks++;
            } else {
              externalLinks++;
            }
          }
        } catch {
          internalLinks++;
        }
      });

      const canonical = document.querySelector('link[rel="canonical"]');
      const robotsMeta = getMetaContent('robots');
      
      const ogTags: Record<string, string> = {};
      document.querySelectorAll('meta[property^="og:"]').forEach(meta => {
        const property = meta.getAttribute('property');
        const content = meta.getAttribute('content');
        if (property && content) {
          ogTags[property] = content;
        }
      });

      const structuredData = document.querySelectorAll('script[type="application/ld+json"]').length > 0;

      return {
        title,
        titleLength: title?.length || 0,
        description,
        descriptionLength: description?.length || 0,
        h1Count: h1Elements.length,
        h1Text,
        h2Count: h2Elements.length,
        imageCount: images.length,
        imagesWithAlt: imagesWithAlt.length,
        imagesWithoutAlt: images.length - imagesWithAlt.length,
        internalLinks,
        externalLinks,
        canonicalUrl: canonical?.getAttribute('href') || null,
        robotsMeta,
        ogTags,
        structuredData
      };
    });

    result.data = seoData;

    // Scoring and issue detection

    // Title (20 points)
    if (seoData.title) {
      if (seoData.titleLength >= 30 && seoData.titleLength <= 60) {
        scorePoints += 20;
      } else if (seoData.titleLength > 0) {
        scorePoints += 10;
        result.issues.push({
          id: 'seo-title-length',
          category: 'seo',
          severity: 'warning',
          title: 'Title-Tag Länge optimieren',
          description: `Der Title hat ${seoData.titleLength} Zeichen (optimal: 30-60)`,
          recommendation: 'Passen Sie die Title-Länge auf 30-60 Zeichen an.'
        });
      }
    } else {
      result.issues.push({
        id: 'seo-title-missing',
        category: 'seo',
        severity: 'critical',
        title: 'Title-Tag fehlt',
        description: 'Die Seite hat keinen Title-Tag',
        recommendation: 'Fügen Sie einen aussagekräftigen Title-Tag hinzu.'
      });
    }

    // Description (20 points)
    if (seoData.description) {
      if (seoData.descriptionLength >= 120 && seoData.descriptionLength <= 160) {
        scorePoints += 20;
      } else if (seoData.descriptionLength > 0) {
        scorePoints += 10;
        result.issues.push({
          id: 'seo-description-length',
          category: 'seo',
          severity: 'warning',
          title: 'Meta-Description Länge optimieren',
          description: `Die Description hat ${seoData.descriptionLength} Zeichen (optimal: 120-160)`,
          recommendation: 'Passen Sie die Meta-Description auf 120-160 Zeichen an.'
        });
      }
    } else {
      result.issues.push({
        id: 'seo-description-missing',
        category: 'seo',
        severity: 'critical',
        title: 'Meta-Description fehlt',
        description: 'Die Seite hat keine Meta-Description',
        recommendation: 'Fügen Sie eine aussagekräftige Meta-Description hinzu.'
      });
    }

    // H1 (15 points)
    if (seoData.h1Count === 1) {
      scorePoints += 15;
    } else if (seoData.h1Count > 1) {
      scorePoints += 5;
      result.issues.push({
        id: 'seo-multiple-h1',
        category: 'seo',
        severity: 'warning',
        title: 'Mehrere H1-Überschriften',
        description: `Die Seite hat ${seoData.h1Count} H1-Überschriften`,
        recommendation: 'Verwenden Sie nur eine H1-Überschrift pro Seite.'
      });
    } else {
      result.issues.push({
        id: 'seo-h1-missing',
        category: 'seo',
        severity: 'critical',
        title: 'H1-Überschrift fehlt',
        description: 'Die Seite hat keine H1-Überschrift',
        recommendation: 'Fügen Sie eine H1-Überschrift hinzu.'
      });
    }

    // Images with Alt (15 points)
    if (seoData.imageCount > 0) {
      const altRatio = seoData.imagesWithAlt / seoData.imageCount;
      if (altRatio === 1) {
        scorePoints += 15;
      } else if (altRatio >= 0.8) {
        scorePoints += 10;
        result.issues.push({
          id: 'seo-alt-partial',
          category: 'seo',
          severity: 'warning',
          title: 'Einige Bilder ohne Alt-Text',
          description: `${seoData.imagesWithoutAlt} von ${seoData.imageCount} Bildern haben keinen Alt-Text`,
          recommendation: 'Fügen Sie allen Bildern beschreibende Alt-Texte hinzu.'
        });
      } else {
        scorePoints += 5;
        result.issues.push({
          id: 'seo-alt-missing',
          category: 'seo',
          severity: 'critical',
          title: 'Viele Bilder ohne Alt-Text',
          description: `${seoData.imagesWithoutAlt} von ${seoData.imageCount} Bildern haben keinen Alt-Text`,
          recommendation: 'Alt-Texte sind wichtig für SEO und Barrierefreiheit.'
        });
      }
    } else {
      scorePoints += 15; // No images = no issue
    }

    // Canonical URL (10 points)
    if (seoData.canonicalUrl) {
      scorePoints += 10;
    } else {
      result.issues.push({
        id: 'seo-canonical-missing',
        category: 'seo',
        severity: 'info',
        title: 'Canonical-Tag fehlt',
        description: 'Die Seite hat keinen Canonical-Tag',
        recommendation: 'Fügen Sie einen Canonical-Tag hinzu, um Duplicate Content zu vermeiden.'
      });
    }

    // Open Graph Tags (10 points)
    if (Object.keys(seoData.ogTags).length >= 4) {
      scorePoints += 10;
    } else if (Object.keys(seoData.ogTags).length > 0) {
      scorePoints += 5;
      result.issues.push({
        id: 'seo-og-partial',
        category: 'seo',
        severity: 'info',
        title: 'Open Graph Tags unvollständig',
        description: 'Nicht alle wichtigen OG-Tags sind gesetzt',
        recommendation: 'Fügen Sie og:title, og:description, og:image und og:url hinzu.'
      });
    }

    // Structured Data (10 points)
    if (seoData.structuredData) {
      scorePoints += 10;
    } else {
      result.issues.push({
        id: 'seo-structured-data-missing',
        category: 'seo',
        severity: 'info',
        title: 'Strukturierte Daten fehlen',
        description: 'Die Seite enthält keine strukturierten Daten (JSON-LD)',
        recommendation: 'Fügen Sie Schema.org Markup hinzu für bessere Suchergebnisse.'
      });
    }

    result.score = Math.round((scorePoints / maxPoints) * 100);

  } catch (error) {
    console.error('SEO analysis error:', error);
    result.issues.push({
      id: 'seo-error',
      category: 'seo',
      severity: 'critical',
      title: 'SEO-Analyse fehlgeschlagen',
      description: 'Die Seite konnte nicht analysiert werden',
      recommendation: 'Überprüfen Sie, ob die Website erreichbar ist.'
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  return result;
}
