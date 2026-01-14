'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Crown, Target } from 'lucide-react';

interface CompetitorData {
  domain: string;
  performance: number;
  seo: number;
  mobile: number;
  conversion: number;
  total: number;
  industry: string;
}

interface CompetitorComparisonProps {
  userDomain: string;
  userScore: number;
  userScores: {
    performance: number;
    seo: number;
    mobile: number;
    conversion: number;
  };
  industry?: string;
}

export function CompetitorComparison({ userDomain, userScore, userScores, industry = 'general' }: CompetitorComparisonProps) {
  const [competitors, setCompetitors] = useState<CompetitorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock competitor data - in production would come from real API
  const competitorDatabase: Record<string, CompetitorData[]> = {
    ecommerce: [
      { domain: 'amazon.de', performance: 95, seo: 98, mobile: 97, conversion: 94, total: 96, industry: 'ecommerce' },
      { domain: 'otto.de', performance: 88, seo: 92, mobile: 91, conversion: 87, total: 89, industry: 'ecommerce' },
      { domain: 'zalando.de', performance: 92, seo: 89, mobile: 95, conversion: 91, total: 92, industry: 'ecommerce' }
    ],
    healthcare: [
      { domain: 'doctolib.de', performance: 91, seo: 94, mobile: 93, conversion: 88, total: 91, industry: 'healthcare' },
      { domain: 'jameda.de', performance: 87, seo: 91, mobile: 89, conversion: 85, total: 88, industry: 'healthcare' },
      { domain: 'netdoktor.de', performance: 85, seo: 96, mobile: 88, conversion: 82, total: 88, industry: 'healthcare' }
    ],
    finance: [
      { domain: 'ing.de', performance: 94, seo: 91, mobile: 96, conversion: 89, total: 93, industry: 'finance' },
      { domain: 'dkb.de', performance: 89, seo: 87, mobile: 92, conversion: 86, total: 89, industry: 'finance' },
      { domain: 'comdirect.de', performance: 91, seo: 89, mobile: 94, conversion: 88, total: 91, industry: 'finance' }
    ],
    general: [
      { domain: 'top-competitor.de', performance: 89, seo: 91, mobile: 88, conversion: 85, total: 88, industry: 'general' },
      { domain: 'market-leader.com', performance: 92, seo: 94, mobile: 91, conversion: 89, total: 92, industry: 'general' },
      { domain: 'industry-best.de', performance: 87, seo: 89, mobile: 90, conversion: 84, total: 88, industry: 'general' }
    ]
  };

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const industryCompetitors = competitorDatabase[industry] || competitorDatabase.general;
      setCompetitors(industryCompetitors);
      setIsLoading(false);
    }, 1500);
  }, [industry]);

  const getComparisonIcon = (userValue: number, competitorValue: number) => {
    if (userValue > competitorValue + 5) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (userValue < competitorValue - 5) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-yellow-500" />;
  };

  const getPositionText = () => {
    const betterThan = competitors.filter(comp => userScore > comp.total).length;
    if (betterThan === 3) return "🏆 Marktführer in Ihrer Branche!";
    if (betterThan === 2) return "🥈 Unter den Top 2 in Ihrer Branche";
    if (betterThan === 1) return "🥉 Platz 3 von 4 in Ihrer Branche";
    return "📊 Verbesserungspotenzial gegenüber Konkurrenten";
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3 mb-6">
          <Target className="w-6 h-6 text-blue-500" />
          <h3 className="text-xl font-bold">Konkurrenz-Vergleich</h3>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
        <p className="text-center text-gray-500 mt-4">Analysiere Top 3 Konkurrenten...</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-3 mb-6">
        <Target className="w-6 h-6 text-blue-500" />
        <h3 className="text-xl font-bold">Ihre Website vs. Top 3 Konkurrenten</h3>
      </div>

      {/* Position Summary */}
      <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 mb-6">
        <p className="text-lg font-semibold text-blue-900 dark:text-blue-100">
          {getPositionText()}
        </p>
      </div>

      {/* Your Website */}
      <div className="bg-primary-50 dark:bg-primary-950/20 rounded-lg p-4 mb-4 border-2 border-primary-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-primary-500" />
            <span className="font-bold text-primary-900 dark:text-primary-100">{userDomain} (Ihre Website)</span>
          </div>
          <div className="text-2xl font-bold text-primary-600">{userScore}/100</div>
        </div>
        <div className="grid grid-cols-4 gap-3 text-sm">
          <div className="text-center">
            <div className="font-medium text-gray-600 dark:text-gray-400">Performance</div>
            <div className="font-bold">{userScores.performance}</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-600 dark:text-gray-400">SEO</div>
            <div className="font-bold">{userScores.seo}</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-600 dark:text-gray-400">Mobile</div>
            <div className="font-bold">{userScores.mobile}</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-600 dark:text-gray-400">Conversion</div>
            <div className="font-bold">{userScores.conversion}</div>
          </div>
        </div>
      </div>

      {/* Competitors */}
      {competitors.map((competitor, index) => (
        <div key={competitor.domain} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              #{index + 2} {competitor.domain}
            </span>
            <div className="text-xl font-bold text-gray-700 dark:text-gray-300">{competitor.total}/100</div>
          </div>
          <div className="grid grid-cols-4 gap-3 text-sm">
            <div className="flex items-center justify-center gap-1">
              {getComparisonIcon(userScores.performance, competitor.performance)}
              <span>{competitor.performance}</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              {getComparisonIcon(userScores.seo, competitor.seo)}
              <span>{competitor.seo}</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              {getComparisonIcon(userScores.mobile, competitor.mobile)}
              <span>{competitor.mobile}</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              {getComparisonIcon(userScores.conversion, competitor.conversion)}
              <span>{competitor.conversion}</span>
            </div>
          </div>
        </div>
      ))}

      {/* Action CTA */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-lg p-4 mt-6 border border-orange-200 dark:border-orange-800">
        <h4 className="font-bold text-orange-900 dark:text-orange-100 mb-2">
          💡 Konkurrenz überholen in 30 Tagen
        </h4>
        <p className="text-sm text-orange-700 dark:text-orange-200 mb-3">
          Ich zeige Ihnen, wie Sie systematisch jeden Konkurrenten überholen können.
        </p>
        <button className="w-full bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors">
          Konkurrenz-Strategie anfordern
        </button>
      </div>
    </div>
  );
}