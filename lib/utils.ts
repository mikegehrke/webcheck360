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
  
  // PERFECT SCORE (95-100) - Congratulate, offer premium services
  if (score >= 95) {
    if (locale === 'de') {
      return `Guten Tag,

Ihre Website ${domain} wurde in unserem Website-Check analysiert und hat ein hervorragendes Ergebnis erzielt!

Mit einem Gesamt-Score von ${score}/100 gehoert Ihre Website zu den Top-Performern. Technisch, in Sachen SEO und Nutzererfahrung sind Sie bestens aufgestellt.

Fuer Websites auf diesem Niveau biete ich weiterfuehrende Optimierungen an:
- Conversion-Rate-Optimierung fuer mehr Kundenanfragen
- A/B-Testing fuer noch bessere Performance
- Strategische Weiterentwicklung und neue Features

Wenn Sie Interesse haben, Ihre bereits starke Online-Praesenz auf das naechste Level zu bringen, stehe ich Ihnen gerne fuer ein unverbindliches Gespraech zur Verfuegung.

Freundliche Gruesse`;
    }
    
    return `Hello,

Your website ${domain} was analyzed in our website check and achieved an outstanding result!

With an overall score of ${score}/100, your website is among the top performers. You're excellently positioned in terms of technical performance, SEO, and user experience.

For websites at this level, I offer advanced optimization services:
- Conversion rate optimization for more customer inquiries
- A/B testing for even better performance
- Strategic development and new features

If you're interested in taking your already strong online presence to the next level, I'd be happy to discuss this with you in a no-obligation conversation.

Best regards`;
  }
  
  // EXCELLENT SCORE (80-94) - Good but room for minor improvements
  if (score >= 80) {
    const issueList = topIssues.length > 0 
      ? topIssues.map(i => `- ${i.title}`).join('\n')
      : locale === 'de' 
        ? '- Kleinere technische Optimierungen\n- Feintuning der Ladezeiten\n- SEO-Verbesserungen fuer noch bessere Rankings'
        : '- Minor technical optimizations\n- Fine-tuning of loading times\n- SEO improvements for even better rankings';
    
    if (locale === 'de') {
      return `Guten Tag,

Ihre Website ${domain} wurde in unserem Website-Check analysiert und zeigt ein sehr gutes Ergebnis.

Mit einem Gesamt-Score von ${score}/100 sind Sie bereits gut aufgestellt. Es gibt jedoch noch einige Feinheiten, die optimiert werden koennten:

${issueList}

Diese Anpassungen koennten Ihre Website von "sehr gut" auf "exzellent" bringen.

Haben Sie Interesse an einem kurzen Austausch? 15 Minuten genuegen, um die Moeglichkeiten zu besprechen.

Freundliche Gruesse`;
    }
    
    return `Hello,

Your website ${domain} was analyzed in our website check and shows very good results.

With an overall score of ${score}/100, you're already well positioned. However, there are still some refinements that could be optimized:

${issueList}

These adjustments could take your website from "very good" to "excellent."

Would you be interested in a brief exchange? 15 minutes is enough to discuss the possibilities.

Best regards`;
  }
  
  // GOOD SCORE (60-79) - Solid foundation with clear improvement areas
  if (score >= 60) {
    const issueList = topIssues.length > 0 
      ? topIssues.map(i => `- ${i.title}`).join('\n')
      : locale === 'de' 
        ? '- Performance-Verbesserungen noetig\n- SEO-Optimierung empfohlen\n- Mobile Nutzererfahrung verbessern'
        : '- Performance improvements needed\n- SEO optimization recommended\n- Mobile user experience could be improved';
    
    if (locale === 'de') {
      return `Guten Tag,

Ihre Website ${domain} wurde in unserem Website-Check analysiert.

Mit einem Gesamt-Score von ${score}/100 haben Sie eine solide Grundlage, aber es gibt deutliches Optimierungspotenzial:

${issueList}

Diese Punkte koennen oft mit ueberschaubarem Aufwand behoben werden und fuehren zu spuerbar besseren Ergebnissen bei Suchmaschinen und Besuchern.

Ich wuerde mich freuen, Ihnen in einem kurzen Gespraech zu zeigen, wie diese Punkte pragmatisch geloest werden koennen - ohne alles neu zu bauen.

Haben Sie in den naechsten Tagen 15 Minuten Zeit fuer einen unverbindlichen Austausch?

Freundliche Gruesse`;
    }
    
    return `Hello,

Your website ${domain} was analyzed in our website check.

With an overall score of ${score}/100, you have a solid foundation, but there is clear potential for optimization:

${issueList}

These points can often be fixed with manageable effort and lead to noticeably better results with search engines and visitors.

I would be happy to show you in a short conversation how these points can be pragmatically solved - without rebuilding everything.

Do you have 15 minutes in the coming days for a no-obligation exchange?

Best regards`;
  }
  
  // NEEDS WORK (40-59) - Significant issues that need attention
  if (score >= 40) {
    const issueList = topIssues.length > 0 
      ? topIssues.map(i => `- ${i.title}`).join('\n')
      : locale === 'de' 
        ? '- Technische Performance kritisch\n- SEO-Grundlagen fehlen\n- Mobile Darstellung problematisch'
        : '- Technical performance is critical\n- SEO fundamentals are missing\n- Mobile display is problematic';
    
    if (locale === 'de') {
      return `Guten Tag,

Ihre Website ${domain} wurde in unserem Website-Check analysiert und zeigt wichtige Verbesserungsmoeglichkeiten auf.

Mit einem Gesamt-Score von ${score}/100 gibt es einige Bereiche, die dringend Aufmerksamkeit benoetigen:

${issueList}

Diese Probleme koennen dazu fuehren, dass potenzielle Kunden abspringen und Ihre Website bei Google schlechter rankt.

Die gute Nachricht: Mit gezielten Massnahmen lassen sich diese Punkte effizient beheben. Ich biete Ihnen gerne ein kostenloses 15-minuetiges Beratungsgespraech an, um die wichtigsten Schritte zu besprechen.

Freundliche Gruesse`;
    }
    
    return `Hello,

Your website ${domain} was analyzed in our website check and reveals important areas for improvement.

With an overall score of ${score}/100, there are several areas that urgently need attention:

${issueList}

These issues can cause potential customers to leave and your website to rank lower on Google.

The good news: With targeted measures, these points can be fixed efficiently. I'd be happy to offer you a free 15-minute consultation to discuss the most important steps.

Best regards`;
  }
  
  // CRITICAL (0-39) - Urgent action needed
  const criticalIssueList = topIssues.length > 0 
    ? topIssues.map(i => `- ${i.title}`).join('\n')
    : locale === 'de' 
      ? '- Schwere Performance-Probleme\n- Grundlegende SEO-Fehler\n- Website ist nicht mobilfreundlich'
      : '- Severe performance issues\n- Fundamental SEO errors\n- Website is not mobile-friendly';
  
  if (locale === 'de') {
    return `Guten Tag,

Ihre Website ${domain} wurde in unserem Website-Check analysiert und zeigt kritische Probleme auf, die dringend behoben werden sollten.

Mit einem Gesamt-Score von ${score}/100 verlieren Sie wahrscheinlich taeglich potenzielle Kunden:

${criticalIssueList}

Diese Probleme beeintraechtigen nicht nur Ihre Google-Platzierung, sondern auch das Vertrauen Ihrer Besucher erheblich.

Ich empfehle dringend eine professionelle Ueberarbeitung. Lassen Sie uns in einem kurzen Gespraech die wichtigsten Sofortmassnahmen besprechen - kostenlos und unverbindlich.

Freundliche Gruesse`;
  }
  
  return `Hello,

Your website ${domain} was analyzed in our website check and reveals critical issues that should be addressed urgently.

With an overall score of ${score}/100, you are likely losing potential customers every day:

${criticalIssueList}

These issues not only affect your Google ranking but also significantly impact your visitors' trust.

I strongly recommend a professional overhaul. Let's discuss the most important immediate measures in a short conversation - free and without obligation.

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
