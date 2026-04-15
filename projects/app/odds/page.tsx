'use client';

import { useState } from 'react';
import { oddsData, betsData, propsData, modelPredictions } from '@/lib/mock-data'
import { OddsTable } from '@/components/odds/odds-table';
import { SportsbookCard } from '@/components/odds/sportsbook-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LayoutGrid, Table2, RefreshCw, Search, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

type ViewMode = 'table' | 'cards';

export default function OddsPage() {
  const [view, setView] = useState<ViewMode>('table');
  const [sport, setSport] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedGame, setSelectedGame] = useState(mockGameOdds[0]?.id || '');

  const filteredGames = mockGameOdds.filter((g) => {
    if (sport !== 'all' && g.sport !== sport) return false;
    if (search && !`${g.homeTeam} ${g.awayTeam}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const activeSportsbooks = ['DraftKings', 'FanDuel', 'BetMGM', 'Caesars', 'ESPN Bet', 'bet365'];
  const selectedGameData = mockGameOdds.find((g) => g.id === selectedGame) || mockGameOdds[0];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search games..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 bg-secondary border-border text-sm"
          />
        </div>

        <Select value={sport} onValueChange={setSport}>
          <SelectTrigger className="w-32 h-9 bg-secondary border-border text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">All Sports</SelectItem>
            {SPORTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1 bg-secondary border border-border rounded-lg p-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView('table')}
            className={cn('h-7 px-3 text-xs', view === 'table' ? 'bg-blue-500/20 text-blue-400' : 'text-muted-foreground')}
          >
            <Table2 className="w-3.5 h-3.5 mr-1.5" />
            Table
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView('cards')}
            className={cn('h-7 px-3 text-xs', view === 'cards' ? 'bg-blue-500/20 text-blue-400' : 'text-muted-foreground')}
          >
            <LayoutGrid className="w-3.5 h-3.5 mr-1.5" />
            Cards
          </Button>
        </div>

        <Button variant="outline" size="sm" className="h-9 border-border text-muted-foreground hover:text-foreground gap-2">
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </Button>
      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span>{filteredGames.length} games</span>
        <span>•</span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 live-indicator" />
          Live odds
        </span>
        <span>•</span>
        <span>Updated 2 min ago</span>
        <span className="ml-auto flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/30" />
          <span>Best available odds</span>
        </span>
      </div>

      {view === 'table' ? (
        <OddsTable games={filteredGames} sportsbooks={activeSportsbooks} />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {filteredGames.map((game) => (
              <button
                key={game.id}
                onClick={() => setSelectedGame(game.id)}
                className={cn(
                  'flex flex-col items-start gap-0.5 px-3 py-2 rounded-lg border text-left whitespace-nowrap text-xs transition-all',
                  selectedGame === game.id
                    ? 'bg-blue-500/15 border-blue-500/30 text-blue-400'
                    : 'bg-secondary border-border text-muted-foreground hover:text-foreground hover:border-border/80'
                )}
              >
                <span className="font-semibold">{game.awayTeam.split(' ').pop()} @ {game.homeTeam.split(' ').pop()}</span>
                <span className="opacity-70">{game.sport}</span>
              </button>
            ))}
          </div>

          {selectedGameData && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="text-base font-semibold text-foreground">
                  {selectedGameData.awayTeam} @ {selectedGameData.homeTeam}
                </h3>
                <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded font-semibold">
                  {selectedGameData.sport}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {activeSportsbooks.map((book) => {
                  const homeLine = selectedGameData.homeLines.find((l) => l.sportsbook === book);
                  const awayLine = selectedGameData.awayLines.find((l) => l.sportsbook === book);
                  return (
                    <SportsbookCard
                      key={book}
                      sportsbook={book}
                      homeLine={homeLine}
                      awayLine={awayLine}
                      homeTeam={selectedGameData.homeTeam}
                      awayTeam={selectedGameData.awayTeam}
                      isBestHome={selectedGameData.bestHome.sportsbook === book}
                      isBestAway={selectedGameData.bestAway.sportsbook === book}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
