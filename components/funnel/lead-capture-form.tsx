'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Mail, User, ArrowRight, X, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { MLLeadScoring } from '@/lib/ml-lead-scoring';
import { scheduleEmailSequence } from '@/lib/smart-retargeting';

interface LeadCaptureFormProps {
  auditId: string;
  onSuccess?: () => void;
  onSkip?: () => void;
}

export function LeadCaptureForm({ auditId, onSuccess, onSkip }: LeadCaptureFormProps) {
  const t = useTranslations('funnel.step4');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!consent) {
      setError('Bitte stimmen Sie der Datenschutzerklärung zu');
      return;
    }

    setIsLoading(true);

    try {
      // Calculate lead score before submission
      const leadScoringData = {
        timeOnSite: Date.now() - (parseInt(sessionStorage.getItem('sessionStart') || '0')),
        pageViews: parseInt(sessionStorage.getItem('pageViews') || '1'),
        hasEmail: true,
        deviceType: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' as const : 'desktop' as const,
        trafficSource: document.referrer ? 'referral' : 'direct',
        hasInteracted: true,
        websiteScore: parseInt(sessionStorage.getItem('lastAnalysisScore') || '50')
      };

      const leadScore = MLLeadScoring.calculateScore(leadScoringData);

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          audit_id: auditId, 
          name, 
          email, 
          consent,
          lead_score: leadScore.score,
          lead_category: leadScore.category
        }),
      });

      if (!response.ok) {
        throw new Error('Lead konnte nicht gespeichert werden');
      }

      // Schedule smart email sequence based on score
      scheduleEmailSequence(email, leadScoringData.websiteScore, {
        name,
        score: leadScoringData.websiteScore,
        category: leadScore.category,
        industry: sessionStorage.getItem('industry') || 'general'
      });

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-black" />
          </div>
          <h2 className="text-2xl font-bold mb-2">{t('title')}</h2>
          <p className="text-gray-500 dark:text-gray-400">{t('description')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label={t('nameLabel')}
            placeholder={t('namePlaceholder')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            icon={<User className="w-5 h-5" />}
          />

          <Input
            label={t('emailLabel')}
            type="email"
            placeholder={t('emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="w-5 h-5" />}
          />

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {t('consentLabel')}
            </span>
          </label>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <div className="flex flex-col gap-3">
            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              isLoading={isLoading}
            >
              {t('button')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button 
              type="button"
              variant="ghost"
              className="w-full"
              onClick={onSkip}
            >
              {t('skipButton')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
