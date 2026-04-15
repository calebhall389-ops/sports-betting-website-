'use client';

import { oddsData, betsData, propsData, modelPredictions } from '@/lib/mock-data'
import { StatsCard } from '@/components/shared/stats-card';
import { AlertCard } from '@/components/shared/alert-card';
import { PnLChart, DailyPnLChart, SportBreakdownChart, BookBreakdownChart, WinRateChart } from '@/components/dashboard/performance-charts';
import { TrendingUp, DollarSign, Target, Activity, ChartBar as BarChart3, TriangleAlert as AlertTriangle, Zap } from 'lucide-react';

export default function DashboardPage() {
  const stats = mockPerformanceStats;
  const unreadAlerts = mockAlerts.filter((a) => !a.is_read);

  const todayPnL = mockDailyPnL[mockDailyPnL.length - 1];
  const yesterdayPnL = mockDailyPnL[mockDailyPnL.length - 2];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        <StatsCard
          title="Total Profit"
          value={`$${stats.totalProfit.toFixed(2)}`}
          subvalue={`${stats.totalBets} bets`}
          variant="positive"
          icon={DollarSign}
          change={4.8}
          changeLabel="vs. last month"
        />
        <StatsCard
          title="ROI"
          value={`${(stats.roi * 100).toFixed(1)}%`}
          subvalue={`$${stats.totalStaked} staked`}
          variant="positive"
          icon={TrendingUp}
          change={1.2}
        />
        <StatsCard
          title="Win Rate"
          value={`${(stats.winRate * 100).toFixed(1)}%`}
          subvalue={`${stats.wins}W - ${stats.losses}L - ${stats.pushes}P`}
          icon={Target}
          change={2.1}
        />
        <StatsCard
          title="Avg CLV"
          value={`+${(stats.avgClv * 100).toFixed(2)}%`}
          subvalue="Closing line value"
          variant="positive"
          icon={Activity}
        />
        <StatsCard
          title="Avg EV"
          value={`+${stats.avgEv.toFixed(1)}%`}
          subvalue="Expected value"
          variant="positive"
          icon={Zap}
        />
        <StatsCard
          title="Current Streak"
          value={`${stats.streak} ${stats.streakType === 'win' ? 'W' : 'L'}`}
          subvalue="Active streak"
          variant={stats.streakType === 'win' ? 'positive' : 'negative'}
          icon={BarChart3}
        />
      </div>

      {unreadAlerts.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-semibold text-foreground">
              Active Alerts
              <span className="ml-2 px-1.5 py-0.5 text-[10px] font-bold rounded bg-blue-500/20 text-blue-400">
                {unreadAlerts.length}
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {unreadAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} compact />
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PnLChart />
        <DailyPnLChart />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <WinRateChart />
        <SportBreakdownChart />
        <BookBreakdownChart />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Today's P&L</p>
          <p className={`text-2xl font-bold tabular-nums ${todayPnL.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {todayPnL.profit >= 0 ? '+' : ''}{todayPnL.profit.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{todayPnL.bets} bets today</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Pending Bets</p>
          <p className="text-2xl font-bold tabular-nums text-blue-400">{stats.pending}</p>
          <p className="text-xs text-muted-foreground mt-1">Awaiting results</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Avg Odds</p>
          <p className="text-2xl font-bold tabular-nums text-foreground">{stats.avgOdds.toFixed(0)}</p>
          <p className="text-xs text-muted-foreground mt-1">American odds avg</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Total Staked</p>
          <p className="text-2xl font-bold tabular-nums text-foreground">${stats.totalStaked.toFixed(0)}</p>
          <p className="text-xs text-muted-foreground mt-1">All-time</p>
        </div>
      </div>
    </div>
  );
}
