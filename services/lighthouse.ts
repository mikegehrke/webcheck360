// Lighthouse service with Vercel compatibility
// Uses PageSpeed Insights API on Vercel, Playwright locally

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

const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV !== undefined;

// Fallback scores for when analysis fails
function getDefaultResult(errors: string[] = []): LighthouseResult {
  return {
    performance: 50,
    accessibility: 50,
    bestPractices: 50,
    seo: 50,
    metrics: {
      lcp: 2500,
      fid: 100,
      cls: 0.1,
      ttfb: 800,
      fcp: 1800,
      si: 3000,
      tbt: 200
    },
    errors
  };
}

// Use Google PageSpeed Insights API (works on Vercel)
async function runPageSpeedAnalysis(url: string): Promise<LighthouseResult> {
  try {
    // PageSpeed Insights API (free, no key needed for basic usage)
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=mobile&category=performance&category=accessibility&category=best-practices&category=seo`;
    
    const response = await fetch(apiUrl, {
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`PageSpeed API error: ${response.status}`);
    }

    const data = await response.json();
    const lighthouse = data.lighthouseResult;

    if (!lighthouse) {
      throw new Error('No Lighthouse result in response');
    }

    const { categories, audits } = lighthouse;

    return {
      performance: Math.round((categories.performance?.score || 0.5) * 100),
      accessibility: Math.round((categories.accessibility?.score || 0.5) * 100),
      bestPractices: Math.round((categories['best-practices']?.score || 0.5) * 100),
      seo: Math.round((categories.seo?.score || 0.5) * 100),
      metrics: {
        lcp: audits['largest-contentful-paint']?.numericValue || 2500,
        fcp: audits['first-contentful-paint']?.numericValue || 1800,
        cls: audits['cumulative-layout-shift']?.numericValue || 0.1,
        tbt: audits['total-blocking-time']?.numericValue || 200,
        si: audits['speed-index']?.numericValue || 3000,
        ttfb: audits['server-response-time']?.numericValue || 800,
        fid: audits['total-blocking-time']?.numericValue || 100
      },
      errors: []
    };
  } catch (error) {
    console.error('PageSpeed API error:', error);
    return getDefaultResult([(error as Error).message]);
  }
}

// Use local Playwright + Lighthouse
async function runLocalLighthouse(url: string): Promise<LighthouseResult> {
  try {
    const { chromium } = await import('playwright');
    const lighthouse = (await import('lighthouse')).default;

    const browser = await chromium.launch({
      headless: true,
      args: [
        '--remote-debugging-port=9222',
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ]
    });

    try {
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

        return {
          performance: Math.round((categories.performance?.score || 0) * 100),
          accessibility: Math.round((categories.accessibility?.score || 0) * 100),
          bestPractices: Math.round((categories['best-practices']?.score || 0) * 100),
          seo: Math.round((categories.seo?.score || 0) * 100),
          metrics: {
            lcp: audits['largest-contentful-paint']?.numericValue || 0,
            fcp: audits['first-contentful-paint']?.numericValue || 0,
            cls: audits['cumulative-layout-shift']?.numericValue || 0,
            tbt: audits['total-blocking-time']?.numericValue || 0,
            si: audits['speed-index']?.numericValue || 0,
            ttfb: audits['server-response-time']?.numericValue || 0,
            fid: audits['total-blocking-time']?.numericValue || 0
          },
          errors: []
        };
      }
    } finally {
      await browser.close();
    }

    return getDefaultResult(['No Lighthouse result']);
  } catch (error) {
    console.error('Local Lighthouse error:', error);
    return getDefaultResult([(error as Error).message]);
  }
}

export async function runLighthouseAnalysis(url: string): Promise<LighthouseResult> {
  if (isVercel) {
    console.log('Running on Vercel - using PageSpeed Insights API');
    return runPageSpeedAnalysis(url);
  }
  
  console.log('Running locally - using Playwright + Lighthouse');
  return runLocalLighthouse(url);
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
