'use client';

import { cn } from '@/lib/utils';

interface ScoreCircleProps {
  score: number;
  size?: 'sm' | 'default' | 'lg';
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export function ScoreCircle({ 
  score, 
  size = 'default', 
  showLabel = true,
  label,
  className 
}: ScoreCircleProps) {
  const sizes = {
    sm: { container: 'w-16 h-16', text: 'text-lg', stroke: 4 },
    default: { container: 'w-32 h-32', text: 'text-4xl', stroke: 6 },
    lg: { container: 'w-48 h-48', text: 'text-6xl', stroke: 8 },
  };

  const { container, text, stroke } = sizes[size];
  
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score >= 80) return { stroke: '#10b981', text: 'text-green-500' };
    if (score >= 60) return { stroke: '#eab308', text: 'text-yellow-500' };
    if (score >= 40) return { stroke: '#f97316', text: 'text-orange-500' };
    return { stroke: '#ef4444', text: 'text-red-500' };
  };

  const colors = getColor();

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className={cn('relative', container)}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            className="text-gray-200 dark:text-dark-800"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn('font-bold', text, colors.text)}>
            {score}
          </span>
        </div>
      </div>
      {showLabel && label && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{label}</p>
      )}
    </div>
  );
}
