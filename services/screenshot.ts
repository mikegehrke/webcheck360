// Screenshot service with Vercel compatibility
// Playwright doesn't work on Vercel - use external API or skip

export interface ScreenshotResult {
  desktop: string | null;
  mobile: string | null;
  errors: string[];
}

// Check if we're on Vercel (no Playwright available)
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV !== undefined;

export async function captureScreenshots(url: string): Promise<ScreenshotResult> {
  // On Vercel: Skip screenshots (Playwright not available)
  if (isVercel) {
    console.log('Running on Vercel - screenshots disabled');
    return {
      desktop: null,
      mobile: null,
      errors: ['Screenshots are not available on Vercel deployment']
    };
  }

  // Local development: Use Playwright
  try {
    const { chromium } = await import('playwright');
    const path = await import('path');
    const fs = await import('fs');
    const { v4: uuidv4 } = await import('uuid');

    const SCREENSHOT_DIR = path.join(process.cwd(), 'public', 'screenshots');
    const TIMEOUT = parseInt(process.env.SCREENSHOT_TIMEOUT || '30000');

    // Ensure screenshot directory exists
    if (!fs.existsSync(SCREENSHOT_DIR)) {
      fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
    }

    const browser = await chromium.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const errors: string[] = [];
    let desktopPath: string | null = null;
    let mobilePath: string | null = null;

    try {
      const context = await browser.newContext();
      const page = await context.newPage();

      // Desktop screenshot
      try {
        await page.setViewportSize({ width: 1920, height: 1080 });
        await page.goto(url, { waitUntil: 'networkidle', timeout: TIMEOUT });
        
        const desktopFilename = `desktop-${uuidv4()}.png`;
        const desktopFullPath = path.join(SCREENSHOT_DIR, desktopFilename);
        await page.screenshot({ path: desktopFullPath, fullPage: false });
        desktopPath = `/screenshots/${desktopFilename}`;
      } catch (err) {
        console.error('Desktop screenshot error:', err);
        errors.push(`Desktop: ${(err as Error).message}`);
      }

      // Mobile screenshot
      try {
        await page.setViewportSize({ width: 390, height: 844 });
        await page.goto(url, { waitUntil: 'networkidle', timeout: TIMEOUT });
        
        const mobileFilename = `mobile-${uuidv4()}.png`;
        const mobileFullPath = path.join(SCREENSHOT_DIR, mobileFilename);
        await page.screenshot({ path: mobileFullPath, fullPage: false });
        mobilePath = `/screenshots/${mobileFilename}`;
      } catch (err) {
        console.error('Mobile screenshot error:', err);
        errors.push(`Mobile: ${(err as Error).message}`);
      }

    } finally {
      await browser.close();
    }

    return {
      desktop: desktopPath,
      mobile: mobilePath,
      errors
    };

  } catch (err) {
    console.error('Screenshot service error:', err);
    return {
      desktop: null,
      mobile: null,
      errors: [(err as Error).message]
    };
  }
}
