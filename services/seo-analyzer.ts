import { AuditIssue } from '@/lib/types';
import * as cheerio from 'cheerio';

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

  let scorePoints = 0;
  const maxPoints = 100;

  try {
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
    const urlObj = new URL(url);

    // Extract SEO data
    const title = $('title').text().trim() || null;
    const description = $('meta[name="description"]').attr('content') || null;
    
    const h1Elements = $('h1');
    const h1Text: string[] = [];
    h1Elements.each((_, el) => {
      const text = $(el).text().trim();
      if (text) h1Text.push(text);
    });
    
    const h2Elements = $('h2');
    const images = $('img');
    let imagesWithAlt = 0;
    images.each((_, el) => {
      if ($(el).attr('alt')?.trim()) imagesWithAlt++;
    });

    const links = $('a[href]');
    let internalLinks = 0;
    let externalLinks = 0;
    
    links.each((_, el) => {
      const href = $(el).attr('href') || '';
      try {
        if (href.startsWith('/') || href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:')) {
          internalLinks++;
        } else if (href.startsWith('http')) {
          const linkUrl = new URL(href);
          if (linkUrl.hostname === urlObj.hostname) {
            internalLinks++;
          } else {
            externalLinks++;
          }
        } else {
          internalLinks++;
        }
      } catch {
        internalLinks++;
      }
    });

    const canonicalUrl = $('link[rel="canonical"]').attr('href') || null;
    const robotsMeta = $('meta[name="robots"]').attr('content') || null;
    
    const ogTags: Record<string, string> = {};
    $('meta[property^="og:"]').each((_, el) => {
      const property = $(el).attr('property');
      const content = $(el).attr('content');
      if (property && content) {
        ogTags[property] = content;
      }
    });

    const structuredData = $('script[type="application/ld+json"]').length > 0;

    result.data = {
      title,
      titleLength: title?.length || 0,
      description,
      descriptionLength: description?.length || 0,
      h1Count: h1Elements.length,
      h1Text,
      h2Count: h2Elements.length,
      imageCount: images.length,
      imagesWithAlt,
      imagesWithoutAlt: images.length - imagesWithAlt,
      internalLinks,
      externalLinks,
      canonicalUrl,
      robotsMeta,
      ogTags,
      structuredData
    };

    // Scoring and issue detection

    // Title (20 points)
    if (result.data.title) {
      if (result.data.titleLength >= 30 && result.data.titleLength <= 60) {
        scorePoints += 20;
      } else if (result.data.titleLength > 0) {
        scorePoints += 10;
        result.issues.push({
          id: 'seo-title-length',
          category: 'seo',
          severity: 'warning',
          title: 'Title-Tag Länge optimieren',
          description: `Ihr Title-Tag hat ${result.data.titleLength} Zeichen. Optimal sind 30-60 Zeichen.`,
          impact: 'Zu lange oder zu kurze Title werden in Suchergebnissen abgeschnitten oder sind weniger aussagekräftig.',
          recommendation: 'Optimieren Sie Ihren Title-Tag auf 30-60 Zeichen mit relevanten Keywords.'
        });
      }
    } else {
      result.issues.push({
        id: 'seo-no-title',
        category: 'seo',
        severity: 'critical',
        title: 'Kein Title-Tag vorhanden',
        description: 'Ihre Seite hat keinen Title-Tag.',
        impact: 'Ohne Title-Tag kann Google Ihre Seite nicht richtig indexieren.',
        recommendation: 'Fügen Sie einen aussagekräftigen Title-Tag mit 30-60 Zeichen hinzu.'
      });
    }

    // Meta Description (15 points)
    if (result.data.description) {
      if (result.data.descriptionLength >= 120 && result.data.descriptionLength <= 160) {
        scorePoints += 15;
      } else if (result.data.descriptionLength > 0) {
        scorePoints += 8;
        result.issues.push({
          id: 'seo-description-length',
          category: 'seo',
          severity: 'warning',
          title: 'Meta-Description Länge optimieren',
          description: `Ihre Meta-Description hat ${result.data.descriptionLength} Zeichen. Optimal sind 120-160 Zeichen.`,
          impact: 'Nicht optimale Länge kann zu abgeschnittenen Snippets in Suchergebnissen führen.',
          recommendation: 'Schreiben Sie eine prägnante Meta-Description mit 120-160 Zeichen.'
        });
      }
    } else {
      result.issues.push({
        id: 'seo-no-description',
        category: 'seo',
        severity: 'high',
        title: 'Keine Meta-Description vorhanden',
        description: 'Ihre Seite hat keine Meta-Description.',
        impact: 'Google generiert dann selbst einen Snippet-Text, der möglicherweise nicht optimal ist.',
        recommendation: 'Fügen Sie eine ansprechende Meta-Description mit 120-160 Zeichen hinzu.'
      });
    }

    // H1 (15 points)
    if (result.data.h1Count === 1) {
      scorePoints += 15;
    } else if (result.data.h1Count > 1) {
      scorePoints += 8;
      result.issues.push({
        id: 'seo-multiple-h1',
        category: 'seo',
        severity: 'warning',
        title: 'Mehrere H1-Überschriften',
        description: `Ihre Seite hat ${result.data.h1Count} H1-Überschriften. Optimal ist genau eine.`,
        impact: 'Mehrere H1s können die Seitenstruktur für Suchmaschinen verwirren.',
        recommendation: 'Verwenden Sie nur eine H1-Überschrift pro Seite.'
      });
    } else {
      result.issues.push({
        id: 'seo-no-h1',
        category: 'seo',
        severity: 'high',
        title: 'Keine H1-Überschrift',
        description: 'Ihre Seite hat keine H1-Überschrift.',
        impact: 'Die H1 ist wichtig für SEO und Barrierefreiheit.',
        recommendation: 'Fügen Sie eine aussagekräftige H1-Überschrift hinzu.'
      });
    }

    // Images with Alt (15 points)
    if (result.data.imageCount > 0) {
      const altRatio = result.data.imagesWithAlt / result.data.imageCount;
      if (altRatio === 1) {
        scorePoints += 15;
      } else if (altRatio >= 0.8) {
        scorePoints += 10;
      } else {
        scorePoints += Math.round(altRatio * 10);
        result.issues.push({
          id: 'seo-images-alt',
          category: 'seo',
          severity: altRatio < 0.5 ? 'high' : 'warning',
          title: 'Bilder ohne Alt-Text',
          description: `${result.data.imagesWithoutAlt} von ${result.data.imageCount} Bildern haben keinen Alt-Text.`,
          impact: 'Alt-Texte sind wichtig für SEO und Barrierefreiheit.',
          recommendation: 'Fügen Sie beschreibende Alt-Texte zu allen Bildern hinzu.'
        });
      }
    } else {
      scorePoints += 15; // No images, no penalty
    }

    // Canonical URL (10 points)
    if (result.data.canonicalUrl) {
      scorePoints += 10;
    } else {
      result.issues.push({
        id: 'seo-no-canonical',
        category: 'seo',
        severity: 'warning',
        title: 'Kein Canonical-Tag',
        description: 'Ihre Seite hat keinen Canonical-Tag.',
        impact: 'Ohne Canonical kann es zu Duplicate-Content-Problemen kommen.',
        recommendation: 'Fügen Sie einen Canonical-Tag hinzu, der auf die bevorzugte URL verweist.'
      });
    }

    // Open Graph Tags (10 points)
    if (Object.keys(result.data.ogTags).length >= 3) {
      scorePoints += 10;
    } else if (Object.keys(result.data.ogTags).length > 0) {
      scorePoints += 5;
      result.issues.push({
        id: 'seo-og-incomplete',
        category: 'seo',
        severity: 'low',
        title: 'Open Graph Tags unvollständig',
        description: 'Ihre Seite hat nicht alle wichtigen Open Graph Tags (og:title, og:description, og:image).',
        impact: 'Social Media Shares werden möglicherweise nicht optimal dargestellt.',
        recommendation: 'Ergänzen Sie og:title, og:description und og:image Tags.'
      });
    } else {
      result.issues.push({
        id: 'seo-no-og',
        category: 'seo',
        severity: 'low',
        title: 'Keine Open Graph Tags',
        description: 'Ihre Seite hat keine Open Graph Tags für Social Media.',
        impact: 'Social Media Shares zeigen möglicherweise keine optimale Vorschau.',
        recommendation: 'Fügen Sie og:title, og:description und og:image Tags hinzu.'
      });
    }

    // Structured Data (10 points)
    if (result.data.structuredData) {
      scorePoints += 10;
    } else {
      result.issues.push({
        id: 'seo-no-structured-data',
        category: 'seo',
        severity: 'warning',
        title: 'Keine strukturierten Daten',
        description: 'Ihre Seite verwendet keine Schema.org strukturierten Daten.',
        impact: 'Strukturierte Daten können Rich Snippets in Suchergebnissen ermöglichen.',
        recommendation: 'Implementieren Sie LocalBusiness oder Organization Schema Markup.'
      });
    }

    // Internal Links (5 points)
    if (result.data.internalLinks >= 3) {
      scorePoints += 5;
    }

    result.score = Math.round((scorePoints / maxPoints) * 100);

  } catch (error) {
    console.error('SEO analysis error:', error);
    result.score = 50;
    result.issues.push({
      id: 'seo-analysis-error',
      category: 'seo',
      severity: 'warning',
      title: 'SEO-Analyse unvollständig',
      description: 'Die SEO-Analyse konnte nicht vollständig durchgeführt werden.',
      impact: 'Einige SEO-Faktoren konnten nicht geprüft werden.',
      recommendation: 'Versuchen Sie es später erneut.'
    });
  }

  return result;
}
