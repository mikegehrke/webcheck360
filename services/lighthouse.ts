import lighthouse from 'lighthouse';
import { chromium } from 'playwright';

export interface LighthouseResult {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  metrics: {
    lcp: number;
    fid: number;
    cls: number;
    ttfb: number;
    fcp: number;
    si: number;
    tbt: number;
  };
  errors: string[];
}

const TIMEOUT = parseInt(process.env.LIGHTHOUSE_TIMEOUT || '60000');

export async function runLighthouseAnalysis(url: string): Promise<LighthouseResult> {
  const result: LighthouseResult = {
    performance: 0,
    accessibility: 0,
    bestPractices: 0,
    seo: 0,
    metrics: {
      lcp: 0,
      fid: 0,
      cls: 0,
      ttfb: 0,
      fcp: 0,
      si: 0,
      tbt: 0
    },
    errors: []
  };

  let browser = null;

  try {
    // Launch browser with remote debugging port
    browser = await chromium.launch({
      headless: true,
      args: [
        '--remote-debugging-port=9222',
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ]
    });

    // Run Lighthouse
    const runnerResult = await lighthouse(url, {
      port: 9222,
      output: 'json',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      formFactor: 'mobile',
      throttling: {
        rttMs: 150,
        throughputKbps: 1638.4,
        cpuSlowdownMultiplier: 4
      },
      screenEmulation: {
        mobile: true,
        width: 390,
        height: 844,
        deviceScaleFactor: 2
      }
    });

    if (runnerResult?.lhr) {
      const { categories, audits } = runnerResult.lhr;

      // Category scores (0-100)
      result.performance = Math.round((categories.performance?.score || 0) * 100);
      result.accessibility = Math.round((categories.accessibility?.score || 0) * 100);
      result.bestPractices = Math.round((categories['best-practices']?.score || 0) * 100);
      result.seo = Math.round((categories.seo?.score || 0) * 100);

      // Core Web Vitals
      result.metrics.lcp = audits['largest-contentful-paint']?.numericValue || 0;
      result.metrics.fcp = audits['first-contentful-paint']?.numericValue || 0;
      result.metrics.cls = audits['cumulative-layout-shift']?.numericValue || 0;
      result.metrics.tbt = audits['total-blocking-time']?.numericValue || 0;
      result.metrics.si = audits['speed-index']?.numericValue || 0;
      result.metrics.ttfb = audits['server-response-time']?.numericValue || 0;
      
      // FID is approximated by TBT in lab data
      result.metrics.fid = result.metrics.tbt;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    result.errors.push(`Lighthouse error: ${message}`);
    console.error('Lighthouse analysis error:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  return result;
}

export function getPerformanceRating(score: number): 'good' | 'needs-improvement' | 'poor' {
  if (score >= 90) return 'good';
  if (score >= 50) return 'needs-improvement';
  return 'poor';
}

export function formatMetric(value: number, type: 'time' | 'score'): string {
  if (type === 'time') {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}s`;
    }
    return `${Math.round(value)}ms`;
  }
  return value.toFixed(2);
}
