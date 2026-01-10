'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Zap, Shield, TrendingUp } from 'lucide-react';
import { LanguageSwitcher } from '@/components/ui/language-switcher';

export default function HomePage() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-dark-950 dark:to-dark-900">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass border-b border-gray-200 dark:border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <span className="text-sm font-bold text-black">W3</span>
              </div>
              <span className="font-bold text-xl">WebCheck360</span>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            {t('funnel.title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            {t('funnel.subtitle')}
          </p>

          {/* Bullets */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <CheckCircle className="w-5 h-5 text-primary-500" />
                <span>{t(`funnel.bullets.${num}`)}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Link
            href={`/${locale}/funnel`}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-black font-semibold text-lg hover:shadow-lg hover:shadow-primary-500/25 transition-all hover:-translate-y-0.5"
          >
            {t('funnel.step1.button')}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Features */}
        <div className="max-w-6xl mx-auto mt-32 grid md:grid-cols-3 gap-8 px-4">
          <div className="bg-white dark:bg-dark-900 rounded-2xl p-8 border border-gray-200 dark:border-dark-800 hover:border-primary-500/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-primary-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Performance</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Ladezeit, Core Web Vitals und Mobile-Optimierung auf einen Blick.
            </p>
          </div>

          <div className="bg-white dark:bg-dark-900 rounded-2xl p-8 border border-gray-200 dark:border-dark-800 hover:border-primary-500/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-primary-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Vertrauen</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Impressum, Datenschutz, HTTPS und wichtige Trust-Faktoren.
            </p>
          </div>

          <div className="bg-white dark:bg-dark-900 rounded-2xl p-8 border border-gray-200 dark:border-dark-800 hover:border-primary-500/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-primary-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Conversion</h3>
            <p className="text-gray-600 dark:text-gray-400">
              CTAs, Kontaktmöglichkeiten und Nutzerführung analysiert.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-dark-800 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>{t('footer.copyright')}</p>
          <div className="flex items-center justify-center gap-4 mt-2">
            <Link href={`/${locale}/privacy`} className="hover:text-primary-500 transition-colors">
              {t('footer.privacy')}
            </Link>
            <Link href={`/${locale}/imprint`} className="hover:text-primary-500 transition-colors">
              {t('footer.imprint')}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
