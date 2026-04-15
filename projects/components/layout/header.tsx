'use client';

import { usePathname } from 'next/navigation';
import { Bell, RefreshCw, Circle } from 'lucide-react';
import { mockAlerts } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const pageTitles: Record<string, { title: string; description: string }> = {
  '/dashboard': { title: 'Dashboard', description: 'Performance overview and key metrics' },
  '/odds': { title: 'Odds Dashboard', description: 'Live odds comparison across sportsbooks' },
  '/ev': { title: 'EV Calculator', description: 'Expected value and implied odds analysis' },
  '/bets': { title: 'Bet Tracker', description: 'Track and analyze your bet history' },
  '/props': { title: 'Player Props', description: 'AI-powered player prop analysis' },
  '/models': { title: 'Models & Predictions', description: 'AI game predictions and analysis' },
  '/settings': { title: 'Settings', description: 'Configure your betting preferences' },
};

export function Header() {
  const pathname = usePathname();
  const pageInfo = pageTitles[pathname] || { title: 'EdgeBet Pro', description: '' };
  const unreadAlerts = mockAlerts.filter((a) => !a.is_read);

  const alertTypeColors: Record<string, string> = {
    ev_opportunity: 'text-emerald-400',
    line_move: 'text-amber-400',
    sharp_action: 'text-blue-400',
    injury: 'text-red-400',
    weather: 'text-slate-400',
  };

  return (
    <header className="h-16 border-b border-border bg-[hsl(220_26%_8%)] flex items-center px-6 gap-4 sticky top-0 z-40">
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-semibold text-foreground truncate">{pageInfo.title}</h1>
        {pageInfo.description && (
          <p className="text-xs text-muted-foreground truncate">{pageInfo.description}</p>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 live-indicator" />
          <span className="text-xs text-emerald-400 font-medium">Live</span>
        </div>

        <Button variant="ghost" size="icon" className="w-9 h-9 text-muted-foreground hover:text-foreground">
          <RefreshCw className="w-4 h-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative w-9 h-9 text-muted-foreground hover:text-foreground">
              <Bell className="w-4 h-4" />
              {unreadAlerts.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-blue-500 text-[9px] font-bold text-white flex items-center justify-center">
                  {unreadAlerts.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-card border-border">
            <div className="px-3 py-2 border-b border-border">
              <span className="text-sm font-semibold text-foreground">Alerts</span>
              {unreadAlerts.length > 0 && (
                <span className="ml-2 px-1.5 py-0.5 text-[10px] font-bold rounded bg-blue-500/20 text-blue-400">
                  {unreadAlerts.length} new
                </span>
              )}
            </div>
            {mockAlerts.slice(0, 5).map((alert, i) => (
              <div key={alert.id}>
                <DropdownMenuItem className="flex flex-col items-start gap-1 px-3 py-2.5 cursor-pointer">
                  <div className="flex items-center gap-2 w-full">
                    <Circle
                      className={cn(
                        'w-2 h-2 shrink-0 fill-current',
                        alertTypeColors[alert.type] || 'text-slate-400',
                        !alert.is_read ? 'opacity-100' : 'opacity-40'
                      )}
                    />
                    <span className={cn('text-xs font-medium flex-1', alert.is_read ? 'text-muted-foreground' : 'text-foreground')}>
                      {alert.type.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {getRelativeTime(alert.created_at)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground pl-4 leading-relaxed">{alert.message}</p>
                </DropdownMenuItem>
                {i < mockAlerts.length - 1 && <DropdownMenuSeparator className="bg-border/50" />}
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-2 pl-2 border-l border-border ml-1">
          <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
            <span className="text-xs font-bold text-blue-400">B</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-medium text-foreground">Bettor Pro</p>
          </div>
        </div>
      </div>
    </header>
  );
}

function getRelativeTime(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
