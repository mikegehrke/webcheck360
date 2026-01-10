'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle, Circle, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface AnalysisStep {
  id: string;
  label: string;
  completed: boolean;
}

interface FunnelStep2Props {
  auditId: string;
  onComplete?: () => void;
}

export function FunnelStep2({ auditId, onComplete }: FunnelStep2Props) {
  const t = useTranslations('funnel.step2');
  
  const [steps, setSteps] = useState<AnalysisStep[]>([
    { id: 'mobile', label: t('checks.mobile'), completed: false },
    { id: 'speed', label: t('checks.speed'), completed: false },
    { id: 'seo', label: t('checks.seo'), completed: false },
    { id: 'trust', label: t('checks.trust'), completed: false },
    { id: 'conversion', label: t('checks.conversion'), completed: false },
  ]);

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Simulate analysis progress
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length) {
          clearInterval(interval);
          onComplete?.();
          return prev;
        }
        
        setSteps((prevSteps) => 
          prevSteps.map((step, i) => 
            i === prev ? { ...step, completed: true } : step
          )
        );
        
        return prev + 1;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [steps.length, onComplete]);

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary-500/10 flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          </div>
          <h2 className="text-2xl font-bold mb-2">{t('title')}</h2>
          <p className="text-gray-500 dark:text-gray-400">{t('description')}</p>
        </div>

        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                step.completed
                  ? 'bg-green-50 dark:bg-green-900/20'
                  : index === currentStep
                  ? 'bg-primary-50 dark:bg-primary-900/20'
                  : 'bg-gray-50 dark:bg-dark-800'
              }`}
            >
              <div className="flex-shrink-0">
                {step.completed ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : index === currentStep ? (
                  <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-300 dark:text-gray-600" />
                )}
              </div>
              <span
                className={`font-medium ${
                  step.completed
                    ? 'text-green-700 dark:text-green-400'
                    : index === currentStep
                    ? 'text-primary-700 dark:text-primary-400'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
