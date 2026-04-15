import { cn } from '@/lib/utils';
import { formatOdds } from '@/lib/mock-data';
import type { OddsLine } from '@/lib/types';
import { Trophy } from 'lucide-react';

interface SportsbookCardProps {
  sportsbook: string;
  homeLine: OddsLine | undefined;
  awayLine: OddsLine | undefined;
  homeTeam: string;
  awayTeam: string;
  isBestHome: boolean;
  isBestAway: boolean;
  isOpen?: boolean;
}

const BOOK_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  DraftKings: { bg: 'bg-green-500/10', border: 'border-green-500/25', text: 'text-green-400' },
  FanDuel: { bg: 'bg-blue-500/10', border: 'border-blue-500/25', text: 'text-blue-400' },
  BetMGM: { bg: 'bg-amber-500/10', border: 'border-amber-500/25', text: 'text-amber-400' },
  Caesars: { bg: 'bg-orange-500/10', border: 'border-orange-500/25', text: 'text-orange-400' },
  'ESPN Bet': { bg: 'bg-red-500/10', border: 'border-red-500/25', text: 'text-red-400' },
  bet365: { bg: 'bg-lime-500/10', border: 'border-lime-500/25', text: 'text-lime-400' },
  PointsBet: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/25', text: 'text-cyan-400' },
  BetRivers: { bg: 'bg-violet-500/10', border: 'border-violet-500/25', text: 'text-violet-400' },
};

export function SportsbookCard({
  sportsbook,
  homeLine,
  awayLine,
  homeTeam,
  awayTeam,
  isBestHome,
  isBestAway,
}: SportsbookCardProps) {
  const colors = BOOK_COLORS[sportsbook] || { bg: 'bg-slate-500/10', border: 'border-slate-500/25', text: 'text-slate-400' };
  const hasBest = isBestHome || isBestAway;

  return (
    <div
      className={cn(
        'rounded-xl border bg-card p-4 transition-all duration-200 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 relative overflow-hidden',
        hasBest ? 'border-emerald-500/30 glow-green' : 'border-border',
      )}
    >
      {hasBest && (
        <div className="absolute top-2 right-2">
          <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/20 px-1.5 py-0.5 rounded-full uppercase tracking-wide">
            <Trophy size={8} />
            Best
          </span>
        </div>
      )}

      <div className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md mb-3', colors.bg, 'border', colors.border)}>
        <span className={cn('text-xs font-bold', colors.text)}>{sportsbook}</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground truncate mr-2">{awayTeam.split(' ').pop()}</span>
          <span
            className={cn(
              'text-sm font-bold tabular-nums',
              isBestAway ? 'text-emerald-400' : awayLine && awayLine.odds > 0 ? 'text-emerald-300' : 'text-slate-200'
            )}
          >
            {awayLine ? formatOdds(awayLine.odds) : '—'}
          </span>
        </div>
        <div className="h-px bg-border/50" />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground truncate mr-2">{homeTeam.split(' ').pop()}</span>
          <span
            className={cn(
              'text-sm font-bold tabular-nums',
              isBestHome ? 'text-emerald-400' : homeLine && homeLine.odds > 0 ? 'text-emerald-300' : 'text-slate-200'
            )}
          >
            {homeLine ? formatOdds(homeLine.odds) : '—'}
          </span>
        </div>
      </div>
    </div>
  );
}
