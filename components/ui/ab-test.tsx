'use client';

import { useState, useEffect } from 'react';

interface ABTestProps {
  variants: {
    id: string;
    component: React.ReactNode;
    weight?: number;
  }[];
  testName: string;
  onVariantView?: (variantId: string) => void;
}

export function ABTest({ variants, testName, onVariantView }: ABTestProps) {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  useEffect(() => {
    // Check if user already has a variant assigned for this test
    const storedVariant = localStorage.getItem(`ab_test_${testName}`);
    
    if (storedVariant && variants.some(v => v.id === storedVariant)) {
      setSelectedVariant(storedVariant);
      onVariantView?.(storedVariant);
      return;
    }

    // Weighted random selection
    const totalWeight = variants.reduce((sum, variant) => sum + (variant.weight || 1), 0);
    let random = Math.random() * totalWeight;
    
    for (const variant of variants) {
      random -= (variant.weight || 1);
      if (random <= 0) {
        setSelectedVariant(variant.id);
        localStorage.setItem(`ab_test_${testName}`, variant.id);
        onVariantView?.(variant.id);
        
        // Track variant view
        if (typeof window !== 'undefined' && 'gtag' in window) {
          (window as any).gtag('event', 'ab_test_view', {
            test_name: testName,
            variant_id: variant.id
          });
        }
        break;
      }
    }
  }, [variants, testName, onVariantView]);

  const currentVariant = variants.find(v => v.id === selectedVariant);
  
  return currentVariant ? <>{currentVariant.component}</> : <>{variants[0].component}</>;
}