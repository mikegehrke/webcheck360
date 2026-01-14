import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true
});

export const metadata: Metadata = {
  title: 'WebCheck360 - Kostenloser Website-Check in 60 Sekunden',
  description: 'Analysieren Sie Ihre Website kostenlos: Performance, SEO, Mobile UX und Conversion. Erhalten Sie sofort klare Handlungsempfehlungen.',
  keywords: ['Website Check', 'SEO Analyse', 'Performance Test', 'Website Optimierung', 'Kostenlos'],
  authors: [{ name: 'MG Digital Solutions' }],
  creator: 'MG Digital Solutions',
  publisher: 'MG Digital Solutions',
  metadataBase: new URL('https://webcheck360.de'),
  alternates: {
    canonical: 'https://webcheck360.de',
    languages: {
      'de': 'https://webcheck360.de/de',
      'en': 'https://webcheck360.de/en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: 'https://webcheck360.de',
    siteName: 'WebCheck360',
    title: 'WebCheck360 - Kostenloser Website-Check',
    description: 'Analysieren Sie Ihre Website kostenlos in 60 Sekunden. Performance, SEO, Mobile UX und Conversion.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'WebCheck360 - Website Analyse Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WebCheck360 - Kostenloser Website-Check',
    description: 'Analysieren Sie Ihre Website kostenlos in 60 Sekunden.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
