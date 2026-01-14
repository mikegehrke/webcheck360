'use client';

interface LeadScoringData {
  timeOnSite: number;
  pageViews: number;
  industry?: string;
  websiteScore?: number;
  hasEmail: boolean;
  deviceType: 'mobile' | 'desktop';
  trafficSource: string;
  hasInteracted: boolean;
}

interface ScoringResult {
  score: number;
  probability: number;
  category: 'hot' | 'warm' | 'cold';
  nextAction: string;
  emailSequence?: string;
}

export class MLLeadScoring {
  private static weights = {
    timeOnSite: 0.25,
    pageViews: 0.15,
    websiteScore: 0.20,
    hasEmail: 0.15,
    industry: 0.10,
    deviceType: 0.05,
    trafficSource: 0.05,
    hasInteracted: 0.05
  };

  static calculateScore(data: LeadScoringData): ScoringResult {
    let score = 0;

    // Time on site scoring (higher = better)
    if (data.timeOnSite > 300) score += 40; // 5+ minutes
    else if (data.timeOnSite > 120) score += 25; // 2+ minutes
    else if (data.timeOnSite > 60) score += 15; // 1+ minute
    else score += 5;

    // Page views (more engagement = higher score)
    score += Math.min(data.pageViews * 10, 30);

    // Website score correlation
    if (data.websiteScore) {
      if (data.websiteScore < 60) score += 25; // More likely to convert with bad scores
      else if (data.websiteScore < 80) score += 15;
      else score += 10;
    }

    // Email provided (strong conversion signal)
    if (data.hasEmail) score += 20;

    // Industry scoring
    const highValueIndustries = ['ecommerce', 'healthcare', 'finance', 'legal'];
    if (data.industry && highValueIndustries.includes(data.industry.toLowerCase())) {
      score += 10;
    }

    // Device type (desktop users often more serious)
    if (data.deviceType === 'desktop') score += 5;

    // Traffic source quality
    if (data.trafficSource === 'organic') score += 10;
    else if (data.trafficSource === 'direct') score += 8;
    else if (data.trafficSource === 'referral') score += 6;

    // User interaction
    if (data.hasInteracted) score += 10;

    // Normalize score to 0-100
    score = Math.min(score, 100);
    
    // Convert to probability
    const probability = score / 100;

    // Categorize lead
    let category: 'hot' | 'warm' | 'cold';
    let nextAction: string;
    let emailSequence: string | undefined;

    if (score >= 70) {
      category = 'hot';
      nextAction = 'Immediate phone follow-up';
      emailSequence = 'hot_lead_sequence';
    } else if (score >= 40) {
      category = 'warm';
      nextAction = 'Email with case studies';
      emailSequence = 'warm_lead_nurture';
    } else {
      category = 'cold';
      nextAction = 'Educational content series';
      emailSequence = 'cold_lead_education';
    }

    return {
      score,
      probability,
      category,
      nextAction,
      emailSequence
    };
  }

  static getEmailSequenceForScore(scoreCategory: string, websiteScore?: number): string[] {
    const sequences = {
      hot_lead_sequence: [
        'immediate_website_issues_report',
        'competitor_comparison_urgent',
        'consultation_booking_premium'
      ],
      warm_lead_nurture: [
        'case_study_similar_industry',
        'free_website_tips_series',
        'social_proof_testimonials',
        'consultation_booking_standard'
      ],
      cold_lead_education: [
        'website_optimization_101',
        'common_website_mistakes',
        'diy_improvement_guide',
        'success_stories_long_term'
      ]
    };

    // Adjust sequence based on website score
    if (websiteScore && websiteScore < 50) {
      return sequences.hot_lead_sequence; // Critical issues = hot treatment
    }

    return sequences[scoreCategory as keyof typeof sequences] || sequences.cold_lead_education;
  }

  static trackUserBehavior(action: string, data?: any) {
    if (typeof window === 'undefined') return;

    const sessionData = JSON.parse(sessionStorage.getItem('leadScore') || '{}');
    
    const behaviorData = {
      ...sessionData,
      lastAction: action,
      timestamp: Date.now(),
      hasInteracted: true,
      pageViews: (sessionData.pageViews || 0) + 1,
      ...data
    };

    sessionStorage.setItem('leadScore', JSON.stringify(behaviorData));

    // Update score in real-time
    const score = this.calculateScore(behaviorData);
    
    // Trigger different popups/actions based on score
    if (score.category === 'hot' && !sessionData.hotActionTriggered) {
      sessionData.hotActionTriggered = true;
      this.triggerHotLeadAction();
    }
  }

  private static triggerHotLeadAction() {
    // Trigger exit-intent popup or premium offer
    console.log('Hot lead detected - trigger premium action');
  }
}