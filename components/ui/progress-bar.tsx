import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'default' | 'lg';
  showLabel?: boolean;
  color?: 'primary' | 'dynamic';
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  size = 'default',
  showLabel = false,
  color = 'primary',
  className
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const sizes = {
    sm: 'h-1.5',
    default: 'h-2.5',
    lg: 'h-4',
  };

  const getColor = () => {
    if (color === 'primary') return 'bg-primary-500';
    // Dynamic color based on value
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    if (percentage >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between mb-1.5">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Progress
          </span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div className={cn('w-full bg-gray-200 dark:bg-dark-800 rounded-full overflow-hidden', sizes[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', getColor())}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
