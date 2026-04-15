export type Sport = 'NFL' | 'NBA' | 'MLB' | 'NHL' | 'NCAAF' | 'NCAAB' | 'Soccer' | 'Tennis' | 'MMA' | 'Golf';

export type Market =
  | 'moneyline'
  | 'spread'
  | 'total'
  | 'team_total'
  | 'player_prop'
  | 'first_half'
  | 'first_quarter'
  | 'futures';
import type { Bet } from "@/lib/types";
export const betsData: Bet[] = [
  {
    id: "1",
    date: "2026-04-15",
    sport: "MLB",
    game: "Yankees vs Red Sox",
    betType: "Moneyline",
    selection: "Yankees",
    sportsbook: "DraftKings",
    odds: -120,
    stake: 50,
    toWin: 41.67,
    result: "pending",
    clv: 10,
    profit: 0,
  },
];

export type Sportsbook =
  | 'DraftKings'
  | 'FanDuel'
  | 'BetMGM'
  | 'Caesars'
  | 'PointsBet'
  | 'BetRivers'
  | 'Pinnacle'
  | 'ESPN Bet'
  | 'bet365';

export interface Bet {
  id: string;
  created_at: string;
  game: string;
  sport: Sport;
  market: Market;
  sportsbook: Sportsbook | string;
  odds: number;
  stake: number;
  result: BetResult;
  profit: number | null;
  placed_line: number | null;
  closing_line: number | null;
  live_line: number | null;
  clv: number | null;
  notes: string | null;
}

export interface OddsLine {
  sportsbook: Sportsbook | string;
  odds: number;
  spread?: number;
  lastUpdated: string;
  isOpen: boolean;
}

export interface GameOdds {
  id: string;
  homeTeam: string;
  awayTeam: string;
  sport: Sport;
  commenceTime: string;
  market: Market;
  homeLines: OddsLine[];
  awayLines: OddsLine[];
  drawLines?: OddsLine[];
  bestHome: OddsLine;
  bestAway: OddsLine;
}

export interface PlayerProp {
  id: string;
  player: string;
  team: string;
  sport: Sport;
  game: string;
  propType: string;
  line: number;
  overOdds: OddsLine[];
  underOdds: OddsLine[];
  bestOver: OddsLine;
  bestUnder: OddsLine;
  modelProjection?: number;
  modelEdge?: number;
}

export interface EVCalculation {
  americanOdds: number;
  fairOdds: number;
  modelProbability: number;
  impliedProbability: number;
  fairImpliedProbability: number;
  ev: number;
  evPct: number;
  decimalOdds: number;
  fairDecimalOdds: number;
}

export interface CLVEntry {
  betId: string;
  game: string;
  sport: Sport;
  market: Market;
  sportsbook: string;
  placedLine: number;
  closingLine: number;
  clvPct: number;
  clvUnits: number;
  date: string;
}

export interface PerformanceStats {
  totalBets: number;
  wins: number;
  losses: number;
  pushes: number;
  pending: number;
  winRate: number;
  totalStaked: number;
  totalProfit: number;
  roi: number;
  avgOdds: number;
  avgClv: number;
  avgEv: number;
  streak: number;
  streakType: 'win' | 'loss' | 'none';
}

export interface SportBreakdown {
  sport: Sport | string;
  bets: number;
  wins: number;
  profit: number;
  roi: number;
  winRate: number;
}

export interface BookBreakdown {
  sportsbook: string;
  bets: number;
  wins: number;
  profit: number;
  roi: number;
  avgClv: number;
}

export interface MarketBreakdown {
  market: Market | string;
  bets: number;
  wins: number;
  profit: number;
  roi: number;
  winRate: number;
}

export interface Prediction {
  id: string;
  game: string;
  homeTeam: string;
  awayTeam: string;
  sport: Sport;
  commenceTime: string;
  modelHomeProbability: number;
  modelAwayProbability: number;
  fairHomeOdds: number;
  fairAwayOdds: number;
  recommendation?: {
    side: 'home' | 'away' | 'over' | 'under';
    market: Market;
    betOdds: number;
    fairOdds: number;
    ev: number;
    confidence: number;
  };
  modelVersion: string;
  createdAt: string;
}

export interface PropPrediction {
  id: string;
  player: string;
  team: string;
  sport: Sport;
  game: string;
  propType: string;
  line: number;
  modelProjection: number;
  overProb: number;
  underProb: number;
  bestOdds: number;
  bestSide: 'over' | 'under';
  ev: number;
  confidence: number;
}

export interface Alert {
  id: string;
  created_at: string;
  type: 'ev_opportunity' | 'line_move' | 'sharp_action' | 'injury' | 'weather';
  game: string | null;
  sportsbook: string | null;
  message: string;
  ev_pct: number | null;
  is_read: boolean;
}

export interface DailyPnL {
  date: string;
  profit: number;
  cumulative: number;
  bets: number;
}
