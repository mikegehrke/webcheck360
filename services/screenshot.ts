// Screenshot service using Playwright locally, external API on Vercel

export interface ScreenshotResult {
  desktop: string | null;
  mobile: string | null;
  errors: string[];
}

const isVercel = process.env.VERCEL === '1' || process.env.VERCEL === 'true';

// Use microlink.io for screenshots on Vercel (free, no API key needed)
async function captureWithMicrolink(url: string, viewport: { width: number; height: number }): Promise<string | null> {
  try {
    const params = new URLSearchParams({
      url: url,
      screenshot: 'true',
      meta: 'false',
      embed: 'screenshot.url',
      viewport: `${viewport.width}x${viewport.height}`,
      type: 'jpeg',
      quality: '80',
    });
    
    const response = await fetch(`https://api.microlink.io?${params.toString()}`, {
      headers: { 'Accept': 'application/json' },
    });
    
    if (!response.ok) {
      console.error(`Microlink error: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    
    if (data.status === 'success' && data.data?.screenshot?.url) {
      const imageResponse = await fetch(data.data.screenshot.url);
      if (imageResponse.ok) {
        const buffer = await imageResponse.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        return `data:image/jpeg;base64,${base64}`;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Microlink screenshot error:', error);
    return null;
  }
}

// Use Playwright locally - SEQUENTIAL to avoid timeout issues
async function captureWithPlaywright(url: string): Promise<{ desktop: string | null; mobile: string | null }> {
  try {
    const { chromium } = await import('playwright');
    
    const browser = await chromium.launch({ headless: true });
    let desktop: string | null = null;
    let mobile: string | null = null;

    try {
      // Desktop Screenshot FIRST
      console.log('Capturing desktop screenshot...');
      const desktopContext = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
      });
      const desktopPage = await desktopContext.newPage();
      
      try {
        await desktopPage.goto(url, { 
          waitUntil: 'domcontentloaded', 
          timeout: 45000 
        });
        // Wait for page to settle
        await desktopPage.waitForTimeout(3000);
        
        const desktopBuffer = await desktopPage.screenshot({ 
          type: 'jpeg', 
          quality: 85,
          fullPage: false 
        });
        desktop = `data:image/jpeg;base64,${desktopBuffer.toString('base64')}`;
        console.log('Desktop screenshot captured!');
      } catch (e) {
        console.error('Desktop screenshot failed:', e);
      }
      await desktopContext.close();

      // Mobile Screenshot SECOND
      console.log('Capturing mobile screenshot...');
      const mobileContext = await browser.newContext({
        viewport: { width: 375, height: 812 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
      });
      const mobilePage = await mobileContext.newPage();
      
      try {
        await mobilePage.goto(url, { 
          waitUntil: 'domcontentloaded', 
          timeout: 45000 
        });
        // Wait for page to settle
        await mobilePage.waitForTimeout(3000);
        
        const mobileBuffer = await mobilePage.screenshot({ 
          type: 'jpeg', 
          quality: 85,
          fullPage: false 
        });
        mobile = `data:image/jpeg;base64,${mobileBuffer.toString('base64')}`;
        console.log('Mobile screenshot captured!');
      } catch (e) {
        console.error('Mobile screenshot failed:', e);
      }
      await mobileContext.close();

    } finally {
      await browser.close();
    }

    return { desktop, mobile };
  } catch (error) {
    console.error('Playwright error:', error);
    return { desktop: null, mobile: null };
  }
}

export async function captureScreenshots(url: string): Promise<ScreenshotResult> {
  const errors: string[] = [];
  let desktop: string | null = null;
  let mobile: string | null = null;

  console.log(`Capturing screenshots for ${url}, isVercel: ${isVercel}`);

  if (isVercel) {
    // Use external API on Vercel
    console.log('Using Microlink API for screenshots...');
    
    try {
      const [desktopResult, mobileResult] = await Promise.all([
        captureWithMicrolink(url, { width: 1920, height: 1080 }),
        captureWithMicrolink(url, { width: 375, height: 812 }),
      ]);
      
      desktop = desktopResult;
      mobile = mobileResult;
      
      if (!desktop) errors.push('Desktop screenshot failed');
      if (!mobile) errors.push('Mobile screenshot failed');
      
    } catch (error) {
      errors.push(`Screenshot API error: ${error}`);
    }
  } else {
    // Use Playwright locally
    console.log('Using Playwright for screenshots...');
    
    try {
      const result = await captureWithPlaywright(url);
      desktop = result.desktop;
      mobile = result.mobile;
      
      if (!desktop) errors.push('Desktop screenshot failed');
      if (!mobile) errors.push('Mobile screenshot failed');
    } catch (error) {
      errors.push(`Playwright error: ${error}`);
    }
  }

  console.log(`Screenshots result: desktop=${desktop ? 'YES' : 'NO'}, mobile=${mobile ? 'YES' : 'NO'}`);

  return { desktop, mobile, errors };
}
