import { chromium, Browser, Page } from 'playwright';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const SCREENSHOT_DIR = path.join(process.cwd(), 'public', 'screenshots');
const TIMEOUT = parseInt(process.env.SCREENSHOT_TIMEOUT || '30000');

// Ensure screenshot directory exists
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

export interface ScreenshotResult {
  desktop: string | null;
  mobile: string | null;
  errors: string[];
}

export interface ViewportConfig {
  width: number;
  height: number;
  deviceScaleFactor?: number;
  isMobile?: boolean;
}

const DESKTOP_VIEWPORT: ViewportConfig = {
  width: 1920,
  height: 1080,
  deviceScaleFactor: 1,
  isMobile: false
};

const MOBILE_VIEWPORT: ViewportConfig = {
  width: 390,
  height: 844,
  deviceScaleFactor: 2,
  isMobile: true
};

async function takeScreenshot(
  page: Page,
  url: string,
  viewport: ViewportConfig,
  filename: string
): Promise<string | null> {
  try {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    
    // Navigate with timeout
    await page.goto(url, { 
      waitUntil: 'networkidle',
      timeout: TIMEOUT 
    });
    
    // Wait for any lazy-loaded content
    await page.waitForTimeout(2000);
    
    // Scroll down to trigger lazy loading, then back up
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(1000);
    await page.evaluate(() => {
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(500);
    
    // Take screenshot
    const filepath = path.join(SCREENSHOT_DIR, filename);
    await page.screenshot({ 
      path: filepath,
      fullPage: false,
      type: 'jpeg',
      quality: parseInt(process.env.SCREENSHOT_QUALITY || '80')
    });
    
    return `/screenshots/${filename}`;
  } catch (error) {
    console.error(`Screenshot error for ${url}:`, error);
    return null;
  }
}

export async function captureScreenshots(url: string): Promise<ScreenshotResult> {
  const result: ScreenshotResult = {
    desktop: null,
    mobile: null,
    errors: []
  };
  
  let browser: Browser | null = null;
  
  try {
    browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });
    
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      locale: 'de-DE',
      timezoneId: 'Europe/Berlin'
    });
    
    const page = await context.newPage();
    
    // Block unnecessary resources for faster loading
    await page.route('**/*', (route) => {
      const resourceType = route.request().resourceType();
      if (['media', 'font'].includes(resourceType)) {
        route.abort();
      } else {
        route.continue();
      }
    });
    
    const id = uuidv4();
    
    // Desktop screenshot
    result.desktop = await takeScreenshot(
      page, 
      url, 
      DESKTOP_VIEWPORT, 
      `${id}-desktop.jpg`
    );
    if (!result.desktop) {
      result.errors.push('Desktop screenshot failed');
    }
    
    // Mobile screenshot
    result.mobile = await takeScreenshot(
      page, 
      url, 
      MOBILE_VIEWPORT, 
      `${id}-mobile.jpg`
    );
    if (!result.mobile) {
      result.errors.push('Mobile screenshot failed');
    }
    
    await context.close();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    result.errors.push(`Browser error: ${message}`);
    console.error('Screenshot service error:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
  
  return result;
}

export async function deleteScreenshots(desktop: string | null, mobile: string | null): Promise<void> {
  const files = [desktop, mobile].filter(Boolean) as string[];
  
  for (const file of files) {
    const filepath = path.join(process.cwd(), 'public', file);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
  }
}
