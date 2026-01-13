'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScoreCircle } from '@/components/ui/score-circle';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Button } from '@/components/ui/button';
import { ImageLightbox } from '@/components/ui/image-lightbox';
import { 
  Zap, 
  Smartphone, 
  Search, 
  Shield, 
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowRight
} from 'lucide-react';
import { Audit, AuditIssue } from '@/lib/types';
import { getScoreLabel } from '@/lib/utils';

interface ResultsDisplayProps {
  audit: Audit;
  locale: 'de' | 'en';
  onRequestReport?: () => void;
}

const categoryIcons = {
  performance: Zap,
  mobile_ux: Smartphone,
  seo: Search,
  trust: Shield,
  conversion: TrendingUp,
};

const categoryLabels = {
  de: {
    performance: 'Performance',
    mobile_ux: 'Mobile UX',
    seo: 'SEO',
    trust: 'Vertrauen',
    conversion: 'Conversion',
  },
  en: {
    performance: 'Performance',
    mobile_ux: 'Mobile UX',
    seo: 'SEO',
    trust: 'Trust',
    conversion: 'Conversion',
  },
};

function getSeverityIcon(severity: AuditIssue['severity']) {
  switch (severity) {
    case 'critical':
      return <XCircle className="w-5 h-5 text-red-500" />;
    case 'warning':
      return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    case 'info':
      return <CheckCircle className="w-5 h-5 text-blue-500" />;
  }
}

function getSeverityBadge(severity: AuditIssue['severity']) {
  switch (severity) {
    case 'critical':
      return <Badge variant="error">Kritisch</Badge>;
    case 'warning':
      return <Badge variant="warning">Warnung</Badge>;
    case 'info':
      return <Badge variant="info">Info</Badge>;
  }
}

export function ResultsDisplay({ audit, locale, onRequestReport }: ResultsDisplayProps) {
  const t = useTranslations('results');

  // Null-safe filter mit Fallback auf leeres Array
  const issues = audit.issues || [];
  const criticalIssues = issues.filter(i => i.severity === 'critical');
  const warningIssues = issues.filter(i => i.severity === 'warning');
  const infoIssues = issues.filter(i => i.severity === 'info');

  // Null-safe scores
  const scores = audit.scores || {
    performance: 0,
    mobile_ux: 0,
    seo: 0,
    trust: 0,
    conversion: 0,
  };

  // Null-safe screenshots
  const screenshots = audit.screenshots || { desktop: null, mobile: null };

  return (
    <div className="space-y-8">
      {/* Header with Score */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          {t('subtitle')} <span className="font-semibold text-gray-900 dark:text-white">{audit.domain}</span>
        </p>
        
        <div className="flex justify-center mb-4">
          <ScoreCircle score={audit.score_total || 0} size="lg" />
        </div>
        <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
          {getScoreLabel(audit.score_total || 0, locale)}
        </p>
      </div>

      {/* Category Scores */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {Object.entries(scores).map(([key, value]) => {
              const Icon = categoryIcons[key as keyof typeof categoryIcons];
              if (!Icon) return null;
              return (
                <div key={key} className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-dark-800 flex items-center justify-center mx-auto mb-2">
                    <Icon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {categoryLabels[locale][key as keyof typeof categoryLabels['de']]}
                  </p>
                  <p className="text-xl font-bold">{value || 0}</p>
                  <ProgressBar value={value || 0} size="sm" color="dynamic" className="mt-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Screenshots */}
      {(screenshots.desktop || screenshots.mobile) && (
        <div className="grid md:grid-cols-2 gap-6">
          {screenshots.desktop && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t('screenshots.desktop')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageLightbox
                  src={screenshots.desktop}
                  alt="Desktop Screenshot"
                  aspectRatio="aspect-video"
                />
              </CardContent>
            </Card>
          )}
          {screenshots.mobile && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t('screenshots.mobile')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageLightbox
                  src={screenshots.mobile}
                  alt="Mobile Screenshot"
                  aspectRatio="aspect-[9/16]"
                  maxWidth="max-w-[200px] mx-auto"
                />
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Issues */}
      <div className="space-y-6">
        {/* Critical Issues */}
        {criticalIssues.length > 0 && (
          <Card className="border-red-200 dark:border-red-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <XCircle className="w-5 h-5" />
                {t('sections.critical')} ({criticalIssues.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {criticalIssues.map((issue) => (
                <div key={issue.id} className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                  <div className="flex items-start gap-3">
                    {getSeverityIcon(issue.severity)}
                    <div>
                      <h4 className="font-semibold">{issue.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {issue.description}
                      </p>
                      <p className="text-sm text-primary-600 dark:text-primary-400 mt-2">
                        💡 {issue.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Warning Issues */}
        {warningIssues.length > 0 && (
          <Card className="border-yellow-200 dark:border-yellow-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                <AlertTriangle className="w-5 h-5" />
                {t('sections.improve')} ({warningIssues.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {warningIssues.map((issue) => (
                <div key={issue.id} className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                  <div className="flex items-start gap-3">
                    {getSeverityIcon(issue.severity)}
                    <div>
                      <h4 className="font-semibold">{issue.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {issue.description}
                      </p>
                      <p className="text-sm text-primary-600 dark:text-primary-400 mt-2">
                        💡 {issue.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Info/Good */}
        {infoIssues.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle className="w-5 h-5" />
                {t('sections.good')} ({infoIssues.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {infoIssues.map((issue) => (
                <div key={issue.id} className="p-4 bg-gray-50 dark:bg-dark-800 rounded-xl">
                  <div className="flex items-start gap-3">
                    {getSeverityIcon(issue.severity)}
                    <div>
                      <h4 className="font-semibold">{issue.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {issue.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* No issues found */}
        {issues.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('noProblems')}</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {t('noProblemsDesc')}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* CTA */}
      <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-black">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-2">{t('cta.title')}</h3>
          <p className="mb-6 opacity-90">{t('cta.description')}</p>
          <Button 
            variant="secondary" 
            size="lg"
            onClick={onRequestReport}
            className="bg-white text-gray-900 hover:bg-gray-100"
          >
            {t('cta.button')}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
