import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import { locales, Locale } from '@/i18n';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

// Schema.org Structured Data
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'WebCheck360',
  description: 'Kostenloser Website-Check in 60 Sekunden. Analysieren Sie Performance, SEO, Mobile UX und Conversion.',
  url: 'https://webcheck360.de',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'EUR',
  },
  provider: {
    '@type': 'Organization',
    name: 'MG Digital Solutions',
    url: 'https://www.mg-digital-solutions.com',
    logo: 'https://webcheck360.de/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+49-163-267-0137',
      contactType: 'customer service',
      availableLanguage: ['German', 'English'],
      email: 'kontakt@mg-digital-solutions.com',
    },
    sameAs: [
      'https://wa.me/491632670137'
    ],
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '127',
  },
};

export default async function LocaleLayout({
  children,
  params
}: Props) {
  const { locale } = await params;
  
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="canonical" href={`https://webcheck360.de/${locale}`} />
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
