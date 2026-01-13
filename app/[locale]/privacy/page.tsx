'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('legal.privacy');
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
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {t('intro')}
          </p>

          <section>
            <h2 className="text-xl font-semibold mb-3">{t('responsible')}</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Mike Gehrke<br />
              Digital Solutions<br />
              Köln, Deutschland<br />
              E-Mail: gehrkemike2@gmail.com
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">{t('dataCollection')}</h2>
            <p className="text-gray-600 dark:text-gray-400">
              {t('dataCollectionText')}
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mt-2 space-y-1">
              <li>Website-URL (für die Analyse)</li>
              <li>Name, E-Mail, Telefon (wenn freiwillig angegeben)</li>
              <li>Technische Daten (IP-Adresse, Browser-Typ)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">{t('cookies')}</h2>
            <p className="text-gray-600 dark:text-gray-400">
              {t('cookiesText')}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">{t('rights')}</h2>
            <p className="text-gray-600 dark:text-gray-400">
              {t('rightsText')}
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mt-2 space-y-1">
              <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
              <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
              <li>Recht auf Löschung (Art. 17 DSGVO)</li>
              <li>Recht auf Einschränkung (Art. 18 DSGVO)</li>
              <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
              <li>Widerspruchsrecht (Art. 21 DSGVO)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">{t('contact')}</h2>
            <p className="text-gray-600 dark:text-gray-400">
              {t('contactText')}
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              E-Mail: <a href="mailto:gehrkemike2@gmail.com" className="text-primary-600 hover:underline">gehrkemike2@gmail.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
