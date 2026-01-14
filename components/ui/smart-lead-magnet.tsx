'use client';

import { useState, useEffect } from 'react';
import { Download, FileText, Target, TrendingUp, Users } from 'lucide-react';

interface SmartLeadMagnetProps {
  websiteScore: number;
  industry?: string;
  userEmail?: string;
  onDownload?: (magnetId: string) => void;
}

interface LeadMagnet {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  pages: number;
  downloadCount: string;
  scoreRange: [number, number];
  industries: string[];
  preview: string[];
}

const LEAD_MAGNETS: LeadMagnet[] = [
  {
    id: 'critical_website_fixes',
    title: 'NOTFALL-GUIDE: 7 kritische Website-Fixes in 24h',
    description: 'Sofortmaßnahmen für Websites mit Score unter 60. Schritt-für-Schritt Anleitung mit Screenshots.',
    icon: <Target className="w-6 h-6 text-red-500" />,
    pages: 23,
    downloadCount: '2.847+',
    scoreRange: [0, 60],
    industries: ['general', 'ecommerce', 'healthcare', 'finance'],
    preview: [
      '✅ Performance-Killer identifizieren (5 Min.)',
      '✅ Bilder komprimieren ohne Qualitätsverlust',
      '✅ Ladezeit um 70% reduzieren',
      '✅ Mobile Darstellung sofort verbessern',
      '✅ SEO Quick-Wins für Google'
    ]
  },
  {
    id: 'conversion_optimization_playbook',
    title: 'CONVERSION PLAYBOOK: +340% mehr Kundenanfragen',
    description: 'Bewährte Strategien für Websites mit solidem Grundgerüst. Conversion-Rate steigern ohne Redesign.',
    icon: <TrendingUp className="w-6 h-6 text-green-500" />,
    pages: 34,
    downloadCount: '1.523+',
    scoreRange: [60, 85],
    industries: ['ecommerce', 'saas', 'services'],
    preview: [
      '🎯 A/B-Test Templates (sofort einsetzbar)',
      '🎯 Trust-Signal Optimierung',
      '🎯 CTA-Platzierung Heatmap-Analyse',  
      '🎯 Formular-Optimierung Checkliste',
      '🎯 Exit-Intent Strategien'
    ]
  },
  {
    id: 'premium_optimization_guide',
    title: 'PREMIUM GUIDE: Von gut zu exzellent - Profi-Optimierungen',
    description: 'Advanced Strategien für bereits starke Websites. Das letzte Prozent Performance herausholen.',
    icon: <Users className="w-6 h-6 text-purple-500" />,
    pages: 45,
    downloadCount: '387+',
    scoreRange: [85, 100],
    industries: ['enterprise', 'saas', 'finance'],
    preview: [
      '🏆 Core Web Vitals Perfektion',
      '🏆 Technical SEO Advanced',
      '🏆 Micro-Interactions UX Design',
      '🏆 Enterprise Security Audit',
      '🏆 Conversion Psychology Masterclass'
    ]
  }
];

export function SmartLeadMagnet({ websiteScore, industry = 'general', userEmail, onDownload }: SmartLeadMagnetProps) {
  const [selectedMagnet, setSelectedMagnet] = useState<LeadMagnet | null>(null);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState(userEmail || '');

  // Smart selection based on score and industry
  useEffect(() => {
    const suitableMagnets = LEAD_MAGNETS.filter(magnet => 
      websiteScore >= magnet.scoreRange[0] && 
      websiteScore <= magnet.scoreRange[1] &&
      (magnet.industries.includes(industry) || magnet.industries.includes('general'))
    );

    if (suitableMagnets.length > 0) {
      setSelectedMagnet(suitableMagnets[0]);
    } else {
      setSelectedMagnet(LEAD_MAGNETS[1]); // Default fallback
    }
  }, [websiteScore, industry]);

  const handleDownload = async () => {
    if (!selectedMagnet) return;

    if (!email) {
      setShowEmailForm(true);
      return;
    }

    // Track download
    onDownload?.(selectedMagnet.id);
    
    // In production: trigger email with download link
    console.log(`Sending ${selectedMagnet.title} to ${email}`);
    
    // Mock download
    alert(`${selectedMagnet.title} wird an ${email} gesendet!`);
  };

  if (!selectedMagnet) return null;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
      {/* Smart Recommendation Header */}
      <div className="bg-blue-500 text-white rounded-lg p-3 mb-6 text-center">
        <div className="text-sm font-medium opacity-90">Basierend auf Ihrem Score ({websiteScore}/100)</div>
        <div className="text-lg font-bold">Empfohlener Bonus-Report</div>
      </div>

      {/* Lead Magnet Content */}
      <div className="flex items-start gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
          {selectedMagnet.icon}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {selectedMagnet.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-3">
            {selectedMagnet.description}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              {selectedMagnet.pages} Seiten
            </span>
            <span className="flex items-center gap-1">
              <Download className="w-4 h-4" />
              {selectedMagnet.downloadCount} Downloads
            </span>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6">
        <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-3">Was Sie erhalten:</h4>
        <ul className="space-y-2">
          {selectedMagnet.preview.map((item, index) => (
            <li key={index} className="text-sm text-gray-700 dark:text-gray-300">
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Email Form or Download Button */}
      {showEmailForm && !userEmail ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              E-Mail für kostenlosen Download:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
              placeholder="ihre@email.de"
            />
          </div>
          <button
            onClick={handleDownload}
            className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Kostenlosen Report herunterladen
          </button>
        </div>
      ) : (
        <button
          onClick={handleDownload}
          className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          {userEmail ? 'Jetzt herunterladen' : 'Kostenlosen Report anfordern'}
        </button>
      )}

      {/* Trust Indicators */}
      <div className="flex justify-center items-center gap-6 mt-4 text-xs text-gray-500 dark:text-gray-400">
        <span>✅ 100% Kostenlos</span>
        <span>✅ Kein Spam</span>
        <span>✅ Sofortiger Download</span>
      </div>

      {/* Alternative Magnets */}
      <div className="mt-6 pt-6 border-t border-blue-200 dark:border-blue-800">
        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Weitere Reports verfügbar:</h5>
        <div className="flex gap-2">
          {LEAD_MAGNETS.filter(m => m.id !== selectedMagnet.id).slice(0, 2).map((magnet) => (
            <button
              key={magnet.id}
              onClick={() => setSelectedMagnet(magnet)}
              className="flex-1 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 hover:border-blue-300 transition-colors"
            >
              <div className="font-medium truncate">{magnet.title.split(':')[0]}</div>
              <div className="text-gray-500 text-xs">{magnet.pages} Seiten</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}