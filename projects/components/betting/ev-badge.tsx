import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface EVBadgeProps {
  ev: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showLabel?: boolean;
  className?: string;
}

export function EVBadge({ ev, size = 'md', showIcon = true, showLabel = false, className }: EVBadgeProps) {
  const isPositive = ev > 0;
  const isNegative = ev < 0;
  const isNeutral = ev === 0;

  const Icon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;

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

  const iconSizes = { sm: 10, md: 12, lg: 14 };

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
      {showLabel && <span className="font-normal opacity-70 mr-0.5">EV</span>}
      <span>
        {isPositive ? '+' : ''}{ev.toFixed(1)}%
      </span>
    </span>
  );
}
