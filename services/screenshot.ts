// Screenshot service - Vercel compatible
// No Playwright - just placeholder for Vercel deployment

export interface ScreenshotResult {
  desktop: string | null;
  mobile: string | null;
  errors: string[];
}

export async function captureScreenshots(url: string): Promise<ScreenshotResult> {
  // Screenshots are disabled on Vercel (no browser available)
  // In a full production setup, you'd use an external screenshot API like:
  // - screenshotapi.net
  // - urlbox.io
  // - apiflash.com
  
  console.log(`Screenshot requested for ${url} - returning placeholder`);
  
  return {
    desktop: null,
    mobile: null,
    errors: ['Screenshots not available in serverless environment']
  };
}
