'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { X, Cookie } from 'lucide-react';
import Link from 'next/link';

export function CookieBanner() {
  const t = useTranslations();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAccepted = localStorage.getItem('cookieConsent');
    if (!hasAccepted) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('cookieConsent', 'all');
    setIsVisible(false);
  };

  const acceptEssential = () => {
    localStorage.setItem('cookieConsent', 'essential');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 animate-in slide-in-from-bottom duration-300">
      <div className="max-w-4xl mx-auto bg-white dark:bg-dark-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-dark-700 p-6">
        <div className="flex items-start gap-4">
          <div className="hidden sm:flex w-12 h-12 rounded-xl bg-primary-500/10 items-center justify-center flex-shrink-0">
            <Cookie className="w-6 h-6 text-primary-500" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {t('cookies.title')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {t('cookies.description')}{' '}
              <Link href="/privacy" className="text-primary-500 hover:underline">
                {t('cookies.learnMore')}
              </Link>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={acceptAll}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-black font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition-all min-h-[48px]"
                aria-label="Alle Cookies akzeptieren"
              >
                {t('cookies.acceptAll')}
              </button>
              <button
                onClick={acceptEssential}
                className="px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-dark-600 text-gray-700 dark:text-gray-300 font-semibold hover:border-primary-500 transition-all min-h-[48px]"
                aria-label="Nur notwendige Cookies akzeptieren"
              >
                {t('cookies.acceptEssential')}
              </button>
            </div>
          </div>
          
          <button
            onClick={acceptEssential}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            aria-label="Cookie-Banner schließen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
