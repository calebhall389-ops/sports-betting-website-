import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface CLVBadgeProps {
  clv: number | null;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showLabel?: boolean;
  className?: string;
}

export function CLVBadge({ clv, size = 'md', showIcon = true, showLabel = true, className }: CLVBadgeProps) {
  if (clv === null) {
    return (
      <span
        className={cn(
          'inline-flex items-center font-medium rounded-md text-muted-foreground bg-muted/50 border border-border',
          size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : size === 'lg' ? 'text-sm px-2.5 py-1.5' : 'text-xs px-2 py-1',
          className
        )}
      >
        {showLabel && <span className="opacity-70 mr-1">CLV</span>}
        <span>Pending</span>
      </span>
    );
  }

  const pct = (clv * 100).toFixed(2);
  const isPositive = clv > 0;
  const isNegative = clv < 0;

  const Icon = isPositive ? ArrowUp : isNegative ? ArrowDown : Minus;

  const styles = {
    positive: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25',
    negative: 'bg-red-500/15 text-red-400 border border-red-500/25',
    neutral: 'bg-muted/50 text-muted-foreground border border-border',
  };

  const sizes = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-0.5',
    md: 'text-xs px-2 py-1 gap-1',
    lg: 'text-sm px-2.5 py-1.5 gap-1.5',
  };

  const iconSizes = { sm: 10, md: 11, lg: 13 };

  const style = isPositive ? styles.positive : isNegative ? styles.negative : styles.neutral;

  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold rounded-md tabular-nums',
        style,
        sizes[size],
        className
      )}
    >
      {showIcon && <Icon size={iconSizes[size]} />}
      {showLabel && <span className="font-normal opacity-70 mr-0.5">CLV</span>}
      <span>
        {isPositive ? '+' : ''}{pct}%
      </span>
    </span>
  );
}
