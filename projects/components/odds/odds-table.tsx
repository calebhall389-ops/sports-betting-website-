'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { formatOdds, americanToImplied } from '@/lib/mock-data';
import type { GameOdds, OddsLine } from '@/lib/types';
import { Clock, ChevronDown, ChevronUp, Trophy } from 'lucide-react';
import { EVBadge } from '@/components/betting/ev-badge';

interface OddsTableProps {
  games: GameOdds[];
  sportsbooks?: string[];
}

function OddsCell({ line, isBest }: { line: OddsLine | undefined; isBest: boolean }) {
  if (!line) {
    return <td className="px-3 py-3 text-center text-muted-foreground/30 text-xs">—</td>;
  }

  return (
    <td className="px-3 py-3 text-center">
      <span
        className={cn(
          'tabular-nums text-sm font-semibold px-2 py-1 rounded transition-colors',
          isBest
            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
            : line.odds > 0
            ? 'text-emerald-300'
            : 'text-slate-300',
          'hover:bg-blue-500/10 cursor-pointer'
        )}
      >
        {formatOdds(line.odds)}
      </span>
    </td>
  );
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) +
    ' ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export function OddsTable({ games, sportsbooks = [] }: OddsTableProps) {
  const [expandedGame, setExpandedGame] = useState<string | null>(null);

  const activeSportsbooks = sportsbooks.length > 0
    ? sportsbooks
    : ['DraftKings', 'FanDuel', 'BetMGM', 'Caesars', 'ESPN Bet', 'bet365'];

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-border bg-[hsl(220_26%_8%)]">
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider w-56">
                Game
              </th>
              {activeSportsbooks.map((book) => (
                <th key={book} className="px-3 py-3 text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-wider min-w-[90px]">
                  {book.replace(' Bet', '').replace('Bet', '')}
                </th>
              ))}
              <th className="px-3 py-3 text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Best
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {games.map((game) => {
              const isExpanded = expandedGame === game.id;
              const bestHomeBook = game.bestHome.sportsbook;
              const bestAwayBook = game.bestAway.sportsbook;

              const homeImplied = americanToImplied(game.bestHome.odds);
              const awayImplied = americanToImplied(game.bestAway.odds);
              const totalImplied = homeImplied + awayImplied;
              const vig = ((totalImplied - 1) * 100).toFixed(1);

              return (
                <>
                  <tr
                    key={`${game.id}-home`}
                    className="hover:bg-[hsl(220_26%_11%)] transition-colors cursor-pointer group"
                    onClick={() => setExpandedGame(isExpanded ? null : game.id)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-wide">{game.sport}</span>
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <Clock size={9} />
                              {formatTime(game.commenceTime)}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-foreground truncate">{game.awayTeam}</p>
                          <p className="text-sm text-muted-foreground truncate">{game.homeTeam}</p>
                        </div>
                        <button className="text-muted-foreground group-hover:text-foreground transition-colors pt-1">
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      </div>
                    </td>

                    {activeSportsbooks.map((book) => {
                      const awayLine = game.awayLines.find((l) => l.sportsbook === book);
                      const homeLine = game.homeLines.find((l) => l.sportsbook === book);
                      return (
                        <td key={book} className="px-3 py-3">
                          <div className="flex flex-col items-center gap-1">
                            <span className={cn(
                              'tabular-nums text-sm font-semibold px-2 py-0.5 rounded',
                              awayLine && awayLine.sportsbook === bestAwayBook
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                                : awayLine && awayLine.odds > 0 ? 'text-emerald-300' : 'text-slate-300'
                            )}>
                              {awayLine ? formatOdds(awayLine.odds) : '—'}
                            </span>
                            <span className={cn(
                              'tabular-nums text-sm font-semibold px-2 py-0.5 rounded',
                              homeLine && homeLine.sportsbook === bestHomeBook
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                                : homeLine && homeLine.odds > 0 ? 'text-emerald-300' : 'text-slate-300'
                            )}>
                              {homeLine ? formatOdds(homeLine.odds) : '—'}
                            </span>
                          </div>
                        </td>
                      );
                    })}

                    <td className="px-3 py-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-1">
                          <Trophy size={11} className="text-emerald-400" />
                          <span className="text-sm font-bold text-emerald-400 tabular-nums">
                            {formatOdds(game.bestAway.odds)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Trophy size={11} className="text-emerald-400" />
                          <span className="text-sm font-bold text-emerald-400 tabular-nums">
                            {formatOdds(game.bestHome.odds)}
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr key={`${game.id}-expanded`} className="bg-[hsl(220_26%_8%)]">
                      <td colSpan={activeSportsbooks.length + 2} className="px-4 py-3">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-xs">
                            <p className="text-muted-foreground mb-1">Implied Probabilities</p>
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span className="text-foreground">{game.awayTeam}</span>
                                <span className="text-blue-400 font-mono">{(awayImplied * 100).toFixed(1)}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-foreground">{game.homeTeam}</span>
                                <span className="text-blue-400 font-mono">{(homeImplied * 100).toFixed(1)}%</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-xs">
                            <p className="text-muted-foreground mb-1">Market Info</p>
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span className="text-foreground">Market Vig</span>
                                <span className="text-amber-400 font-mono">{vig}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-foreground">Best Value</span>
                                <span className="text-emerald-400 font-mono">
                                  {game.bestAway.sportsbook}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-xs">
                            <p className="text-muted-foreground mb-1">Best Available</p>
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span className="text-foreground">{game.awayTeam}</span>
                                <span className="text-emerald-400 font-mono font-bold">
                                  {formatOdds(game.bestAway.odds)} @ {game.bestAway.sportsbook}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-foreground">{game.homeTeam}</span>
                                <span className="text-emerald-400 font-mono font-bold">
                                  {formatOdds(game.bestHome.odds)} @ {game.bestHome.sportsbook}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
