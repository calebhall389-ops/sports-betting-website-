'use client';

import { useState } from 'react';
import {
  americanToDecimal,
  americanToImplied,
  impliedToAmerican,
  calculateEV,
  formatOdds,
} from '@/lib/mock-data';
import { EVBadge } from '@/components/betting/ev-badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Calculator, TrendingUp, Info, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

function StatRow({ label, value, highlight = false, info }: { label: string; value: string; highlight?: boolean; info?: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0">
      <div className="flex items-center gap-1.5">
        <span className="text-sm text-muted-foreground">{label}</span>
        {info && (
          <span title={info}>
            <Info className="w-3 h-3 text-muted-foreground/50 cursor-help" />
          </span>
        )}
      </div>
      <span className={cn('text-sm font-semibold font-mono', highlight ? 'text-blue-400' : 'text-foreground')}>
        {value}
      </span>
    </div>
  );
}

export default function EVPage() {
  const [americanOdds, setAmericanOdds] = useState('-110');
  const [fairOdds, setFairOdds] = useState('-105');
  const [modelProb, setModelProb] = useState('53');
  const [stake, setStake] = useState('100');

  const oddsNum = parseInt(americanOdds) || 0;
  const fairNum = parseInt(fairOdds) || 0;
  const probNum = parseFloat(modelProb) / 100 || 0;
  const stakeNum = parseFloat(stake) || 0;

  const impliedProb = oddsNum !== 0 ? americanToImplied(oddsNum) : 0;
  const fairImplied = fairNum !== 0 ? americanToImplied(fairNum) : 0;
  const decimalOdds = oddsNum !== 0 ? americanToDecimal(oddsNum) : 0;
  const ev = probNum > 0 && oddsNum !== 0 ? calculateEV(probNum, oddsNum) * 100 : 0;
  const fairEv = fairImplied > 0 && oddsNum !== 0 ? (impliedProb > 0 ? (fairImplied - impliedProb) / impliedProb * -100 : 0) : 0;
  const toWin = oddsNum !== 0 && stakeNum > 0 ? stakeNum * (decimalOdds - 1) : 0;
  const expValue = ev !== 0 && stakeNum > 0 ? (ev / 100) * stakeNum : 0;
  const kellyFraction = probNum > 0 && decimalOdds > 0 ? ((probNum * decimalOdds - 1) / (decimalOdds - 1)) * 100 : 0;

  const hasOdds = oddsNum !== 0;
  const hasFairOdds = fairNum !== 0;
  const hasModelProb = probNum > 0;

  const QUICK_ODDS = [-120, -110, -105, +100, +110, +120, +130, +150, +200];

  return (
    <div className="max-w-5xl space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <Calculator className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-semibold text-foreground">Implied Odds Calculator</h2>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">American Odds</Label>
            <Input
              type="number"
              placeholder="-110"
              value={americanOdds}
              onChange={(e) => setAmericanOdds(e.target.value)}
              className="bg-secondary border-border font-mono text-lg h-12 text-center"
            />
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {QUICK_ODDS.map((o) => (
                <button
                  key={o}
                  onClick={() => setAmericanOdds(String(o))}
                  className={cn(
                    'px-2 py-1 rounded text-xs font-mono font-semibold transition-colors',
                    parseInt(americanOdds) === o
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-secondary border border-border text-muted-foreground hover:text-foreground'
                  )}
                >
                  {formatOdds(o)}
                </button>
              ))}
            </div>
          </div>

          {hasOdds && (
            <div className="rounded-lg bg-secondary/50 border border-border p-4 space-y-1">
              <StatRow label="Implied Probability" value={`${(impliedProb * 100).toFixed(2)}%`} highlight />
              <StatRow label="Decimal Odds" value={decimalOdds.toFixed(4)} />
              <StatRow label="Fair Odds (no vig)" value={formatOdds(impliedToAmerican(impliedProb))} />
              <StatRow
                label="To Win (per $100)"
                value={`$${(americanToDecimal(oddsNum) - 1) * 100 > 0 ? ((americanToDecimal(oddsNum) - 1) * 100).toFixed(2) : 0}`}
              />
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-semibold text-foreground">EV Calculator</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Bet Odds (American)</Label>
              <Input
                type="number"
                placeholder="-110"
                value={americanOdds}
                onChange={(e) => setAmericanOdds(e.target.value)}
                className="bg-secondary border-border font-mono h-9 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">
                Fair Odds
                <span className="text-muted-foreground/50 ml-1">(no-vig)</span>
              </Label>
              <Input
                type="number"
                placeholder="-105"
                value={fairOdds}
                onChange={(e) => setFairOdds(e.target.value)}
                className="bg-secondary border-border font-mono h-9 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Model Win Prob (%)</Label>
              <Input
                type="number"
                placeholder="53"
                min="0"
                max="100"
                step="0.1"
                value={modelProb}
                onChange={(e) => setModelProb(e.target.value)}
                className="bg-secondary border-border font-mono h-9 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Stake ($)</Label>
              <Input
                type="number"
                placeholder="100"
                value={stake}
                onChange={(e) => setStake(e.target.value)}
                className="bg-secondary border-border font-mono h-9 text-sm"
              />
            </div>
          </div>

          {hasOdds && (
            <div className="space-y-3">
              {hasModelProb && (
                <div className={cn(
                  'flex items-center justify-between rounded-lg p-3.5 border',
                  ev > 0
                    ? 'bg-emerald-500/10 border-emerald-500/25'
                    : ev < 0
                    ? 'bg-red-500/10 border-red-500/25'
                    : 'bg-secondary border-border'
                )}>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Model EV</p>
                    <EVBadge ev={ev} size="lg" showLabel />
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground mb-1">Expected Value on Stake</p>
                    <p className={cn(
                      'text-xl font-bold font-mono',
                      expValue > 0 ? 'text-emerald-400' : expValue < 0 ? 'text-red-400' : 'text-foreground'
                    )}>
                      {expValue >= 0 ? '+' : ''}${expValue.toFixed(2)}
                    </p>
                  </div>
                </div>
              )}

              <div className="rounded-lg bg-secondary/50 border border-border p-4 space-y-1">
                {hasModelProb && (
                  <>
                    <StatRow label="Model Probability" value={`${(probNum * 100).toFixed(1)}%`} highlight />
                    <StatRow label="Implied Probability" value={`${(impliedProb * 100).toFixed(2)}%`} />
                    <StatRow label="Edge (Model vs Market)" value={`${((probNum - impliedProb) * 100).toFixed(2)}%`} highlight />
                  </>
                )}
                {hasFairOdds && (
                  <StatRow label="Fair Implied Prob" value={`${(fairImplied * 100).toFixed(2)}%`} />
                )}
                <StatRow label="To Win" value={`$${toWin.toFixed(2)}`} />
                <StatRow label="Total Return" value={`$${(toWin + stakeNum).toFixed(2)}`} />
                {hasModelProb && (
                  <StatRow
                    label="Kelly Fraction"
                    value={`${Math.max(0, kellyFraction).toFixed(1)}%`}
                    info="Optimal bet size as % of bankroll"
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4">Odds Converter</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { label: 'American', value: hasOdds ? formatOdds(oddsNum) : '—' },
            { label: 'Decimal', value: hasOdds ? decimalOdds.toFixed(4) : '—' },
            { label: 'Implied Probability', value: hasOdds ? `${(impliedProb * 100).toFixed(2)}%` : '—' },
            { label: 'Fractional (approx)', value: hasOdds && decimalOdds > 1 ? `${Math.round((decimalOdds - 1) * 100)}/${100}` : '—' },
            { label: 'No-Vig Line', value: hasOdds ? formatOdds(impliedToAmerican(impliedProb)) : '—' },
            { label: 'Break-even %', value: hasOdds ? `${(impliedProb * 100).toFixed(2)}%` : '—' },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-secondary/50 border border-border">
              <span className="text-xs text-muted-foreground">{label}</span>
              <span className="text-sm font-semibold font-mono text-blue-400">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold text-foreground mb-3">EV Reference Table</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 px-3 text-left text-muted-foreground font-semibold uppercase tracking-wide">Odds</th>
                <th className="py-2 px-3 text-right text-muted-foreground font-semibold uppercase tracking-wide">Implied %</th>
                <th className="py-2 px-3 text-right text-muted-foreground font-semibold uppercase tracking-wide">Decimal</th>
                <th className="py-2 px-3 text-right text-muted-foreground font-semibold uppercase tracking-wide">Win 55%</th>
                <th className="py-2 px-3 text-right text-muted-foreground font-semibold uppercase tracking-wide">Win 58%</th>
                <th className="py-2 px-3 text-right text-muted-foreground font-semibold uppercase tracking-wide">Win 60%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {[-130, -120, -115, -110, -105, +100, +105, +110, +120, +130].map((o) => {
                const imp = americanToImplied(o);
                const dec = americanToDecimal(o);
                return (
                  <tr key={o} className="hover:bg-secondary/50 transition-colors">
                    <td className="py-2 px-3 font-mono font-semibold text-foreground">{formatOdds(o)}</td>
                    <td className="py-2 px-3 text-right text-muted-foreground">{(imp * 100).toFixed(1)}%</td>
                    <td className="py-2 px-3 text-right font-mono text-muted-foreground">{dec.toFixed(3)}</td>
                    {[0.55, 0.58, 0.60].map((p) => {
                      const e = calculateEV(p, o) * 100;
                      return (
                        <td key={p} className={cn('py-2 px-3 text-right font-mono font-semibold', e > 0 ? 'text-emerald-400' : 'text-red-400')}>
                          {e >= 0 ? '+' : ''}{e.toFixed(1)}%
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
