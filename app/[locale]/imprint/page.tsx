'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ImprintPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('legal.imprint');
  const tCommon = useTranslations('common');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link 
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          {tCommon('back')}
        </Link>

        <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>

        <div className="bg-white dark:bg-dark-900 rounded-2xl p-8 shadow-sm space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">{t('according')}</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Mike Gehrke<br />
              Digital Solutions<br />
              Köln, Deutschland
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">{t('contact')}</h2>
            <p className="text-gray-600 dark:text-gray-400">
              {t('email')}: gehrkemike2@gmail.com<br />
              {t('phone')}: +49 163 267 0137
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">{t('responsible')}</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Mike Gehrke<br />
              Köln, Deutschland
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">{t('dispute')}</h2>
            <p className="text-gray-600 dark:text-gray-400">
              {t('disputeText')}
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              <a 
                href="https://ec.europa.eu/consumers/odr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-600 hover:underline"
              >
                https://ec.europa.eu/consumers/odr
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
