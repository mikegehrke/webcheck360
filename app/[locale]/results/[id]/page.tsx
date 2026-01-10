import { notFound } from 'next/navigation';
import { getAuditById } from '@/lib/db';
import { ResultsDisplayWrapper } from '@/components/results/results-display-wrapper';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import Link from 'next/link';

interface ResultsPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { locale, id } = await params;
  const audit = await getAuditById(id);

  if (!audit) {
    notFound();
  }

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
      <main className="pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <ResultsDisplayWrapper 
            audit={audit} 
            locale={locale as 'de' | 'en'} 
          />
        </div>
      </main>
    </div>
  );
}
