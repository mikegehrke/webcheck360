'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Globe, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { isValidUrl } from '@/lib/utils';

interface FunnelStep1Props {
  locale: string;
}

export function FunnelStep1({ locale }: FunnelStep1Props) {
  const t = useTranslations('funnel.step1');
  const router = useRouter();
  
  const [url, setUrl] = useState('');
  const [industry, setIndustry] = useState('');
  const [goal, setGoal] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('Bitte geben Sie eine URL ein');
      return;
    }

    if (!isValidUrl(url)) {
      setError('Bitte geben Sie eine gültige URL ein');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, industry, goal }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analyse fehlgeschlagen');
      }

      router.push(`/${locale}/results/${data.auditId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mx-auto mb-4">
            <Globe className="w-8 h-8 text-black" />
          </div>
          <h2 className="text-2xl font-bold mb-2">{t('title')}</h2>
          <p className="text-gray-500 dark:text-gray-400">{t('description')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label={t('urlLabel')}
            placeholder={t('urlPlaceholder')}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            error={error}
            icon={<Globe className="w-5 h-5" />}
            autoFocus
          />

          <Input
            label={t('industryLabel')}
            placeholder={t('industryPlaceholder')}
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
          />

          <Input
            label={t('goalLabel')}
            placeholder={t('goalPlaceholder')}
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />

          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            isLoading={isLoading}
          >
            {isLoading ? (
              'Analysiere...'
            ) : (
              <>
                {t('button')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
