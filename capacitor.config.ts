import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'de.webcheck360.app',
  appName: 'WebCheck360',
  webDir: 'www',
  server: {
    // Mobile apps load the live website
    url: 'https://www.webcheck360.de',
    cleartext: false
  },
  ios: {
    contentInset: 'automatic',
    scheme: 'WebCheck360',
    // Prevent bounce effect
    scrollEnabled: true,
    // Allow universal links
    preferredContentMode: 'mobile'
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false, // Set to true for development
    // Enable hardware acceleration
    loggingBehavior: 'none'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0ea5e9',
      showSpinner: false
    }
  }
};

export default config;
