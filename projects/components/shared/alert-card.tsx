import { cn } from '@/lib/utils';
import { TrendingUp, MoveUpRight, Zap, TriangleAlert as AlertTriangle, Cloud, X } from 'lucide-react';
import type { Alert } from '@/lib/types';

interface AlertCardProps {
  alert: Alert;
  onDismiss?: (id: string) => void;
  compact?: boolean;
}

const alertConfig = {
  ev_opportunity: {
    icon: TrendingUp,
    label: 'EV Opportunity',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/25',
    iconColor: 'text-emerald-400',
    labelColor: 'text-emerald-400',
  },
  line_move: {
    icon: MoveUpRight,
    label: 'Line Move',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/25',
    iconColor: 'text-amber-400',
    labelColor: 'text-amber-400',
  },
  sharp_action: {
    icon: Zap,
    label: 'Sharp Action',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/25',
    iconColor: 'text-blue-400',
    labelColor: 'text-blue-400',
  },
  injury: {
    icon: AlertTriangle,
    label: 'Injury Report',
    bg: 'bg-red-500/10',
    border: 'border-red-500/25',
    iconColor: 'text-red-400',
    labelColor: 'text-red-400',
  },
  weather: {
    icon: Cloud,
    label: 'Weather Alert',
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/25',
    iconColor: 'text-slate-400',
    labelColor: 'text-slate-400',
  },
};

function getRelativeTime(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function AlertCard({ alert, onDismiss, compact = false }: AlertCardProps) {
  const config = alertConfig[alert.type] || alertConfig.line_move;
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'rounded-lg border transition-all duration-200',
        config.bg,
        config.border,
        compact ? 'px-3 py-2.5' : 'px-4 py-3.5',
        alert.is_read ? 'opacity-60' : 'opacity-100'
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn('rounded-md p-1.5 mt-0.5 shrink-0', config.bg, 'border', config.border)}>
          <Icon className={cn('w-3.5 h-3.5', config.iconColor)} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn('text-xs font-semibold uppercase tracking-wide', config.labelColor)}>
              {config.label}
            </span>
            {alert.ev_pct !== null && (
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/15 rounded px-1.5 py-0.5">
                +{alert.ev_pct}% EV
              </span>
            )}
            <span className="text-[10px] text-muted-foreground ml-auto shrink-0">
              {getRelativeTime(alert.created_at)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{alert.message}</p>
          {alert.game && !compact && (
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-[10px] text-muted-foreground/70">{alert.game}</span>
              {alert.sportsbook && (
                <span className="text-[10px] font-medium text-blue-400/70">{alert.sportsbook}</span>
              )}
            </div>
          )}
        </div>

        {onDismiss && (
          <button
            onClick={() => onDismiss(alert.id)}
            className="shrink-0 mt-0.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
