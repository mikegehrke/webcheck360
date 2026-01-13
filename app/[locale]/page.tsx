'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Zap, Shield, TrendingUp, Phone, MessageCircle } from 'lucide-react';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { CookieBanner } from '@/components/ui/cookie-banner';

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
            <div className="flex items-center gap-4">
              {/* Telefonnummer - für besseren Trust Score */}
              <a
                href="tel:+491632670137"
                className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-500 transition-colors"
                aria-label="Anrufen"
              >
                <Phone className="w-4 h-4" />
                0163 267 0137
              </a>
              {/* WhatsApp Button */}
              <a
                href="https://wa.me/491632670137?text=Hallo%2C%20ich%20interessiere%20mich%20f%C3%BCr%20WebCheck360"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                aria-label="WhatsApp Kontakt"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
              <LanguageSwitcher />
            </div>
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

          {/* CTA Button - größer und auffälliger */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/${locale}/funnel`}
              className="inline-flex items-center gap-2 px-10 py-5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-black font-bold text-xl hover:shadow-xl hover:shadow-primary-500/30 transition-all hover:-translate-y-1 min-h-[60px]"
              role="button"
              aria-label="Jetzt kostenlos Website analysieren"
            >
              {t('funnel.step1.button')}
              <ArrowRight className="w-6 h-6" />
            </Link>
            
            {/* Secondary CTA - Telefon */}
            <a
              href="tel:+491632670137"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-xl border-2 border-gray-300 dark:border-dark-700 text-gray-700 dark:text-gray-300 font-semibold hover:border-primary-500 hover:text-primary-500 transition-all min-h-[60px]"
              role="button"
              aria-label="Jetzt anrufen"
            >
              <Phone className="w-5 h-5" />
              Jetzt anrufen
            </a>
            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/491632670137?text=Hallo%2C%20ich%20interessiere%20mich%20f%C3%BCr%20WebCheck360"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition-all min-h-[60px]"
              role="button"
              aria-label="WhatsApp schreiben"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </a>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-6xl mx-auto mt-32 grid md:grid-cols-3 gap-8 px-4">
          <div className="bg-white dark:bg-dark-900 rounded-2xl p-8 border border-gray-200 dark:border-dark-800 hover:border-primary-500/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-primary-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('home.features.performance.title')}</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t('home.features.performance.description')}
            </p>
          </div>

          <div className="bg-white dark:bg-dark-900 rounded-2xl p-8 border border-gray-200 dark:border-dark-800 hover:border-primary-500/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-primary-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('home.features.trust.title')}</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t('home.features.trust.description')}
            </p>
          </div>

          <div className="bg-white dark:bg-dark-900 rounded-2xl p-8 border border-gray-200 dark:border-dark-800 hover:border-primary-500/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-primary-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('home.features.conversion.title')}</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t('home.features.conversion.description')}
            </p>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="max-w-4xl mx-auto mt-20 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Bereits über 500+ Websites analysiert
          </p>
          <div className="flex items-center justify-center gap-8 text-gray-400">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-2 text-gray-600 dark:text-gray-400 font-medium">4.9/5</span>
            </div>
          </div>
        </div>
      </main>

      {/* Cookie Banner */}
      <CookieBanner />

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
          {/* Contact Info in Footer */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <a href="tel:+491632670137" className="hover:text-primary-500 transition-colors flex items-center gap-1">
              <Phone className="w-4 h-4" />
              0163 267 0137
            </a>
            <a href="mailto:kontakt@mg-digital-solutions.com" className="hover:text-primary-500 transition-colors flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              kontakt@mg-digital-solutions.com
            </a>
            <a 
              href="https://wa.me/491632670137" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-green-500 transition-colors flex items-center gap-1"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
