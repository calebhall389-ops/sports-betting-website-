'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { SPORTSBOOKS, SPORTS, MARKETS } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { CirclePlus as PlusCircle, Calculator, X } from 'lucide-react';
import { americanToImplied, americanToDecimal } from '@/lib/mock-data';

interface BetFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  compact?: boolean;
}

interface FormState {
  game: string;
  sport: string;
  market: string;
  sportsbook: string;
  odds: string;
  stake: string;
  placedLine: string;
  notes: string;
}

const initialForm: FormState = {
  game: '',
  sport: 'NFL',
  market: 'moneyline',
  sportsbook: 'DraftKings',
  odds: '',
  stake: '',
  placedLine: '',
  notes: '',
};

export function BetForm({ onSuccess, onCancel, compact = false }: BetFormProps) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const oddsNum = parseInt(form.odds) || 0;
  const stakeNum = parseFloat(form.stake) || 0;
  const impliedProb = oddsNum !== 0 ? americanToImplied(oddsNum) : 0;
  const toWin = oddsNum !== 0 && stakeNum > 0
    ? stakeNum * (americanToDecimal(oddsNum) - 1)
    : 0;

  function update(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.game || !form.odds || !form.stake) {
      setError('Game, odds, and stake are required.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: dbError } = await supabase.from('bets').insert({
        game: form.game,
        sport: form.sport,
        market: form.market as any,
        sportsbook: form.sportsbook,
        odds: parseInt(form.odds),
        stake: parseFloat(form.stake),
        result: 'pending',
        placed_line: form.placedLine ? parseInt(form.placedLine) : parseInt(form.odds),
        notes: form.notes || null,
      });

      if (dbError) throw dbError;

      setForm(initialForm);
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || 'Failed to save bet.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label className="text-xs text-muted-foreground mb-1.5 block">Game / Matchup</Label>
          <Input
            placeholder="e.g. Chiefs vs Bills"
            value={form.game}
            onChange={(e) => update('game', e.target.value)}
            className="bg-secondary border-border text-foreground placeholder:text-muted-foreground/50 h-9"
          />
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">Sport</Label>
          <Select value={form.sport} onValueChange={(v) => update('sport', v)}>
            <SelectTrigger className="bg-secondary border-border h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {SPORTS.map((s) => (
                <SelectItem key={s} value={s} className="text-sm">{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">Market</Label>
          <Select value={form.market} onValueChange={(v) => update('market', v)}>
            <SelectTrigger className="bg-secondary border-border h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {MARKETS.map((m) => (
                <SelectItem key={m} value={m} className="text-sm capitalize">{m.replace('_', ' ')}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">Sportsbook</Label>
          <Select value={form.sportsbook} onValueChange={(v) => update('sportsbook', v)}>
            <SelectTrigger className="bg-secondary border-border h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {SPORTSBOOKS.map((b) => (
                <SelectItem key={b} value={b} className="text-sm">{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">American Odds</Label>
          <Input
            type="number"
            placeholder="-110"
            value={form.odds}
            onChange={(e) => update('odds', e.target.value)}
            className="bg-secondary border-border text-foreground placeholder:text-muted-foreground/50 h-9 font-mono"
          />
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">Stake ($)</Label>
          <Input
            type="number"
            placeholder="100"
            min="0"
            step="0.01"
            value={form.stake}
            onChange={(e) => update('stake', e.target.value)}
            className="bg-secondary border-border text-foreground placeholder:text-muted-foreground/50 h-9 font-mono"
          />
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">
            Placed Line <span className="text-muted-foreground/50">(for CLV tracking)</span>
          </Label>
          <Input
            type="number"
            placeholder="Same as odds"
            value={form.placedLine}
            onChange={(e) => update('placedLine', e.target.value)}
            className="bg-secondary border-border text-foreground placeholder:text-muted-foreground/50 h-9 font-mono"
          />
        </div>
      </div>

      {oddsNum !== 0 && stakeNum > 0 && (
        <div className="flex items-center gap-4 p-3 rounded-lg bg-blue-500/5 border border-blue-500/15">
          <Calculator className="w-4 h-4 text-blue-400 shrink-0" />
          <div className="flex items-center gap-4 text-xs">
            <div>
              <span className="text-muted-foreground">Implied: </span>
              <span className="font-mono font-semibold text-foreground">{(impliedProb * 100).toFixed(1)}%</span>
            </div>
            <div>
              <span className="text-muted-foreground">To Win: </span>
              <span className="font-mono font-semibold text-emerald-400">${toWin.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Total Return: </span>
              <span className="font-mono font-semibold text-foreground">${(toWin + stakeNum).toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {!compact && (
        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">Notes</Label>
          <Textarea
            placeholder="Optional notes about this bet..."
            value={form.notes}
            onChange={(e) => update('notes', e.target.value)}
            className="bg-secondary border-border text-foreground placeholder:text-muted-foreground/50 resize-none h-16 text-sm"
          />
        </div>
      )}

      {error && (
        <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex gap-2 pt-1">
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 h-9 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          {loading ? 'Saving...' : 'Add Bet'}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="h-9 border-border text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </form>
  );
}
