'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, TrendingUp, Calculator, BookOpen, Users, Brain, Settings, Zap, ChartBar as BarChart3, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Odds', href: '/odds', icon: TrendingUp },
  { label: 'EV Calculator', href: '/ev', icon: Calculator },
  { label: 'Bet Tracker', href: '/bets', icon: BookOpen },
  { label: 'Props', href: '/props', icon: Users },
  { label: 'Models', href: '/models', icon: Brain },
];

const bottomItems = [
  { label: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 flex flex-col border-r border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar))] z-50">
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-[hsl(var(--sidebar-border))]">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30">
          <Zap className="w-4 h-4 text-blue-400" />
        </div>
        <div>
          <span className="font-bold text-sm tracking-wide text-foreground">EdgeBet</span>
          <span className="block text-[10px] text-muted-foreground tracking-widest uppercase">Pro</span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <div className="mb-3">
          <span className="px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
            Analytics
          </span>
        </div>
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground border border-transparent'
              )}
            >
              <Icon
                className={cn(
                  'w-4 h-4 shrink-0 transition-colors',
                  isActive ? 'text-blue-400' : 'text-muted-foreground group-hover:text-foreground'
                )}
              />
              <span className="flex-1">{label}</span>
              {isActive && <ChevronRight className="w-3 h-3 text-blue-400/60" />}
            </Link>
          );
        })}

        <div className="mt-6 mb-3">
          <span className="px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
            System
          </span>
        </div>
        {bottomItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground border border-transparent'
              )}
            >
              <Icon
                className={cn(
                  'w-4 h-4 shrink-0',
                  isActive ? 'text-blue-400' : 'text-muted-foreground group-hover:text-foreground'
                )}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-[hsl(var(--sidebar-border))]">
        <div className="rounded-md bg-emerald-500/10 border border-emerald-500/20 px-3 py-2.5">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400">This Month</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-emerald-400">+$455.73</span>
            <span className="text-xs text-emerald-400/70">ROI 4.8%</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
