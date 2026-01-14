'use client';

import { useState, useEffect } from 'react';
import { X, Clock, Shield } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ExitIntentPopupProps {
  onClose: () => void;
  onConvert: () => void;
}

export function ExitIntentPopup({ onClose, onConvert }: ExitIntentPopupProps) {
  const t = useTranslations('advanced.exitIntent');
  
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full relative shadow-2xl border-4 border-primary-500 animate-bounce-in">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Urgency Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-orange-100 dark:bg-orange-950 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t('title')}
          </h3>
          <p className="text-lg text-orange-600 dark:text-orange-400 font-semibold">
            {t('subtitle', { seconds: timeLeft })}
          </p>
        </div>

        {/* Value Props */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <div className="w-6 h-6 bg-green-700 rounded-full flex items-center justify-center text-white text-sm">✓</div>
            <span className="text-green-800 dark:text-green-200 font-medium">{t('benefits.free')}</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">⚡</div>
            <span className="text-blue-800 dark:text-blue-200 font-medium">{t('benefits.fast')}</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
            <Shield className="w-6 h-6 text-purple-500" />
            <span className="text-purple-800 dark:text-purple-200 font-medium">{t('benefits.secure')}</span>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={async () => {
            // Track exit intent conversion
            try {
              await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  name: 'Exit Intent User',
                  email: 'exitintent@tracking.local',
                  message: 'Exit Intent Popup - User showed interest',
                  domain: window.location.hostname,
                  locale: document.documentElement.lang || 'de'
                })
              });
            } catch (error) {
              console.log('Analytics tracking failed:', error);
            }
            onConvert();
          }}
          className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-black font-bold text-lg rounded-xl hover:shadow-xl transition-all"
        >
          {t('cta')}
        </button>
      </div>
    </div>
  );
}