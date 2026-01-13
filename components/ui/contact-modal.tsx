'use client';

import { useState } from 'react';
import { X, Send, Loader2, CheckCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditId: string;
  domain: string;
  score: number;
  locale: 'de' | 'en';
}

export function ContactModal({ isOpen, onClose, auditId, domain, score, locale }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const t = locale === 'de' ? {
    title: 'Kostenloses Beratungsgespräch',
    subtitle: 'Lassen Sie uns besprechen, wie wir Ihre Website verbessern können.',
    name: 'Ihr Name',
    namePlaceholder: 'Max Mustermann',
    email: 'E-Mail',
    emailPlaceholder: 'max@beispiel.de',
    phone: 'Telefon (optional)',
    phonePlaceholder: '+49 123 456789',
    message: 'Ihre Nachricht (optional)',
    messagePlaceholder: 'Wann kann ich Sie am besten erreichen?',
    submit: 'Anfrage senden',
    sending: 'Wird gesendet...',
    successTitle: 'Vielen Dank!',
    successMessage: 'Ihre Anfrage wurde gesendet. Ich melde mich innerhalb von 24 Stunden bei Ihnen.',
    close: 'Schließen',
    website: 'Meine Website besuchen',
    error: 'Fehler beim Senden. Bitte versuchen Sie es erneut.',
    required: 'Pflichtfeld'
  } : {
    title: 'Free Consultation',
    subtitle: 'Let\'s discuss how we can improve your website.',
    name: 'Your Name',
    namePlaceholder: 'John Doe',
    email: 'Email',
    emailPlaceholder: 'john@example.com',
    phone: 'Phone (optional)',
    phonePlaceholder: '+1 234 567890',
    message: 'Your Message (optional)',
    messagePlaceholder: 'When is the best time to reach you?',
    submit: 'Send Request',
    sending: 'Sending...',
    successTitle: 'Thank you!',
    successMessage: 'Your request has been sent. I will get back to you within 24 hours.',
    close: 'Close',
    website: 'Visit my website',
    error: 'Error sending. Please try again.',
    required: 'Required'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          auditId,
          domain,
          score,
          locale
        })
      });

      if (!response.ok) throw new Error('Failed to send');
      
      setIsSuccess(true);
    } catch {
      setError(t.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white dark:bg-dark-900 rounded-2xl shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          /* Success State */
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold mb-2">{t.successTitle}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{t.successMessage}</p>
            <div className="space-y-3">
              <Button onClick={onClose} className="w-full">
                {t.close}
              </Button>
              <a
                href="https://mg-digitalsolutions-one.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 text-primary-600 hover:text-primary-700 font-medium"
              >
                {t.website}
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="p-6 pb-0">
              <h3 className="text-2xl font-bold mb-1">{t.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{t.subtitle}</p>
              
              {/* Website Badge */}
              <div className="mt-4 p-3 bg-gray-50 dark:bg-dark-800 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Analysierte Website</p>
                  <p className="font-medium">{domain}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Score</p>
                  <p className="font-bold text-lg">{score}/100</p>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  {t.name} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder={t.namePlaceholder}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  {t.email} <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder={t.emailPlaceholder}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium mb-1.5">{t.phone}</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder={t.phonePlaceholder}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium mb-1.5">{t.message}</label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder={t.messagePlaceholder}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>

              {/* Error */}
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 pt-0 space-y-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {t.sending}
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    {t.submit}
                  </>
                )}
              </Button>
              
              <a
                href="https://mg-digitalsolutions-one.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2 text-sm text-gray-500 hover:text-primary-600 transition-colors"
              >
                {t.website}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
