'use client';

import { useState } from 'react';
import { mockPlayerProps, mockPropPredictions, formatOdds, americanToImplied } from '@/lib/mock-data';
import { EVBadge } from '@/components/betting/ev-badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SPORTS } from '../lib/mock-data';
import { Search, Brain, TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PropPrediction } from '@/lib/types';

const CONFIDENCE_TIERS = [
  { min: 70, label: 'High', color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/25' },
  { min: 60, label: 'Medium', color: 'text-amber-400 bg-amber-500/15 border-amber-500/25' },
  { min: 0, label: 'Low', color: 'text-red-400 bg-red-500/15 border-red-500/25' },
];

function ConfidenceBadge({ confidence }: { confidence: number }) {
  const tier = CONFIDENCE_TIERS.find((t) => confidence >= t.min) || CONFIDENCE_TIERS[2];
  return (
    <span className={cn('text-xs font-semibold px-2 py-0.5 rounded border', tier.color)}>
      {tier.label} {confidence}%
    </span>
  );
}

function PropProjectionBar({ line, projection, maxRange = 40 }: { line: number; projection: number; maxRange?: number }) {
  const diff = projection - line;
  const pct = Math.min(Math.abs(diff) / maxRange * 50, 50);
  const isOver = diff > 0;

  return (
    <div className="flex items-center gap-2 mt-2">
      <span className="text-[10px] text-muted-foreground w-6 text-right">{line}</span>
      <div className="flex-1 h-2.5 bg-secondary rounded-full overflow-hidden relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-full flex">
            <div className="w-1/2 flex justify-end">
              {!isOver && (
                <div
                  className="h-full bg-red-500/60 rounded-l"
                  style={{ width: `${pct}%` }}
                />
              )}
            </div>
            <div className="w-px bg-muted-foreground/30 h-full" />
            <div className="w-1/2">
              {isOver && (
                <div
                  className="h-full bg-emerald-500/60 rounded-r"
                  style={{ width: `${pct}%` }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <span className={cn('text-[10px] font-mono font-bold w-8', isOver ? 'text-emerald-400' : 'text-red-400')}>
        {projection.toFixed(1)}
      </span>
    </div>
  );
}

function PropPredictionCard({ prop }: { prop: PropPrediction }) {
  const isOver = prop.bestSide === 'over';

  return (
    <div className="rounded-xl border border-border bg-card p-4 hover:border-blue-500/30 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-bold text-foreground">{prop.player}</span>
            <span className="text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded font-semibold uppercase tracking-wide">
              {prop.sport}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">{prop.team} • {prop.game}</p>
        </div>
        <ConfidenceBadge confidence={prop.confidence} />
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm font-semibold text-foreground">{prop.propType}</span>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-sm font-bold font-mono text-foreground">{prop.line}</span>
      </div>

      <PropProjectionBar line={prop.line} projection={prop.modelProjection} maxRange={Math.max(prop.line * 0.3, 20)} />

      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className={cn(
          'rounded-lg p-2.5 border text-center',
          isOver ? 'bg-emerald-500/10 border-emerald-500/25' : 'bg-secondary border-border'
        )}>
          <p className={cn('text-xs mb-1', isOver ? 'text-emerald-400 font-semibold' : 'text-muted-foreground')}>
            Over {isOver ? '★' : ''}
          </p>
          <p className={cn('text-base font-bold font-mono', isOver ? 'text-emerald-400' : 'text-foreground')}>
            {(prop.overProb * 100).toFixed(1)}%
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{formatOdds(prop.bestOdds)}</p>
        </div>
        <div className={cn(
          'rounded-lg p-2.5 border text-center',
          !isOver ? 'bg-red-500/10 border-red-500/25' : 'bg-secondary border-border'
        )}>
          <p className={cn('text-xs mb-1', !isOver ? 'text-red-400 font-semibold' : 'text-muted-foreground')}>
            Under {!isOver ? '★' : ''}
          </p>
          <p className={cn('text-base font-bold font-mono', !isOver ? 'text-red-400' : 'text-foreground')}>
            {(prop.underProb * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
        <div className="flex items-center gap-1.5">
          <Brain className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-xs text-muted-foreground">Model: <span className="font-semibold font-mono text-foreground">{prop.modelProjection.toFixed(1)}</span></span>
        </div>
        <EVBadge ev={prop.ev} size="sm" showLabel />
      </div>
    </div>
  );
}

export default function PropsPage() {
  const [sport, setSport] = useState('all');
  const [search, setSearch] = useState('');
  const [minEV, setMinEV] = useState('0');
  const [sortBy, setSortBy] = useState<'ev' | 'confidence'>('ev');

  const filtered = mockPropPredictions
    .filter((p) => {
      if (sport !== 'all' && p.sport !== sport) return false;
      if (search && !`${p.player} ${p.propType} ${p.team}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (p.ev < parseFloat(minEV || '0')) return false;
      return true;
    })
    .sort((a, b) => sortBy === 'ev' ? b.ev - a.ev : b.confidence - a.confidence);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {[
          { label: 'Total Props', value: mockPropPredictions.length },
          { label: 'Positive EV', value: mockPropPredictions.filter((p) => p.ev > 0).length, color: 'text-emerald-400' },
          { label: 'High Conf.', value: mockPropPredictions.filter((p) => p.confidence >= 70).length, color: 'text-blue-400' },
          { label: 'Avg EV', value: `+${(mockPropPredictions.reduce((s, p) => s + p.ev, 0) / mockPropPredictions.length).toFixed(1)}%`, color: 'text-emerald-400' },
          { label: 'Best EV', value: `+${Math.max(...mockPropPredictions.map((p) => p.ev)).toFixed(1)}%`, color: 'text-emerald-400' },
          { label: 'Sports', value: new Set(mockPropPredictions.map((p) => p.sport)).size },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-lg border border-border bg-card p-3 text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
            <p className={cn('text-xl font-bold font-mono', color || 'text-foreground')}>{value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search players, props..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 bg-secondary border-border text-sm"
          />
        </div>
        <Select value={sport} onValueChange={setSport}>
          <SelectTrigger className="w-32 h-9 bg-secondary border-border text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">All Sports</SelectItem>
            {SPORTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary border border-border">
          <span className="text-xs text-muted-foreground">Min EV:</span>
          <Input
            type="number"
            value={minEV}
            onChange={(e) => setMinEV(e.target.value)}
            className="w-14 h-5 bg-transparent border-none p-0 text-xs font-mono text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <span className="text-xs text-muted-foreground">%</span>
        </div>
        <div className="flex items-center gap-1 bg-secondary border border-border rounded-lg p-1">
          {[{ value: 'ev', label: 'EV' }, { value: 'confidence', label: 'Confidence' }].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setSortBy(value as any)}
              className={cn(
                'px-3 py-1 rounded text-xs font-medium transition-colors',
                sortBy === value ? 'bg-blue-500/20 text-blue-400' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((prop) => (
          <PropPredictionCard key={prop.id} prop={prop} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-sm">No props found matching your filters</p>
        </div>
      )}
    </div>
  );
}
