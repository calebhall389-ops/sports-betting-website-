'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { formatOdds, formatCLV } from '@/lib/mock-data';
import type { Bet } from '@/lib/types';
import { CLVBadge } from '@/components/betting/clv-badge';
import { CircleCheck as CheckCircle2, Circle as XCircle, CircleMinus as MinusCircle, Clock, ChevronDown, ChevronUp, Trash2, CreditCard as Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface BetHistoryTableProps {
  bets: Bet[];
  onDelete?: (id: string) => void;
  onUpdate?: (bet: Bet) => void;
  showCLV?: boolean;
  compact?: boolean;
}

const RESULT_CONFIG = {
  win: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Win', badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' },
  loss: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10', label: 'Loss', badgeClass: 'bg-red-500/15 text-red-400 border-red-500/25' },
  push: { icon: MinusCircle, color: 'text-amber-400', bg: 'bg-amber-500/10', label: 'Push', badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/25' },
  pending: { icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/10', label: 'Pending', badgeClass: 'bg-blue-500/15 text-blue-400 border-blue-500/25' },
  void: { icon: MinusCircle, color: 'text-slate-400', bg: 'bg-slate-500/10', label: 'Void', badgeClass: 'bg-slate-500/15 text-slate-400 border-slate-500/25' },
};

function ResultBadge({ result }: { result: string }) {
  const config = RESULT_CONFIG[result as keyof typeof RESULT_CONFIG] || RESULT_CONFIG.pending;
  const Icon = config.icon;
  return (
    <span className={cn('inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border', config.badgeClass)}>
      <Icon size={10} />
      {config.label}
    </span>
  );
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function BetHistoryTable({ bets, onDelete, onUpdate, showCLV = true, compact = false }: BetHistoryTableProps) {
  const [sortField, setSortField] = useState<keyof Bet>('created_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [filter, setFilter] = useState<string>('all');

  function toggleSort(field: keyof Bet) {
    if (sortField === field) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  }

  function SortIcon({ field }: { field: keyof Bet }) {
    if (sortField !== field) return <ChevronDown size={12} className="text-muted-foreground/40" />;
    return sortDir === 'asc' ? <ChevronUp size={12} className="text-blue-400" /> : <ChevronDown size={12} className="text-blue-400" />;
  }

  const filtered = filter === 'all' ? bets : bets.filter((b) => b.result === filter);
  const sorted = [...filtered].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;
    const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const filterOptions = [
    { value: 'all', label: 'All Bets', count: bets.length },
    { value: 'win', label: 'Wins', count: bets.filter(b => b.result === 'win').length },
    { value: 'loss', label: 'Losses', count: bets.filter(b => b.result === 'loss').length },
    { value: 'pending', label: 'Pending', count: bets.filter(b => b.result === 'pending').length },
    { value: 'push', label: 'Pushes', count: bets.filter(b => b.result === 'push').length },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1.5 flex-wrap">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150',
              filter === opt.value
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'text-muted-foreground hover:text-foreground bg-secondary border border-border hover:border-border/80'
            )}
          >
            {opt.label}
            <span className={cn(
              'px-1.5 py-0.5 rounded text-[10px] font-bold',
              filter === opt.value ? 'bg-blue-500/30 text-blue-300' : 'bg-muted text-muted-foreground'
            )}>
              {opt.count}
            </span>
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-border bg-[hsl(220_26%_8%)]">
                {[
                  { label: 'Date', field: 'created_at' },
                  { label: 'Game', field: 'game' },
                  { label: 'Sport', field: 'sport' },
                  { label: 'Market', field: 'market' },
                  { label: 'Book', field: 'sportsbook' },
                  { label: 'Odds', field: 'odds' },
                  { label: 'Stake', field: 'stake' },
                  { label: 'Result', field: 'result' },
                  { label: 'P&L', field: 'profit' },
                  ...(showCLV ? [{ label: 'CLV', field: 'clv' }] : []),
                ].map(({ label, field }) => (
                  <th
                    key={field}
                    className="px-4 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors select-none"
                    onClick={() => toggleSort(field as keyof Bet)}
                  >
                    <div className="flex items-center gap-1">
                      {label}
                      <SortIcon field={field as keyof Bet} />
                    </div>
                  </th>
                ))}
                {(onDelete || onUpdate) && (
                  <th className="px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider w-20" />
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-muted-foreground text-sm">
                    No bets found
                  </td>
                </tr>
              ) : (
                sorted.map((bet) => (
                  <tr key={bet.id} className="hover:bg-[hsl(220_26%_11%)] transition-colors group">
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(bet.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-foreground">{bet.game}</span>
                      {bet.notes && (
                        <p className="text-xs text-muted-foreground truncate max-w-[150px]">{bet.notes}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
                        {bet.sport}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground capitalize">
                      {bet.market.replace('_', ' ')}
                    </td>
                    <td className="px-4 py-3 text-xs text-foreground">{bet.sportsbook}</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        'font-mono text-sm font-semibold',
                        bet.odds > 0 ? 'text-emerald-400' : 'text-slate-200'
                      )}>
                        {formatOdds(bet.odds)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm text-foreground">${bet.stake.toFixed(2)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <ResultBadge result={bet.result} />
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        'font-mono text-sm font-semibold',
                        bet.profit === null ? 'text-muted-foreground' :
                        bet.profit > 0 ? 'text-emerald-400' :
                        bet.profit < 0 ? 'text-red-400' : 'text-amber-400'
                      )}>
                        {bet.profit === null ? '—' : bet.profit >= 0 ? `+$${bet.profit.toFixed(2)}` : `-$${Math.abs(bet.profit).toFixed(2)}`}
                      </span>
                    </td>
                    {showCLV && (
                      <td className="px-4 py-3">
                        <CLVBadge clv={bet.clv} size="sm" />
                      </td>
                    )}
                    {(onDelete || onUpdate) && (
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {onUpdate && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-6 h-6 text-muted-foreground hover:text-blue-400"
                              onClick={() => onUpdate(bet)}
                            >
                              <Edit2 size={12} />
                            </Button>
                          )}
                          {onDelete && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-6 h-6 text-muted-foreground hover:text-red-400"
                              onClick={() => onDelete(bet.id)}
                            >
                              <Trash2 size={12} />
                            </Button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
