'use client';

import { useState } from 'react';
import { mockPredictions, mockPropPredictions, formatOdds, americanToImplied } from '@/lib/mock-data';
import { EVBadge } from '@/components/betting/ev-badge';
import { Brain, TrendingUp, TrendingDown, Shield, Clock, Zap, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Prediction } from '@/lib/types';

function ProbabilityBar({ homeProb, awayProb, homeTeam, awayTeam }: {
  homeProb: number; awayProb: number; homeTeam: string; awayTeam: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex text-xs justify-between text-muted-foreground">
        <span>{awayTeam.split(' ').pop()}</span>
        <span>{homeTeam.split(' ').pop()}</span>
      </div>
      <div className="flex h-3 rounded-full overflow-hidden">
        <div
          className="bg-blue-500 transition-all"
          style={{ width: `${awayProb * 100}%` }}
        />
        <div
          className="bg-slate-600 transition-all"
          style={{ width: `${homeProb * 100}%` }}
        />
      </div>
      <div className="flex justify-between text-xs font-mono font-bold">
        <span className="text-blue-400">{(awayProb * 100).toFixed(1)}%</span>
        <span className="text-foreground">{(homeProb * 100).toFixed(1)}%</span>
      </div>
    </div>
  );
}

function PredictionCard({ pred }: { pred: Prediction }) {
  const hasRec = !!pred.recommendation;
  const rec = pred.recommendation;

  return (
    <div className={cn(
      'rounded-xl border bg-card p-5 hover:shadow-lg transition-all duration-200',
      hasRec && (rec!.ev || 0) > 3
        ? 'border-emerald-500/30 hover:border-emerald-500/40 glow-green'
        : 'border-border hover:border-blue-500/30'
    )}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded uppercase">
              {pred.sport}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock size={11} />
              {new Date(pred.commenceTime).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
            </span>
          </div>
          <h3 className="text-sm font-bold text-foreground">{pred.awayTeam} @ {pred.homeTeam}</h3>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 shrink-0">
          <Brain className="w-3 h-3 text-blue-400" />
          <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-wide">{pred.modelVersion}</span>
        </div>
      </div>

      <ProbabilityBar
        homeProb={pred.modelHomeProbability}
        awayProb={pred.modelAwayProbability}
        homeTeam={pred.homeTeam}
        awayTeam={pred.awayTeam}
      />

      <div className="grid grid-cols-2 gap-2 mt-4">
        <div className="rounded-lg bg-secondary/50 border border-border p-2.5">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">{pred.awayTeam.split(' ').pop()} Fair</p>
          <p className="text-sm font-bold font-mono text-emerald-400">{formatOdds(pred.fairAwayOdds)}</p>
        </div>
        <div className="rounded-lg bg-secondary/50 border border-border p-2.5">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">{pred.homeTeam.split(' ').pop()} Fair</p>
          <p className="text-sm font-bold font-mono text-foreground">{formatOdds(pred.fairHomeOdds)}</p>
        </div>
      </div>

      {hasRec && rec && (
        <div className={cn(
          'mt-4 rounded-lg p-3.5 border',
          rec.ev > 3 ? 'bg-emerald-500/10 border-emerald-500/25' : 'bg-secondary border-border'
        )}>
          <div className="flex items-center gap-2 mb-2">
            <Zap className={cn('w-3.5 h-3.5', rec.ev > 3 ? 'text-emerald-400' : 'text-muted-foreground')} />
            <span className={cn('text-xs font-semibold uppercase tracking-wide', rec.ev > 3 ? 'text-emerald-400' : 'text-muted-foreground')}>
              Model Recommendation
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-foreground">
                {rec.side === 'home' ? pred.homeTeam : pred.awayTeam}
                <span className="text-xs text-muted-foreground ml-1.5 capitalize">({rec.market})</span>
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Bet {formatOdds(rec.betOdds)} • Fair {formatOdds(rec.fairOdds)} • {rec.confidence}% conf
              </p>
            </div>
            <EVBadge ev={rec.ev} size="md" showLabel />
          </div>
        </div>
      )}
    </div>
  );
}

const MODEL_CARDS = [
  { name: 'NFL Model v2.4', sport: 'NFL', accuracy: 58.2, roi: 6.1, bets: 142, description: 'Power ratings with weather, travel, and situational factors' },
  { name: 'NBA Model v3.1', sport: 'NBA', accuracy: 55.8, roi: 4.2, bets: 287, description: 'Pace-adjusted efficiency metrics and lineup optimization' },
  { name: 'MLB Model v1.8', sport: 'MLB', accuracy: 54.1, roi: 2.9, bets: 412, description: 'Starting pitcher ERA+, ballpark factors, bullpen usage' },
  { name: 'NHL Model v1.2', sport: 'NHL', accuracy: 53.6, roi: 2.1, bets: 198, description: 'Corsi%, zone entries, goalie recent form' },
];

export default function ModelsPage() {
  const [activeTab, setActiveTab] = useState<'predictions' | 'models'>('predictions');

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-1 bg-secondary border border-border rounded-lg p-1 w-fit">
        {[
          { value: 'predictions', label: 'AI Predictions', icon: Brain },
          { value: 'models', label: 'Model Performance', icon: Shield },
        ].map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setActiveTab(value as any)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-all',
              activeTab === value
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'predictions' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 live-indicator" />
              <span className="text-xs text-emerald-400 font-semibold">
                {mockPredictions.filter(p => p.recommendation && p.recommendation.ev > 0).length} Active Picks
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              Generated {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {mockPredictions.map((pred) => (
              <PredictionCard key={pred.id} pred={pred} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'models' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {MODEL_CARDS.map((model) => (
              <div key={model.name} className="rounded-xl border border-border bg-card p-5 hover:border-blue-500/30 transition-all">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{model.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{model.description}</p>
                  </div>
                  <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    {model.sport}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Accuracy', value: `${model.accuracy}%`, color: 'text-foreground' },
                    { label: 'ROI', value: `+${model.roi}%`, color: 'text-emerald-400' },
                    { label: 'Sample', value: `${model.bets}`, color: 'text-foreground' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="text-center rounded-lg bg-secondary/50 border border-border p-2.5">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
                      <p className={cn('text-sm font-bold font-mono', color)}>{value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                    <span>Model Accuracy</span>
                    <span>{model.accuracy}%</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${((model.accuracy - 50) / 15) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">API Integration</h3>
            <div className="space-y-3">
              {[
                { endpoint: 'GET /api/predictions', status: 'active', desc: 'Get model predictions for upcoming games' },
                { endpoint: 'POST /api/predictions/grade', status: 'active', desc: 'Grade completed predictions against results' },
                { endpoint: 'GET /api/odds', status: 'active', desc: 'Fetch live odds from all sportsbooks' },
                { endpoint: 'POST /api/bets/grade', status: 'pending', desc: 'Auto-grade bets using results API' },
              ].map(({ endpoint, status, desc }) => (
                <div key={endpoint} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border">
                  <span className={cn(
                    'w-2 h-2 rounded-full shrink-0',
                    status === 'active' ? 'bg-emerald-400' : 'bg-amber-400'
                  )} />
                  <code className="text-xs font-mono text-blue-400 shrink-0">{endpoint}</code>
                  <span className="text-xs text-muted-foreground">{desc}</span>
                  <span className={cn(
                    'ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wide shrink-0',
                    status === 'active' ? 'text-emerald-400 bg-emerald-500/15' : 'text-amber-400 bg-amber-500/15'
                  )}>
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
