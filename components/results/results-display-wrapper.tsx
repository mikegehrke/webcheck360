'use client';

import { useState } from 'react';
import { ResultsDisplay } from './results-display';
import { ContactModal } from '@/components/ui/contact-modal';
import { Audit } from '@/lib/types';

interface ResultsDisplayWrapperProps {
  audit: Audit;
  locale: 'de' | 'en';
}

export function ResultsDisplayWrapper({ audit, locale }: ResultsDisplayWrapperProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRequestReport = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <ResultsDisplay 
        audit={audit} 
        locale={locale} 
        onRequestReport={handleRequestReport}
      />
      
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        auditId={audit.id}
        domain={audit.domain}
        score={audit.score_total}
        locale={locale}
      />
    </>
  );
}
