import { AuditScores, AuditIssue, DEFAULT_SCORE_WEIGHTS, ScoreWeights } from '@/lib/types';

export interface ScoreEngineInput {
  performance: number;
  mobile_ux: number;
  seo: number;
  trust: number;
  conversion: number;
}

export interface ScoreEngineResult {
  total: number;
  scores: AuditScores;
  rating: 'excellent' | 'good' | 'needs-improvement' | 'poor';
  summary: {
    strengths: string[];
    weaknesses: string[];
    priority: string;
  };
}

export function calculateTotalScore(
  scores: ScoreEngineInput,
  weights: ScoreWeights = DEFAULT_SCORE_WEIGHTS
): number {
  const weightedScore = 
    scores.performance * weights.performance +
    scores.mobile_ux * weights.mobile_ux +
    scores.seo * weights.seo +
    scores.trust * weights.trust +
    scores.conversion * weights.conversion;
  
  return Math.round(weightedScore);
}

export function getRating(score: number): 'excellent' | 'good' | 'needs-improvement' | 'poor' {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'needs-improvement';
  return 'poor';
}

export function generateScoreSummary(
  scores: AuditScores,
  issues: AuditIssue[],
  locale: 'de' | 'en' = 'de'
): ScoreEngineResult['summary'] {
  const categoryNames = locale === 'de' 
    ? {
        performance: 'Performance',
        mobile_ux: 'Mobile Darstellung',
        seo: 'SEO',
        trust: 'Vertrauensfaktoren',
        conversion: 'Conversion'
      }
    : {
        performance: 'Performance',
        mobile_ux: 'Mobile UX',
        seo: 'SEO',
        trust: 'Trust Factors',
        conversion: 'Conversion'
      };

  const strengths: string[] = [];
  const weaknesses: string[] = [];

  // Analyze each category
  Object.entries(scores).forEach(([key, value]) => {
    const categoryKey = key as keyof AuditScores;
    const name = categoryNames[categoryKey];
    
    if (value >= 80) {
      strengths.push(name);
    } else if (value < 50) {
      weaknesses.push(name);
    }
  });

  // Determine priority
  const criticalIssues = issues.filter(i => i.severity === 'critical');
  let priority: string;

  if (locale === 'de') {
    if (criticalIssues.length > 0) {
      const criticalCategory = criticalIssues[0].category;
      priority = `Fokus auf ${categoryNames[criticalCategory as keyof typeof categoryNames]} – hier gibt es kritische Probleme.`;
    } else if (weaknesses.length > 0) {
      priority = `${weaknesses[0]} zeigt das größte Verbesserungspotenzial.`;
    } else {
      priority = 'Die Website ist insgesamt gut aufgestellt. Feintuning möglich.';
    }
  } else {
    if (criticalIssues.length > 0) {
      const criticalCategory = criticalIssues[0].category;
      priority = `Focus on ${categoryNames[criticalCategory as keyof typeof categoryNames]} – there are critical issues.`;
    } else if (weaknesses.length > 0) {
      priority = `${weaknesses[0]} shows the biggest improvement potential.`;
    } else {
      priority = 'The website is generally well set up. Fine-tuning possible.';
    }
  }

  return { strengths, weaknesses, priority };
}

export function processScoreEngine(
  scores: ScoreEngineInput,
  issues: AuditIssue[],
  locale: 'de' | 'en' = 'de'
): ScoreEngineResult {
  const total = calculateTotalScore(scores);
  const rating = getRating(total);
  const summary = generateScoreSummary(scores as AuditScores, issues, locale);

  return {
    total,
    scores: scores as AuditScores,
    rating,
    summary
  };
}

export function getScoreColorClass(score: number): string {
  if (score >= 80) return 'text-green-500 bg-green-500/10';
  if (score >= 60) return 'text-yellow-500 bg-yellow-500/10';
  if (score >= 40) return 'text-orange-500 bg-orange-500/10';
  return 'text-red-500 bg-red-500/10';
}

export function getScoreEmoji(score: number): string {
  if (score >= 80) return '🟢';
  if (score >= 60) return '🟡';
  if (score >= 40) return '🟠';
  return '🔴';
}

export function sortIssuesBySeverity(issues: AuditIssue[]): AuditIssue[] {
  const severityOrder: Record<string, number> = { critical: 0, high: 1, warning: 2, low: 3, info: 4 };
  return [...issues].sort((a, b) => (severityOrder[a.severity] ?? 5) - (severityOrder[b.severity] ?? 5));
}

export function groupIssuesByCategory(issues: AuditIssue[]): Record<string, AuditIssue[]> {
  return issues.reduce((acc, issue) => {
    if (!acc[issue.category]) {
      acc[issue.category] = [];
    }
    acc[issue.category].push(issue);
    return acc;
  }, {} as Record<string, AuditIssue[]>);
}
