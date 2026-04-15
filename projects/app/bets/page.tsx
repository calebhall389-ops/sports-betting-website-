'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { mockBets, mockPerformanceStats } from '@/lib/mock-data';
import { BetForm } from '@/components/betting/bet-form';
import { BetHistoryTable } from '@/components/betting/bet-history-table';
import { StatsCard } from '@/components/shared/stats-card';
import { Button } from '@/components/ui/button';
import type { Bet } from '@/lib/types';
import { CirclePlus as PlusCircle, DollarSign, TrendingUp, Target, Activity, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BetsPage() {
  const [bets, setBets] = useState<Bet[]>(mockBets);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBets();
  }, []);

  async function fetchBets() {
    setLoading(true);
    const { data, error } = await supabase
      .from('bets')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      setBets(data as Bet[]);
    } else {
      setBets(mockBets);
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from('bets').delete().eq('id', id);
    if (!error) {
      setBets((prev) => prev.filter((b) => b.id !== id));
    }
  }

  const settled = bets.filter((b) => b.result !== 'pending');
  const wins = bets.filter((b) => b.result === 'win').length;
  const totalProfit = bets.reduce((sum, b) => sum + (b.profit || 0), 0);
  const totalStaked = bets.reduce((sum, b) => sum + b.stake, 0);
  const roi = totalStaked > 0 ? (totalProfit / totalStaked) * 100 : 0;
  const winRate = settled.length > 0 ? (wins / settled.length) * 100 : 0;
  const avgClv = bets.filter((b) => b.clv !== null).reduce((sum, b) => sum + (b.clv || 0), 0) / Math.max(bets.filter(b => b.clv !== null).length, 1);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatsCard
          title="Total P&L"
          value={`${totalProfit >= 0 ? '+' : ''}$${totalProfit.toFixed(2)}`}
          variant={totalProfit >= 0 ? 'positive' : 'negative'}
          icon={DollarSign}
          subvalue={`${bets.length} total bets`}
        />
        <StatsCard
          title="ROI"
          value={`${roi >= 0 ? '+' : ''}${roi.toFixed(1)}%`}
          variant={roi >= 0 ? 'positive' : 'negative'}
          icon={TrendingUp}
          subvalue={`$${totalStaked.toFixed(0)} staked`}
        />
        <StatsCard
          title="Win Rate"
          value={`${winRate.toFixed(1)}%`}
          icon={Target}
          subvalue={`${wins}W - ${settled.length - wins}L`}
        />
        <StatsCard
          title="Avg CLV"
          value={`${avgClv >= 0 ? '+' : ''}${(avgClv * 100).toFixed(2)}%`}
          variant={avgClv >= 0 ? 'positive' : 'negative'}
          icon={Activity}
          subvalue="Closing line value"
        />
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Bet History</h2>
        <Button
          onClick={() => setShowForm(!showForm)}
          className={cn(
            'h-9 text-sm font-semibold gap-2',
            showForm
              ? 'bg-secondary border border-border text-muted-foreground hover:text-foreground'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          )}
        >
          {showForm ? (
            <><X className="w-4 h-4" />Cancel</>
          ) : (
            <><PlusCircle className="w-4 h-4" />Add Bet</>
          )}
        </Button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-blue-500/20 bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-blue-400" />
            New Bet
          </h3>
          <BetForm
            onSuccess={() => {
              setShowForm(false);
              fetchBets();
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <BetHistoryTable
        bets={bets}
        onDelete={handleDelete}
        showCLV
      />
    </div>
  );
}
