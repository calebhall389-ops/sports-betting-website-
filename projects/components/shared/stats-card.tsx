import { cn } from '@/lib/utils';
import { Video as LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  subvalue?: string;
  change?: number;
  changeLabel?: string;
  icon?: LucideIcon;
  variant?: 'default' | 'positive' | 'negative' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StatsCard({
  title,
  value,
  subvalue,
  change,
  changeLabel,
  icon: Icon,
  variant = 'default',
  size = 'md',
  className,
}: StatsCardProps) {
  const isPositive = change !== undefined ? change > 0 : variant === 'positive';
  const isNegative = change !== undefined ? change < 0 : variant === 'negative';

  const TrendIcon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;

  const variantStyles = {
    default: 'border-border',
    positive: 'border-emerald-500/30 bg-emerald-500/5',
    negative: 'border-red-500/30 bg-red-500/5',
    neutral: 'border-border',
  };

  const valueStyles = {
    default: 'text-foreground',
    positive: 'text-emerald-400',
    negative: 'text-red-400',
    neutral: 'text-foreground',
  };

  const sizes = {
    sm: { value: 'text-xl', title: 'text-xs', padding: 'p-4' },
    md: { value: 'text-2xl', title: 'text-xs', padding: 'p-5' },
    lg: { value: 'text-3xl', title: 'text-sm', padding: 'p-6' },
  };

  const s = sizes[size];

  return (
    <div
      className={cn(
        'rounded-xl border bg-card transition-all duration-200 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5',
        variantStyles[variant],
        s.padding,
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className={cn('font-medium text-muted-foreground uppercase tracking-wider', s.title)}>
            {title}
          </p>
          <p className={cn('font-bold mt-1.5 tabular-nums', s.value, valueStyles[variant])}>
            {value}
          </p>
          {subvalue && (
            <p className="text-xs text-muted-foreground mt-1">{subvalue}</p>
          )}
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          {Icon && (
            <div
              className={cn(
                'flex items-center justify-center w-9 h-9 rounded-lg',
                variant === 'positive' ? 'bg-emerald-500/15' :
                variant === 'negative' ? 'bg-red-500/15' :
                'bg-blue-500/15'
              )}
            >
              <Icon
                className={cn(
                  'w-4.5 h-4.5',
                  variant === 'positive' ? 'text-emerald-400' :
                  variant === 'negative' ? 'text-red-400' :
                  'text-blue-400'
                )}
                size={18}
              />
            </div>
          )}

          {change !== undefined && (
            <div
              className={cn(
                'flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full',
                isPositive ? 'text-emerald-400 bg-emerald-500/10' :
                isNegative ? 'text-red-400 bg-red-500/10' :
                'text-muted-foreground bg-muted/50'
              )}
            >
              <TrendIcon size={11} />
              <span>{Math.abs(change).toFixed(1)}%</span>
            </div>
          )}
        </div>
      </div>

      {changeLabel && (
        <p className="text-[11px] text-muted-foreground mt-2">{changeLabel}</p>
      )}
    </div>
  );
}
