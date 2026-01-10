import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return url;
  }
}

export function normalizeUrl(url: string): string {
  let normalized = url.trim().toLowerCase();
  if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
    normalized = `https://${normalized}`;
  }
  return normalized;
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-500';
  if (score >= 60) return 'text-yellow-500';
  if (score >= 40) return 'text-orange-500';
  return 'text-red-500';
}

export function getScoreBgColor(score: number): string {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-yellow-500';
  if (score >= 40) return 'bg-orange-500';
  return 'bg-red-500';
}

export function getScoreLabel(score: number, locale: 'de' | 'en' = 'de'): string {
  const labels = {
    de: {
      excellent: 'Exzellent',
      good: 'Gut',
      needsWork: 'Verbesserungspotenzial',
      critical: 'Kritisch'
    },
    en: {
      excellent: 'Excellent',
      good: 'Good',
      needsWork: 'Needs Improvement',
      critical: 'Critical'
    }
  };

  if (score >= 80) return labels[locale].excellent;
  if (score >= 60) return labels[locale].good;
  if (score >= 40) return labels[locale].needsWork;
  return labels[locale].critical;
}

export function formatDate(dateString: string, locale: 'de' | 'en' = 'de'): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function generateFollowUpText(
  domain: string,
  score: number,
  issues: { category: string; title: string }[],
  locale: 'de' | 'en' = 'de'
): string {
  const topIssues = issues.slice(0, 3);
  
  if (locale === 'de') {
    return `Guten Tag,

Ihre Website ${domain} wurde kürzlich in unserem kostenlosen Website-Check analysiert und hat in mehreren Bereichen Potenzial gezeigt.

Mit einem Gesamt-Score von ${score}/100 gibt es einige Punkte, die verbessert werden könnten:

${topIssues.map(i => `• ${i.title}`).join('\n')}

Ich würde mich freuen, Ihnen in einem kurzen Gespräch zu zeigen, wie diese Punkte pragmatisch gelöst werden können – ohne alles neu zu bauen.

Haben Sie in den nächsten Tagen 15 Minuten Zeit für einen unverbindlichen Austausch?

Freundliche Grüße`;
  }
  
  return `Hello,

Your website ${domain} was recently analyzed in our free website check and showed potential for improvement in several areas.

With an overall score of ${score}/100, there are some points that could be improved:

${topIssues.map(i => `• ${i.title}`).join('\n')}

I would be happy to show you in a short conversation how these points can be pragmatically solved - without rebuilding everything.

Do you have 15 minutes in the coming days for a no-obligation exchange?

Best regards`;
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function isValidUrl(url: string): boolean {
  try {
    const normalized = url.startsWith('http') ? url : `https://${url}`;
    new URL(normalized);
    return true;
  } catch {
    return false;
  }
}
