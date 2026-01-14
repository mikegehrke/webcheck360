'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowRight, CheckCircle, Zap, Shield, TrendingUp, Phone, MessageCircle, Menu, X, Send } from 'lucide-react';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { ABTest } from '@/components/ui/ab-test';
import { ProgressiveInfo } from '@/components/ui/progressive-info';

// Lazy load below-fold components
const CookieBanner = dynamic(() => import('@/components/ui/cookie-banner').then(mod => ({ default: mod.CookieBanner })), { ssr: false });
const ExitIntentPopup = dynamic(() => import('@/components/ui/exit-intent-popup').then(mod => ({ default: mod.ExitIntentPopup })), { ssr: false });

export default function HomePage() {
  const t = useTranslations();
  const locale = useLocale();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [mouseLeaveCount, setMouseLeaveCount] = useState(0);

  // Exit intent detection
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !showExitIntent) {
        setMouseLeaveCount(prev => prev + 1);
        
        // Show popup on second mouse leave attempt
        if (mouseLeaveCount >= 1) {
          setShowExitIntent(true);
        } else {
          // Micro-interaction: subtle notification on first leave
          const notification = document.createElement('div');
          notification.innerHTML = '⚡ Warten Sie! Kostenloser Website-Check dauert nur 60 Sekunden...';
          notification.className = 'fixed top-4 right-4 z-50 bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg animate-bounce text-sm';
          document.body.appendChild(notification);
          
          setTimeout(() => {
            document.body.removeChild(notification);
          }, 3000);
        }
      }
    };

    // Add mouse leave detection
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [showExitIntent, mouseLeaveCount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          domain: 'webcheck360.de',
          locale: locale,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send');
      }

      setFormStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch {
      setFormStatus('error');
    }
  };

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
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href={`/${locale}/funnel`} className="text-gray-700 dark:text-gray-300 hover:text-primary-500 transition-colors font-medium">
                {t('home.navigation.analyze')}
              </Link>
              <a href="#kontakt" className="text-gray-700 dark:text-gray-300 hover:text-primary-500 transition-colors font-medium">
                {t('home.navigation.contact')}
              </a>
            </nav>
            
            <div className="flex items-center gap-4">
              {/* Telefonnummer - für besseren Trust Score */}
              <a
                href="tel:+4922039424878"
                className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-500 transition-colors"
                aria-label="Anrufen"
              >
                <Phone className="w-4 h-4" />
                +49 2203 9424878
              </a>
              {/* WhatsApp Button */}
              <a
                href="https://wa.me/491632670137?text=Hallo%2C%20ich%20interessiere%20mich%20f%C3%BCr%20WebCheck360"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
                aria-label="WhatsApp Kontakt"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
              <LanguageSwitcher />
              
              {/* Mobile Menu Button (Hamburger) */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors hamburger menu-toggle"
                aria-label={t('home.navigation.menuOpen')}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 border-t border-gray-200 dark:border-dark-800 mobile-menu mobile-nav">
              <div className="flex flex-col gap-4">
                <Link 
                  href={`/${locale}/funnel`} 
                  className="text-gray-700 dark:text-gray-300 hover:text-primary-500 transition-colors font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('home.navigation.analyze')}
                </Link>
                <a 
                  href="#kontakt" 
                  className="text-gray-700 dark:text-gray-300 hover:text-primary-500 transition-colors font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('home.navigation.contact')}
                </a>
                <a
                  href="tel:+4922039424878"
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary-500 transition-colors font-medium py-2"
                >
                  <Phone className="w-4 h-4" />
                  +49 2203 9424878
                </a>
                <a
                  href="https://wa.me/491632670137?text=Hallo%2C%20ich%20interessiere%20mich%20f%C3%BCr%20WebCheck360"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-green-500 font-medium py-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  {t('home.navigation.whatsappWrite')}
                </a>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Scarcity und Social Proof Sektion */}
          <div className="bg-primary-50 dark:bg-primary-950/20 rounded-2xl p-6 border border-primary-200 dark:border-primary-800 mb-12">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-700 rounded-full animate-pulse"></div>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {t('advanced.socialProof.analyzed', { count: '2.847' })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-orange-800 dark:text-orange-300 font-medium">
                <div className="w-4 h-4 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <span className="text-xs">⚡</span>
                </div>
                {t('advanced.socialProof.timeUrgency')}
              </div>
            </div>
          </div>

          {/* Dynamic Pricing Display */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 rounded-2xl p-6 border border-red-200 dark:border-red-800 mb-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="bg-red-700 text-white px-2 py-1 rounded text-xs font-bold">{t('advanced.dynamicPricing.limited')}</span>
                <span className="text-red-600 dark:text-red-400 font-semibold">{t('advanced.dynamicPricing.normalPrice')}</span>
                <span className="line-through text-gray-500">€199</span>
              </div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {t('advanced.dynamicPricing.todayFree')}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {t('advanced.dynamicPricing.savings')}
              </p>
            </div>
          </div>

          {/* A/B Test Headlines */}
          <ABTest
            testName="homepage_headline"
            variants={[
              {
                id: 'original',
                component: (
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 min-h-[120px] sm:min-h-[140px] lg:min-h-[160px]">
                    <span className="text-orange-500">60 Sekunden</span> – Kostenloser Website-Check · <span className="bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">100% GRATIS</span>
                  </h1>
                ),
                weight: 1
              },
              {
                id: 'urgency',
                component: (
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 min-h-[120px] sm:min-h-[140px] lg:min-h-[160px]">
                    <span className="text-orange-500">60 Sekunden:</span> Kostenloser Website-Check mit Sofort-Ergebnis
                  </h1>
                ),
                weight: 1
              },
              {
                id: 'benefit',
                component: (
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 min-h-[120px] sm:min-h-[140px] lg:min-h-[160px]">
                    Erhalten Sie <span className="bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">mehr Kundenanfragen</span> durch Website-Optimierung
                  </h1>
                ),
                weight: 1
              }
            ]}
          />
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
              className="inline-flex items-center gap-3 px-12 py-6 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-black font-bold text-xl hover:shadow-xl hover:shadow-primary-500/30 transition-all hover:-translate-y-1 min-h-[64px] min-w-[280px] sm:min-w-auto"
              role="button"
              aria-label="Jetzt kostenlos Website analysieren"
            >
              {t('funnel.step1.button')}
              <ArrowRight className="w-6 h-6" />
            </Link>
            
            {/* Secondary CTA - Telefon */}
            <a
              href="tel:+4922039424878"
              className="inline-flex items-center gap-3 px-8 py-5 rounded-xl border-2 border-gray-300 dark:border-dark-700 text-gray-700 dark:text-gray-300 font-semibold hover:border-primary-500 hover:text-primary-500 transition-all min-h-[64px] min-w-[200px] sm:min-w-auto"
              role="button"
              aria-label={t('home.navigation.callNow')}
            >
              <Phone className="w-5 h-5" />
              {t('home.navigation.callNow')}
            </a>
            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/491632670137?text=Hallo%2C%20ich%20interessiere%20mich%20f%C3%BCr%20WebCheck360"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-5 rounded-xl bg-green-700 text-white font-semibold hover:bg-green-800 transition-all min-h-[64px] min-w-[180px] sm:min-w-auto"
              role="button"
              aria-label="WhatsApp schreiben"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 mt-8 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span>{t('advanced.trustBadges.sslEncrypted')}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>{t('advanced.trustBadges.gdprCompliant')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-500" />
              <span>{t('advanced.trustBadges.noRegistration')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-orange-500">★★★★★</span>
              <span>{t('advanced.trustBadges.rating')}</span>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-6xl mx-auto mt-32 grid md:grid-cols-3 gap-8 px-4">
          <div className="bg-white dark:bg-dark-900 rounded-2xl p-8 border border-gray-200 dark:border-dark-800 hover:border-primary-500/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-primary-700" />
            </div>
            <h2 className="text-xl font-semibold mb-2">{t('home.features.performance.title')}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {t('home.features.performance.description')}
            </p>
            <Link
              href={`/${locale}/funnel`}
              className="inline-flex items-center gap-2 text-primary-700 font-semibold hover:gap-3 transition-all hover:text-primary-800"
            >
              {t('home.navigation.testNow')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white dark:bg-dark-900 rounded-2xl p-8 border border-gray-200 dark:border-dark-800 hover:border-primary-500/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-primary-700" />
            </div>
            <h2 className="text-xl font-semibold mb-2">{t('home.features.trust.title')}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {t('home.features.trust.description')}
            </p>
            <Link
              href={`/${locale}/funnel`}
              className="inline-flex items-center gap-2 text-primary-700 font-semibold hover:gap-3 transition-all hover:text-primary-800"
            >
              {t('home.navigation.testNow')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white dark:bg-dark-900 rounded-2xl p-8 border border-gray-200 dark:border-dark-800 hover:border-primary-500/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-primary-700" />
            </div>
            <h2 className="text-xl font-semibold mb-2">{t('home.features.conversion.title')}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {t('home.features.conversion.description')}
            </p>
            <Link
              href={`/${locale}/funnel`}
              className="inline-flex items-center gap-2 text-primary-700 font-semibold hover:gap-3 transition-all hover:text-primary-800"
            >
              {t('home.navigation.testNow')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="max-w-4xl mx-auto mt-20 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {t('home.trust.analyzed')}
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

        {/* Contact Form Section */}
        <section id="kontakt" className="max-w-2xl mx-auto mt-32 px-4">
          <div className="bg-white dark:bg-dark-900 rounded-2xl p-8 border border-gray-200 dark:border-dark-800 shadow-lg">
            <h2 className="text-3xl font-bold text-center mb-2">{t('home.contactForm.title')}</h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
              {t('home.contactForm.subtitle')}
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6 contact-form" name="contact">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('home.contactForm.name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  placeholder={t('home.contactForm.namePlaceholder')}
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('home.contactForm.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  placeholder={t('home.contactForm.emailPlaceholder')}
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('home.contactForm.message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
                  placeholder={t('home.contactForm.messagePlaceholder')}
                />
              </div>
              
              <button
                type="submit"
                disabled={formStatus === 'sending'}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-black font-bold text-lg hover:shadow-xl hover:shadow-primary-500/30 transition-all hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formStatus === 'sending' ? (
                  t('home.contactForm.sending')
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    {t('home.contactForm.submit')}
                  </>
                )}
              </button>
              
              {formStatus === 'success' && (
                <p className="text-center text-green-500 font-medium">
                  ✓ {t('home.contactForm.success')}
                </p>
              )}
              
              {formStatus === 'error' && (
                <p className="text-center text-red-500 font-medium">
                  {t('home.contactForm.error')}
                </p>
              )}
            </form>
          </div>
        </section>
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
            <a href="tel:+4922039424878" className="hover:text-primary-500 transition-colors flex items-center gap-1">
              <Phone className="w-4 h-4" />
              +49 2203 9424878
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

      {/* Cookie Banner */}
      <CookieBanner />
      
      {/* Exit Intent Popup */}
      {showExitIntent && (
        <ExitIntentPopup
          onClose={() => setShowExitIntent(false)}
          onConvert={() => {
            setShowExitIntent(false);
            window.location.href = `/${locale}/funnel`;
          }}
        />
      )}
    </div>
  );
}
