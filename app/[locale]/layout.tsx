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

// Schema.org Structured Data - WebApplication
const webAppSchema = {
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
    url: 'https://www.mg-digital-solutions.de',
    logo: 'https://webcheck360.de/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+49-2203-9424878',
      contactType: 'customer service',
      availableLanguage: ['German', 'English'],
      email: 'hallo@mg-digital-solutions.de',
    },
    sameAs: [
      'https://wa.me/491632670137',
      'https://www.mg-digital-solutions.de'
    ],
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '127',
  },
};

// LocalBusiness Schema für Trust
const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'WebCheck360 by MG Digital Solutions',
  description: 'Kostenloser Website-Analyse Service für Performance, SEO, Mobile UX und Conversion',
  url: 'https://webcheck360.de',
  telephone: '+49-2203-9424878',
  email: 'hallo@mg-digital-solutions.de',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Adolf-Kalsbach-Straße 40A',
    addressLocality: 'Köln',
    postalCode: '51147',
    addressCountry: 'DE'
  },
  openingHours: 'Mo-Fr 09:00-18:00',
  priceRange: 'Kostenlos',
  areaServed: {
    '@type': 'Country',
    name: 'Germany'
  }
};

// FAQ Schema für SEO
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Was kostet der Website-Check?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Der WebCheck360 ist komplett kostenlos. Sie erhalten eine vollständige Analyse Ihrer Website mit Performance, SEO, Mobile UX und Conversion Score.'
      }
    },
    {
      '@type': 'Question', 
      name: 'Wie lange dauert die Analyse?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Die Analyse dauert nur etwa 60 Sekunden. Sie erhalten sofort detaillierte Ergebnisse und konkrete Handlungsempfehlungen.'
      }
    },
    {
      '@type': 'Question',
      name: 'Was wird bei der Website-Analyse geprüft?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Wir prüfen Performance (Ladezeit, Core Web Vitals), SEO (Meta-Tags, Struktur), Mobile UX (Responsive Design), Vertrauen (SSL, Impressum) und Conversion (CTAs, Formulare).'
      }
    }
  ]
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
          id="webapp-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
        />
        <Script
          id="localbusiness-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <Script
          id="faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
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
