'use client';
import { ChartCard } from "@/components/dashboard/chart-card";
import { mockDailyPnL, mockSportBreakdown, mockBookBreakdown } from '@/lib/mock-data';
import {
  BookOpen,
  Brain,
  Calculator,
  BarChart3,
  ChevronRight,
  LayoutDashboard,
  Settings,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { cn } from '@/lib/utils';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

function ChartCard({ title, subtitle, children, className }: ChartCardProps) {
  return (
    <div className={cn('rounded-xl border border-border bg-card p-5', className)}>
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-sm font-semibold" style={{ color: entry.color }}>
          {entry.name}: {typeof entry.value === 'number' && entry.name?.includes('$') ? '' : ''}
          {typeof entry.value === 'number' ? (entry.value >= 0 ? '+' : '') : ''}
          {typeof entry.value === 'number' ? `$${Math.abs(entry.value).toFixed(2)}` : entry.value}
        </p>
      ))}
    </div>
  );
};

export function PnLChart() {
  return (
    <ChartCard title="Profit & Loss" subtitle="Cumulative P&L over time">
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={mockDailyPnL} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
          <defs>
            <linearGradient id="pnlGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 26% 17%)" />
          <XAxis
            dataKey="date"
            tick={{ fill: 'hsl(215 20% 55%)', fontSize: 10 }}
            tickFormatter={(v) => new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'hsl(215 20% 55%)', fontSize: 10 }}
            tickFormatter={(v) => `$${v}`}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="cumulative"
            name="$Cumulative"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#pnlGradient)"
            dot={false}
            activeDot={{ r: 4, fill: '#10b981', strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function DailyPnLChart() {
  return (
    <ChartCard title="Daily P&L" subtitle="Per-day profit and loss">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={mockDailyPnL} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 26% 17%)" />
          <XAxis
            dataKey="date"
            tick={{ fill: 'hsl(215 20% 55%)', fontSize: 10 }}
            tickFormatter={(v) => new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'hsl(215 20% 55%)', fontSize: 10 }}
            tickFormatter={(v) => `$${v}`}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="profit" name="$Daily P&L" radius={[3, 3, 0, 0]}>
            {mockDailyPnL.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.profit >= 0 ? '#10b981' : '#ef4444'} />
            ))}
          </Bar>
        </BarChart3>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function SportBreakdownChart() {
  return (
    <ChartCard title="Performance by Sport" subtitle="ROI % by sport category">
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={mockSportBreakdown} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 26% 17%)" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: 'hsl(215 20% 55%)', fontSize: 10 }}
            tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="sport"
            tick={{ fill: 'hsl(213 31% 91%)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload;
              return (
                <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-xl text-xs">
                  <p className="font-semibold text-foreground mb-1">{label}</p>
                  <p className="text-muted-foreground">ROI: <span className="text-emerald-400 font-mono">{(d.roi * 100).toFixed(1)}%</span></p>
                  <p className="text-muted-foreground">Profit: <span className="text-emerald-400 font-mono">${d.profit.toFixed(2)}</span></p>
                  <p className="text-muted-foreground">Record: <span className="text-foreground font-mono">{d.wins}-{d.bets - d.wins}</span></p>
                </div>
              );
            }}
          />
          <Bar dataKey="roi" radius={[0, 3, 3, 0]}>
            {mockSportBreakdown.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.roi >= 0 ? '#3b82f6' : '#ef4444'} />
            ))}
          </Bar>
        </BarChart3>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function BookBreakdownChart() {
  return (
    <ChartCard title="Performance by Book" subtitle="Profit and CLV by sportsbook">
      <div className="space-y-2.5">
        {mockBookBreakdown.map((book) => (
          <div key={book.sportsbook} className="flex items-center gap-3">
            <span className="text-xs text-foreground w-24 truncate shrink-0">{book.sportsbook}</span>
            <div className="flex-1 h-5 bg-secondary rounded overflow-hidden">
              <div
                className={cn(
                  'h-full rounded transition-all',
                  book.profit >= 0 ? 'bg-blue-500' : 'bg-red-500'
                )}
                style={{ width: `${Math.min(Math.abs(book.profit) / 250 * 100, 100)}%` }}
              />
            </div>
            <span className={cn(
              'text-xs font-mono font-semibold w-16 text-right shrink-0',
              book.profit >= 0 ? 'text-emerald-400' : 'text-red-400'
            )}>
              {book.profit >= 0 ? '+' : '-'}${Math.abs(book.profit).toFixed(0)}
            </span>
            <span className="text-xs font-mono text-muted-foreground w-14 text-right shrink-0">
              {(book.roi * 100).toFixed(1)}% ROI
            </span>
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
    <ChartCard title="Win Rate Breakdown" subtitle="Distribution of bet outcomes">
      <div className="flex items-center gap-6">
        <ResponsiveContainer width="50%" height={140}>
          <PieChart>
            <Pie
              data={WIN_RATE_DATA}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={62}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {WIN_RATE_DATA.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="space-y-2">
          {WIN_RATE_DATA.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: entry.color }} />
              <span className="text-xs text-muted-foreground">{entry.name}</span>
              <span className="text-xs font-bold font-mono ml-auto pl-3" style={{ color: entry.color }}>
                {entry.value}
              </span>
            </div>
          ))}
          <div className="pt-1 border-t border-border">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 shrink-0" />
              <span className="text-xs text-muted-foreground">Win Rate</span>
              <span className="text-xs font-bold font-mono text-emerald-400 ml-auto pl-3">63.6%</span>
            </div>
          </div>
        </div>
      </div>
    </ChartCard>
  );
}
