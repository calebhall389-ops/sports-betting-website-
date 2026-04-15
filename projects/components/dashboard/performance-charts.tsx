'use client';

import { ChartCard } from '@/components/dashboard/chart-card';
import { mockDailyPnL, mockSportBreakdown, mockBookBreakdown } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import {
  Bar,
  BarChart3,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type TooltipProps = {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number | string;
    payload?: any;
  }>;
  label?: string;
};

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-border bg-background p-3 shadow-md">
      {label ? <p className="mb-2 text-sm font-medium">{label}</p> : null}
      <div className="space-y-1">
        {payload.map((entry, i) => (
          <p key={i} className="text-sm text-muted-foreground">
            {entry.name}: {typeof entry.value === 'number' ? entry.value : String(entry.value)}
          </p>
        ))}
      </div>
    </div>
  );
};

export function PnLChart() {
  return (
    <ChartCard title="Cumulative P&L" subtitle="Running bankroll performance">
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={mockDailyPnL} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="date"
            tickFormatter={(value: string) =>
              new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            }
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(value: number) => `$${value}`}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={<CustomTooltip />}
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Cumulative Profit']}
          />
          <Bar dataKey="cumulativeProfit" radius={[6, 6, 0, 0]}>
            {mockDailyPnL.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.cumulativeProfit >= 0 ? '#10b981' : '#ef4444'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function DailyPnLChart() {
  return (
    <ChartCard title="Daily P&L" subtitle="Per-day profit and loss">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={mockDailyPnL} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="date"
            tickFormatter={(value: string) =>
              new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            }
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(value: number) => `$${value}`}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={<CustomTooltip />}
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Profit']}
          />
          <Bar dataKey="profit" radius={[6, 6, 0, 0]}>
            {mockDailyPnL.map((entry, index) => (
              <Cell key={`daily-cell-${index}`} fill={entry.profit >= 0 ? '#10b981' : '#ef4444'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function SportBreakdownChart() {
  return (
    <ChartCard title="Sport Breakdown" subtitle="Profit by sport">
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={mockSportBreakdown}
            dataKey="profit"
            nameKey="sport"
            outerRadius={90}
            innerRadius={50}
            paddingAngle={3}
          >
            {mockSportBreakdown.map((entry, index) => (
              <Cell key={`sport-cell-${index}`} fill={entry.profit >= 0 ? '#3b82f6' : '#ef4444'} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload;
              return (
                <div className="rounded-lg border border-border bg-background p-3 shadow-md">
                  <p className="mb-1 text-sm font-medium">{label ?? d.sport}</p>
                  <p className="text-sm text-muted-foreground">ROI: {d.roi.toFixed(1)}%</p>
                  <p className="text-sm text-muted-foreground">Profit: ${d.profit.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">
                    Record: {d.wins}-{d.losses}
                  </p>
                </div>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function BookBreakdownChart() {
  return (
    <ChartCard title="Sportsbook Breakdown" subtitle="Performance by book">
      <div className="space-y-4">
        {mockBookBreakdown.map((book) => (
          <div key={book.sportsbook} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{book.sportsbook}</span>
              <span className={cn(book.profit >= 0 ? 'text-emerald-400' : 'text-red-400')}>
                {book.profit >= 0 ? '+' : '-'}${Math.abs(book.profit).toFixed(0)} · {book.roi.toFixed(1)}% ROI
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className={cn('h-full rounded-full', book.profit >= 0 ? 'bg-blue-500' : 'bg-red-500')}
                style={{ width: `${Math.min((Math.abs(book.profit) / 250) * 100, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}

const WIN_RATE_DATA = [
  { name: 'Wins', value: 7, color: '#10b981' },
  { name: 'Losses', value: 3, color: '#ef4444' },
  { name: 'Push', value: 1, color: '#f59e0b' },
  { name: 'Pending', value: 1, color: '#3b82f6' },
];

export function WinRateChart() {
  return (
    <ChartCard title="Bet Outcomes" subtitle="Win/loss distribution">
      <div className="grid gap-4 md:grid-cols-[220px_1fr]">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={WIN_RATE_DATA} dataKey="value" nameKey="name" outerRadius={80}>
              {WIN_RATE_DATA.map((entry, index) => (
                <Cell key={`winrate-cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        <div className="flex flex-col justify-center gap-3">
          {WIN_RATE_DATA.map((entry) => (
            <div key={entry.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-3 w-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span>{entry.name}</span>
              </div>
              <span className="font-medium">{entry.value}</span>
            </div>
          ))}
          <div className="pt-2 text-sm font-semibold">Win Rate 63.6%</div>
        </div>
      </div>
    </ChartCard>
  );
}
