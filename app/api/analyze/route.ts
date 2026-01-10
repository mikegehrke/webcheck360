import { NextRequest, NextResponse } from 'next/server';
import { normalizeUrl, extractDomain } from '@/lib/utils';
import { createAudit } from '@/lib/db';
import { captureScreenshots } from '@/services/screenshot';
import { runLighthouseAnalysis } from '@/services/lighthouse';
import { analyzeSEO } from '@/services/seo-analyzer';
import { scanTrustFactors } from '@/services/trust-scanner';
import { analyzeConversion } from '@/services/conversion-analyzer';
import { processScoreEngine } from '@/services/score-engine';
import { AuditIssue } from '@/lib/types';

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

    // Run all analyses in parallel
    const [
      screenshots,
      lighthouse,
      seo,
      trust,
      conversion
    ] = await Promise.all([
      captureScreenshots(normalizedUrl).catch(err => {
        console.error('Screenshot error:', err);
        return { desktop: null, mobile: null, errors: [err.message] };
      }),
      runLighthouseAnalysis(normalizedUrl).catch(err => {
        console.error('Lighthouse error:', err);
        return { performance: 50, accessibility: 50, bestPractices: 50, seo: 50, metrics: {}, errors: [err.message] };
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
      ...seo.issues,
      ...trust.issues,
      ...conversion.issues,
    ];

    // Calculate scores
    const scores = {
      performance: lighthouse.performance,
      mobile_ux: Math.round((lighthouse.performance + lighthouse.accessibility) / 2),
      seo: seo.score,
      trust: trust.score,
      conversion: conversion.score,
    };

    // Process through score engine
    const scoreResult = processScoreEngine(scores, allIssues);

    // Store in database using lowdb helper
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

    console.log(`Audit created with ID: ${audit.id}`);

    return NextResponse.json({
      auditId: audit.id,
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
