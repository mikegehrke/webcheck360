// Screenshot service using Playwright locally, Microlink API on Vercel

export interface ScreenshotResult {
  desktop: string | null;
  mobile: string | null;
  errors: string[];
}

const isVercel = process.env.VERCEL === '1' || process.env.VERCEL === 'true';

// Use microlink.io for screenshots on Vercel
async function captureWithMicrolink(url: string, isMobile: boolean): Promise<string | null> {
  try {
    const width = isMobile ? 375 : 1280;
    const height = isMobile ? 812 : 800;
    
    // Microlink API returns image directly when using screenshot=true
    const params = new URLSearchParams({
      url: url,
      screenshot: 'true',
      meta: 'false',
      'viewport.width': width.toString(),
      'viewport.height': height.toString(),
      'viewport.isMobile': isMobile.toString(),
      type: 'jpeg',
      quality: '80',
    });
    
    const apiUrl = `https://api.microlink.io?${params.toString()}`;
    console.log(`Microlink request: ${apiUrl}`);
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      console.error(`Microlink error: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    console.log(`Microlink response status: ${data.status}`);
    
    if (data.status === 'success' && data.data?.screenshot?.url) {
      const screenshotUrl = data.data.screenshot.url;
      console.log(`Screenshot URL: ${screenshotUrl}`);
      
      // Fetch the actual image
      const imageResponse = await fetch(screenshotUrl);
      if (imageResponse.ok) {
        const buffer = await imageResponse.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        const contentType = imageResponse.headers.get('content-type') || 'image/png';
        return `data:${contentType};base64,${base64}`;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Microlink screenshot error:', error);
    return null;
  }
}

// Use Playwright locally
async function captureWithPlaywright(url: string): Promise<{ desktop: string | null; mobile: string | null }> {
  try {
    const { chromium } = await import('playwright');
    
    const browser = await chromium.launch({ headless: true });
    let desktop: string | null = null;
    let mobile: string | null = null;

    try {
      // Desktop Screenshot
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

      // Mobile Screenshot
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
    // Use Microlink API on Vercel
    console.log('Using Microlink API for screenshots...');
    
    try {
      // Capture sequentially to avoid rate limiting
      desktop = await captureWithMicrolink(url, false);
      if (!desktop) errors.push('Desktop screenshot failed');
      
      mobile = await captureWithMicrolink(url, true);
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
