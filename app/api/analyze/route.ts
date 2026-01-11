import { NextRequest, NextResponse } from 'next/server';

// Increase timeout for Vercel
export const maxDuration = 60;

// Simple URL helpers (inline to avoid import issues)
function normalizeUrl(url: string): string {
  let normalized = url.trim().toLowerCase();
  if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
    normalized = `https://${normalized}`;
  }
  return normalized;
}

function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return url;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, industry, goal } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    const normalizedUrl = normalizeUrl(url);
    const domain = extractDomain(normalizedUrl);

    console.log(`Starting analysis for: ${normalizedUrl}`);

    // Run all analyses with dynamic imports and error handling
    let lighthouse = { performance: 50, accessibility: 50, bestPractices: 50, seo: 50, metrics: { lcp: 2500, fid: 100, cls: 0.1, ttfb: 800, fcp: 1800, si: 3000, tbt: 200 }, errors: [] as string[] };
    let seo = { score: 50, issues: [] as any[], data: {} };
    let trust = { score: 50, issues: [] as any[], data: {} };
    let conversion = { score: 50, issues: [] as any[], data: {} };

    try {
      const [lighthouseResult, seoResult, trustResult, conversionResult] = await Promise.all([
        import('@/services/lighthouse').then(m => m.runLighthouseAnalysis(normalizedUrl)).catch(e => {
          console.error('Lighthouse failed:', e);
          return lighthouse;
        }),
        import('@/services/seo-analyzer').then(m => m.analyzeSEO(normalizedUrl)).catch(e => {
          console.error('SEO failed:', e);
          return seo;
        }),
        import('@/services/trust-scanner').then(m => m.scanTrustFactors(normalizedUrl)).catch(e => {
          console.error('Trust failed:', e);
          return trust;
        }),
        import('@/services/conversion-analyzer').then(m => m.analyzeConversion(normalizedUrl)).catch(e => {
          console.error('Conversion failed:', e);
          return conversion;
        }),
      ]);

      lighthouse = lighthouseResult as typeof lighthouse;
      seo = seoResult as typeof seo;
      trust = trustResult as typeof trust;
      conversion = conversionResult as typeof conversion;
    } catch (err) {
      console.error('Analysis batch failed:', err);
    }

    console.log('Analysis complete, processing scores...');

    // Combine all issues
    const allIssues = [
      ...(seo.issues || []),
      ...(trust.issues || []),
      ...(conversion.issues || []),
    ];

    // Calculate scores
    const scores = {
      performance: lighthouse.performance || 50,
      mobile_ux: Math.round(((lighthouse.performance || 50) + (lighthouse.accessibility || 50)) / 2),
      seo: seo.score || 50,
      trust: trust.score || 50,
      conversion: conversion.score || 50,
    };

    // Calculate total score (weighted average)
    const weights = { performance: 0.2, mobile_ux: 0.2, seo: 0.25, trust: 0.2, conversion: 0.15 };
    const totalScore = Math.round(
      scores.performance * weights.performance +
      scores.mobile_ux * weights.mobile_ux +
      scores.seo * weights.seo +
      scores.trust * weights.trust +
      scores.conversion * weights.conversion
    );

    // Generate audit ID
    const auditId = `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    console.log(`Analysis complete. Score: ${totalScore}`);

    return NextResponse.json({
      auditId,
      score: totalScore,
      scores,
      issues: allIssues,
      screenshots: {
        desktop: null,
        mobile: null,
      },
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Analysis failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
