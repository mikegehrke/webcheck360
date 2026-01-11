import { NextRequest, NextResponse } from 'next/server';
import { normalizeUrl, extractDomain } from '@/lib/utils';
import { runLighthouseAnalysis } from '@/services/lighthouse';
import { analyzeSEO } from '@/services/seo-analyzer';
import { scanTrustFactors } from '@/services/trust-scanner';
import { analyzeConversion } from '@/services/conversion-analyzer';
import { processScoreEngine } from '@/services/score-engine';
import { AuditIssue } from '@/lib/types';

const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV !== undefined;

// Increase timeout for Vercel
export const maxDuration = 60;

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

    console.log(`Starting analysis for: ${normalizedUrl} (Vercel: ${isVercel})`);

    // Screenshots: Skip on Vercel
    let screenshots: { desktop: string | null; mobile: string | null; errors: string[] } = { 
      desktop: null, 
      mobile: null, 
      errors: [] 
    };
    if (!isVercel) {
      try {
        const { captureScreenshots } = await import('@/services/screenshot');
        screenshots = await captureScreenshots(normalizedUrl);
      } catch (err) {
        console.error('Screenshot error:', err);
        screenshots.errors.push((err as Error).message);
      }
    }

    // Run analyses in parallel with timeouts
    const [lighthouse, seo, trust, conversion] = await Promise.all([
      runLighthouseAnalysis(normalizedUrl).catch(err => {
        console.error('Lighthouse error:', err);
        return { 
          performance: 50, 
          accessibility: 50, 
          bestPractices: 50, 
          seo: 50, 
          metrics: { lcp: 2500, fid: 100, cls: 0.1, ttfb: 800, fcp: 1800, si: 3000, tbt: 200 }, 
          errors: [(err as Error).message] 
        };
      }),
      analyzeSEO(normalizedUrl).catch(err => {
        console.error('SEO error:', err);
        return { score: 50, issues: [], data: {} };
      }),
      scanTrustFactors(normalizedUrl).catch(err => {
        console.error('Trust error:', err);
        return { score: 50, issues: [], data: {} };
      }),
      analyzeConversion(normalizedUrl).catch(err => {
        console.error('Conversion error:', err);
        return { score: 50, issues: [], data: {} };
      }),
    ]);

    console.log('Analysis complete, processing scores...');

    // Combine all issues
    const allIssues: AuditIssue[] = [
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

    // Process through score engine
    const scoreResult = processScoreEngine(scores, allIssues);

    // Try to store in database (skip on Vercel - no persistent storage)
    let auditId = `temp-${Date.now()}`;
    
    if (!isVercel) {
      try {
        const { createAudit } = await import('@/lib/db');
        const audit = await createAudit({
          url: normalizedUrl,
          domain,
          score_total: scoreResult.total,
          scores,
          issues: allIssues,
          screenshots: {
            desktop: screenshots.desktop || null,
            mobile: screenshots.mobile || null,
          },
          raw_data: { 
            lighthouse, 
            seo: seo.data, 
            trust: trust.data, 
            conversion: conversion.data 
          },
          industry: industry || undefined,
          goal: goal || undefined,
        });
        auditId = audit.id;
        console.log(`Audit created with ID: ${audit.id}`);
      } catch (dbError) {
        console.error('Database error (continuing without save):', dbError);
      }
    }

    return NextResponse.json({
      auditId,
      score: scoreResult.total,
      scores,
      issues: allIssues,
      screenshots: {
        desktop: screenshots.desktop,
        mobile: screenshots.mobile,
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
