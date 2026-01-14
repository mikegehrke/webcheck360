'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface ProgressiveInfoProps {
  sections: {
    id: string;
    title: string;
    summary: string;
    details: React.ReactNode;
    icon?: React.ReactNode;
  }[];
  autoExpand?: boolean;
  className?: string;
}

export function ProgressiveInfo({ sections, autoExpand = false, className = '' }: ProgressiveInfoProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (autoExpand && sections.length > 0) {
      // Auto-expand sections progressively
      const timer = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < sections.length - 1) {
            setExpandedSections(current => new Set([...current, sections[prev + 1].id]));
            return prev + 1;
          } else {
            clearInterval(timer);
            return prev;
          }
        });
      }, 2000); // Expand next section every 2 seconds

      // Start with first section
      setExpandedSections(new Set([sections[0].id]));

      return () => clearInterval(timer);
    }
  }, [autoExpand, sections]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(current => {
      const newSet = new Set(current);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {sections.map((section, index) => {
        const isExpanded = expandedSections.has(section.id);
        const isAutoExpanding = autoExpand && index <= currentStep;
        
        return (
          <div
            key={section.id}
            className={`border rounded-lg transition-all duration-300 ${
              isExpanded ? 'border-primary-300 bg-primary-50 dark:bg-primary-950/20' : 'border-gray-200 dark:border-gray-700'
            } ${isAutoExpanding ? 'animate-pulse' : ''}`}
          >
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                {section.icon && (
                  <div className="flex-shrink-0">{section.icon}</div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {section.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {section.summary}
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0 ml-4">
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </button>
            
            {isExpanded && (
              <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700">
                <div className="pt-4">
                  {section.details}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}