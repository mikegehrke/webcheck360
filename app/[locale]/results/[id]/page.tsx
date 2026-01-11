'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ResultsDisplayWrapper } from '@/components/results/results-display-wrapper';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { Button } from '@/components/ui/button';
import { Search, ArrowLeft, Loader2 } from 'lucide-react';

interface AuditData {
  id: string;
  url: string;
  domain: string;
  score_total: number;
  scores: {
    performance: number;
    mobile_ux: number;
    seo: number;
    trust: number;
    conversion: number;
  };
  issues: any[];
  screenshots: {
    desktop: string | null;
    mobile: string | null;
  };
  industry?: string;
  goal?: string;
  created_at: string;
}

export default function ResultsPage() {
  const params = useParams();
  const locale = params.locale as string;
  const id = params.id as string;
  
  const [audit, setAudit] = useState<AuditData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // Try to get audit from sessionStorage
    const storedAudit = sessionStorage.getItem(`audit_${id}`);
    
    if (storedAudit) {
      try {
        setAudit(JSON.parse(storedAudit));
      } catch {
        setNotFound(true);
      }
    } else {
      setNotFound(true);
    }
    
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-dark-950 dark:to-dark-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-500 mx-auto mb-4" />
          <p className="text-gray-500">Lade Ergebnisse...</p>
        </div>
      </div>
    );
  }

  if (notFound || !audit) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-dark-950 dark:to-dark-900">
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

        <main className="pt-32 pb-20 px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">⚠️</span>
            </div>
            <h1 className="text-2xl font-bold mb-4">
              {locale === 'de' ? 'Analyse nicht gefunden' : 'Analysis not found'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              {locale === 'de' 
                ? 'Diese Analyse existiert nicht mehr oder der Link ist ungültig. Starten Sie eine neue Analyse für Ihre Website.'
                : 'This analysis no longer exists or the link is invalid. Start a new analysis for your website.'}
            </p>
            <div className="space-y-3">
              <Link href={`/${locale}/funnel`}>
                <Button className="w-full" size="lg">
                  <Search className="w-5 h-5 mr-2" />
                  {locale === 'de' ? 'Neue Analyse starten' : 'Start new analysis'}
                </Button>
              </Link>
              <Link href={`/${locale}`}>
                <Button variant="outline" className="w-full" size="lg">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  {locale === 'de' ? 'Zur Startseite' : 'Back to home'}
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
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
            audit={audit as any} 
            locale={locale as 'de' | 'en'} 
          />
        </div>
      </main>
    </div>
  );
}
