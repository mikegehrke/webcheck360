// Smart Retargeting Email Sequences
// Email templates and logic based on website score categories

export interface EmailTemplate {
  id: string;
  subject: string;
  content: string;
  delay: number; // minutes
  triggerCondition?: string;
}

export interface RetargetingSequence {
  name: string;
  description: string;
  templates: EmailTemplate[];
}

export const RETARGETING_SEQUENCES: Record<string, RetargetingSequence> = {
  // For websites scoring 0-40 (Critical Issues)
  critical_issues: {
    name: 'Critical Website Issues Sequence',
    description: 'For websites with severe performance/SEO problems',
    templates: [
      {
        id: 'critical_immediate',
        subject: '🚨 Ihr Website-Score: {{score}}/100 - Sofortige Maßnahmen nötig',
        content: `Hallo {{name}},

Ihr Website-Check zeigt kritische Probleme (Score: {{score}}/100):

❌ KRITISCHE PROBLEME:
{{#issues}}
- {{title}}: {{description}}
{{/issues}}

💰 UMSATZ-VERLUST:
- Täglich verlorene Kunden durch langsame Ladezeit
- Google bestraft schlechte Performance (-70% Sichtbarkeit)
- Mobile Nutzer springen ab (78% bei >3s Ladezeit)

🚀 KOSTENLOSE SOFORT-HILFE:
Ich zeige Ihnen in 15 Minuten die 3 wichtigsten Fixes.

Termine: https://webcheck360.de/beratung

Viele Grüße,
Mike Gehrke
WebCheck360`,
        delay: 5 // 5 minutes after scan
      },
      {
        id: 'critical_case_study',
        subject: 'Kunde steigerte Conversion um 340% nach Website-Fix',
        content: `Hallo {{name}},

Ähnlicher Fall wie bei Ihrer Website:

VORHER ({{industry}} wie Sie):
- Performance: 23/100  
- Conversion: 0.8%
- Bounce Rate: 81%

NACHHER (nach 30 Tagen):
- Performance: 96/100
- Conversion: 3.5% (+340%!)
- Bounce Rate: 24%

ERGEBNIS: +€47.000 Mehrumsatz/Monat

Die gleichen Fixes funktionieren bei Ihrer Website.

Kostenlose Analyse: https://webcheck360.de/beratung`,
        delay: 1440 // 24 hours
      }
    ]
  },

  // For websites scoring 41-70 (Optimization Needed)
  optimization_needed: {
    name: 'Website Optimization Sequence',
    description: 'For websites with moderate issues',
    templates: [
      {
        id: 'optimization_gaps',
        subject: 'Ihre Website-Analyse: {{score}}/100 - Verstecktes Potenzial entdeckt',
        content: `Hallo {{name}},

Gute Basis, aber ungenutztes Potenzial entdeckt!

✅ DAS LÄUFT GUT:
{{#strengths}}
- {{strength}}
{{/strengths}}

🎯 QUICK WINS FÜR MEHR KUNDEN:
{{#improvements}}
- {{improvement}} ({{impact}})
{{/improvements}}

📈 GESCHÄTZTER IMPACT:
- +{{estimated_conversion}}% mehr Anfragen
- +{{estimated_revenue}}€ Mehrumsatz/Monat

Soll ich Ihnen die Umsetzung zeigen?

Gratis Beratung: https://webcheck360.de/termin`,
        delay: 30 // 30 minutes
      }
    ]
  },

  // For websites scoring 71-90 (Fine-tuning)
  fine_tuning: {
    name: 'Performance Fine-tuning Sequence', 
    description: 'For well-performing websites needing polish',
    templates: [
      {
        id: 'fine_tuning_advanced',
        subject: 'Website-Score {{score}}/100 - Professionelle Optimierungen für Marktführer',
        content: `Hallo {{name}},

Starke Website-Basis! Professionelle Optimierungen für das letzte Prozent:

🏆 IHR STATUS:
- Top 20% aller analysierten Websites
- Solide Grundlage vorhanden

🎯 PREMIUM-OPTIMIERUNGEN:
- Conversion-Rate-Optimierung (A/B Tests)
- Advanced Performance Tuning  
- User Experience Feinschliff
- Technisches SEO Enhancement

💼 FÜR WEN:
- Etablierte Unternehmen
- E-Commerce Shops >50k€/Monat
- SaaS und Dienstleister mit hohen CLV

Interesse an Premium-Optimierung?

Strategiegespräch: https://webcheck360.de/premium`,
        delay: 60 // 1 hour
      }
    ]
  },

  // For websites scoring 91-100 (Excellent)
  excellent_maintenance: {
    name: 'Website Excellence Maintenance',
    description: 'For excellent websites needing maintenance',
    templates: [
      {
        id: 'excellent_monitoring',
        subject: 'Top-Performance bestätigt! Wie halten Sie das Niveau?',
        content: `Hallo {{name}},

Gratulation! Ihre Website gehört zu den besten 5%.

🏆 IHR ERGEBNIS:
- Score: {{score}}/100
- Performance besser als 95% aller Websites
- Professioneller Webauftritt

🛡️ WEBSITE-SCHUTZ:
Auch exzellente Websites brauchen Monitoring:
- Kontinuierliche Performance-Überwachung
- Sicherheits-Updates  
- Conversion-Optimierung durch Datenanalyse

🔍 KOSTENLOSER SERVICE:
Monatlicher Performance-Report für Top-Websites.

Interesse? https://webcheck360.de/monitoring`,
        delay: 120 // 2 hours
      }
    ]
  }
};

export function getRetargetingSequence(score: number, industry?: string): RetargetingSequence {
  if (score <= 40) return RETARGETING_SEQUENCES.critical_issues;
  if (score <= 70) return RETARGETING_SEQUENCES.optimization_needed;  
  if (score <= 90) return RETARGETING_SEQUENCES.fine_tuning;
  return RETARGETING_SEQUENCES.excellent_maintenance;
}

export function scheduleEmailSequence(
  leadEmail: string, 
  websiteScore: number, 
  leadData: any
) {
  const sequence = getRetargetingSequence(websiteScore, leadData.industry);
  
  // In production, this would integrate with email service (Resend, SendGrid, etc.)
  console.log(`Scheduling ${sequence.name} for ${leadEmail}`, {
    score: websiteScore,
    templates: sequence.templates.length,
    industry: leadData.industry
  });

  // Mock scheduling - in production would use proper queue system
  sequence.templates.forEach((template, index) => {
    setTimeout(() => {
      console.log(`Sending email: ${template.subject} to ${leadEmail}`);
      // sendEmail(leadEmail, template, leadData);
    }, template.delay * 60000); // Convert minutes to milliseconds
  });
}

// Email template rendering with variables
export function renderEmailTemplate(template: EmailTemplate, data: any): EmailTemplate {
  const rendered = { ...template };
  
  // Simple template variable replacement
  rendered.subject = template.subject.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key] || match;
  });
  
  rendered.content = template.content.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key] || match;
  });

  // Handle arrays/lists (like issues, strengths, etc.)
  rendered.content = rendered.content.replace(
    /\{\{#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, 
    (match, listKey, itemTemplate) => {
      const list = data[listKey];
      if (!Array.isArray(list)) return '';
      
      return list.map((item: any) => {
        return itemTemplate.replace(/\{\{(\w+)\}\}/g, (m: string, k: string) => {
          return item[k] || m;
        });
      }).join('\n');
    }
  );

  return rendered;
}