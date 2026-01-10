import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { FunnelStep1 } from '@/components/funnel/funnel-step1';

export default function FunnelPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-dark-950 dark:to-dark-900">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass border-b border-gray-200 dark:border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href={`/${locale}`} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <span className="text-sm font-bold text-black">W3</span>
              </div>
              <span className="font-bold text-xl">WebCheck360</span>
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              {t('funnel.title')}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {t('funnel.subtitle')}
            </p>
          </div>

          <FunnelStep1 locale={locale} />
        </div>
      </main>
    </div>
  );
}
