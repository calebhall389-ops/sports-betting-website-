export const oddsData = [
  {
    id: "1",
    sport: "NBA",
    game: "Lakers vs Warriors",
    market: "Spread",
    selection: "Lakers -4.5",
    sportsbook: "DraftKings",
    odds: -110,
    impliedProbability: 52.38,
    fairOdds: -102,
    ev: 3.2,
    clv: 1.4
  },
  {
    id: "2",
    sport: "MLB",
    game: "Yankees vs Red Sox",
    market: "Moneyline",
    selection: "Yankees",
    sportsbook: "FanDuel",
    odds: -125,
    impliedProbability: 55.56,
    fairOdds: -110,
    ev: 4.1,
    clv: 2.1
  }
];

export const betsData = [
  {
    id: "b1",
    date: "2026-04-14",
    sport: "NBA",
    game: "Lakers vs Warriors",
    betType: "Spread",
    selection: "Lakers -4.5",
    sportsbook: "DraftKings",
    odds: -110,
    stake: 50,
    toWin: 45.45,
    result: "Pending",
    clv: 1.4,
    profit: 0
  },
  {
    id: "b2",
    date: "2026-04-13",
    sport: "MLB",
    game: "Yankees vs Red Sox",
    betType: "Moneyline",
    selection: "Yankees",
    sportsbook: "FanDuel",
    odds: -125,
    stake: 40,
    toWin: 32,
    result: "Win",
    clv: 2.1,
    profit: 32
  }
];

export const propsData = [
  {
    id: "p1",
    player: "LeBron James",
    sport: "NBA",
    prop: "Points Over 27.5",
    sportsbook: "DraftKings",
    odds: -115,
    projection: 30.2,
    edge: 5.4,
    ev: 4.8
  },
  {
    id: "p2",
    player: "Aaron Judge",
    sport: "MLB",
    prop: "Hits Over 1.5",
    sportsbook: "FanDuel",
    odds: 140,
    projection: 1.8,
    edge: 4.1,
    ev: 3.6
  }
];

export const modelPredictions = [
  {
    id: "m1",
    event: "Lakers vs Warriors",
    market: "Lakers ML",
    modelProbability: 58,
    impliedProbability: 52.38,
    edge: 5.62,
    recommendation: "Bet"
  },
  {
    id: "m2",
    event: "Chiefs vs Bills",
    market: "Over 48.5",
    modelProbability: 54,
    impliedProbability: 51.22,
    edge: 2.78,
    recommendation: "Lean"
  }
];
export const mockGameOdds = oddsData;
export function americanToImplied(odds: number): number {
  if (odds > 0) {
    return 100 / (odds + 100);
  }
  return Math.abs(odds) / (Math.abs(odds) + 100);
}
export function americanToDecimal(odds: number): number {
  if (odds > 0) {
    return 1 + odds / 100;
  }
  return 1 + 100 / Math.abs(odds);
}
export function calculateProfit(odds: number, stake: number): number {
  const decimal = americanToDecimal(odds);
  return (decimal - 1) * stake;
}
export function calculateEV(probability: number, americanOdds: number): number {
  const decimalOdds = americanToDecimal(americanOdds);
  return probability * (decimalOdds - 1) - (1 - probability);
}
/**
 * Format American odds for display
 * Example: +150, -110
 */
export function formatOdds(odds: number): string {
  if (odds > 0) {
    return `+${odds}`;
  }
  return `${odds}`;
}
/**
 * Convert implied probability to American odds
 * Example: 0.60 → -150, 0.40 → +150
 */
export function impliedToAmerican(probability: number): number {
  if (probability <= 0 || probability >= 1) {
    throw new Error(
      "Probability must be between 0 and 1 (exclusive)."
    );
  }

  // Favorite (negative odds)
  if (probability >= 0.5) {
    return -Math.round((probability / (1 - probability)) * 100);
  }

  // Underdog (positive odds)
  return Math.round(((1 - probability) / probability) * 100);
}
/**
 * Supported sports list
 */
export const SPORTS = [
  {
    id: "nba",
    name: "NBA",
    description: "National Basketball Association"
  },
  {
    id: "nfl",
    name: "NFL",
    description: "National Football League"
  },
  {
    id: "mlb",
    name: "MLB",
    description: "Major League Baseball"
  },
  {
    id: "nhl",
    name: "NHL",
    description: "National Hockey League"
  },
  {
    id: "ncaaf",
    name: "NCAAF",
    description: "College Football"
  },
  {
    id: "ncaab",
    name: "NCAAB",
    description: "College Basketball"
  },
  {
    id: "soccer",
    name: "Soccer",
    description: "Global Football Competitions"
  },
  {
    id: "mma",
    name: "MMA",
    description: "Mixed Martial Arts"
  },
  {
    id: "tennis",
    name: "Tennis",
    description: "ATP and WTA Tours"
  },
  {
    id: "golf",
    name: "Golf",
    description: "PGA and International Tours"
  }
];
/**
 * Supported sportsbooks
 */
export type Sportsbook = {
  id: string;
  name: string;
  logo: string;
  website?: string;
};

export const SPORTSBOOKS: Sportsbook[] = [
  {
    id: "draftkings",
    name: "DraftKings",
    logo: "/sportsbooks/draftkings.png",
    website: "https://www.draftkings.com"
  },
  {
    id: "fanduel",
    name: "FanDuel",
    logo: "/sportsbooks/fanduel.png",
    website: "https://www.fanduel.com"
  },
  {
    id: "betmgm",
    name: "BetMGM",
    logo: "/sportsbooks/betmgm.png",
    website: "https://www.betmgm.com"
  },
  {
    id: "caesars",
    name: "Caesars",
    logo: "/sportsbooks/caesars.png",
    website: "https://www.caesars.com/sportsbook"
  },
  {
    id: "espnbet",
    name: "ESPN BET",
    logo: "/sportsbooks/espnbet.png",
    website: "https://espnbet.com"
  },
  {
    id: "bet365",
    name: "bet365",
    logo: "/sportsbooks/bet365.png",
    website: "https://www.bet365.com"
  }
];
/**
 * Supported betting markets
 */
export type Market = {
  id: string;
  name: string;
  category: "game" | "player" | "team" | "futures";
  description?: string;
};

export const MARKETS: Market[] = [
  {
    id: "moneyline",
    name: "Moneyline",
    category: "game",
    description: "Bet on the outright winner of a game."
  },
  {
    id: "spread",
    name: "Point Spread",
    category: "game",
    description: "Bet on a team to cover the point spread."
  },
  {
    id: "total",
    name: "Total (Over/Under)",
    category: "game",
    description: "Bet on whether the combined score goes over or under a set number."
  },
  {
    id: "player_points",
    name: "Player Points",
    category: "player",
    description: "Bet on a player's total points."
  },
  {
    id: "player_rebounds",
    name: "Player Rebounds",
    category: "player",
    description: "Bet on a player's total rebounds."
  },
  {
    id: "player_assists",
    name: "Player Assists",
    category: "player",
    description: "Bet on a player's total assists."
  },
  {
    id: "player_strikeouts",
    name: "Player Strikeouts",
    category: "player",
    description: "Bet on a pitcher's total strikeouts."
  },
  {
    id: "player_hits",
    name: "Player Hits",
    category: "player",
    description: "Bet on a player's total hits."
  },
  {
    id: "player_home_runs",
    name: "Player Home Runs",
    category: "player",
    description: "Bet on whether a player hits a home run."
  },
  {
    id: "team_total",
    name: "Team Total",
    category: "team",
    description: "Bet on a team's total points or runs."
  },
  {
    id: "futures_champion",
    name: "Futures - Champion",
    category: "futures",
    description: "Bet on a team to win the championship."
  }
];
/**
 * Mock Daily Profit & Loss (PnL) Data
 * Used for dashboard performance charts
 */
export type DailyPnL = {
  date: string;
  profit: number;
  cumulativeProfit: number;
};

export const mockDailyPnL: DailyPnL[] = [
  { date: "2026-04-01", profit: 45, cumulativeProfit: 45 },
  { date: "2026-04-02", profit: -20, cumulativeProfit: 25 },
  { date: "2026-04-03", profit: 30, cumulativeProfit: 55 },
  { date: "2026-04-04", profit: 15, cumulativeProfit: 70 },
  { date: "2026-04-05", profit: -10, cumulativeProfit: 60 },
  { date: "2026-04-06", profit: 50, cumulativeProfit: 110 },
  { date: "2026-04-07", profit: 25, cumulativeProfit: 135 },
  { date: "2026-04-08", profit: -5, cumulativeProfit: 130 },
  { date: "2026-04-09", profit: 40, cumulativeProfit: 170 },
  { date: "2026-04-10", profit: 35, cumulativeProfit: 205 },
  { date: "2026-04-11", profit: -15, cumulativeProfit: 190 },
  { date: "2026-04-12", profit: 20, cumulativeProfit: 210 },
  { date: "2026-04-13", profit: 55, cumulativeProfit: 265 },
  { date: "2026-04-14", profit: 30, cumulativeProfit: 295 }
];
/**
 * Mock Profit Breakdown by Sport
 * Used for dashboard pie and bar charts
 */
export type SportBreakdown = {
  sport: string;
  bets: number;
  wins: number;
  losses: number;
  profit: number;
  roi: number;
};

export const mockSportBreakdown: SportBreakdown[] = [
  {
    sport: "NBA",
    bets: 42,
    wins: 24,
    losses: 18,
    profit: 320,
    roi: 7.6
  },
  {
    sport: "NFL",
    bets: 30,
    wins: 17,
    losses: 13,
    profit: 275,
    roi: 9.2
  },
  {
    sport: "MLB",
    bets: 38,
    wins: 20,
    losses: 18,
    profit: 145,
    roi: 3.8
  },
  {
    sport: "NHL",
    bets: 22,
    wins: 12,
    losses: 10,
    profit: 95,
    roi: 4.3
  },
  {
    sport: "Soccer",
    bets: 18,
    wins: 10,
    losses: 8,
    profit: 120,
    roi: 6.7
  }
];
/**
 * Mock Profit Breakdown by Sportsbook
 * Used for dashboard charts and analytics
 */
export type BookBreakdown = {
  sportsbook: string;
  bets: number;
  wins: number;
  losses: number;
  profit: number;
  roi: number;
};

export const mockBookBreakdown: BookBreakdown[] = [
  {
    sportsbook: "DraftKings",
    bets: 34,
    wins: 20,
    losses: 14,
    profit: 260,
    roi: 7.6
  },
  {
    sportsbook: "FanDuel",
    bets: 29,
    wins: 17,
    losses: 12,
    profit: 210,
    roi: 7.2
  },
  {
    sportsbook: "BetMGM",
    bets: 22,
    wins: 12,
    losses: 10,
    profit: 145,
    roi: 6.6
  },
  {
    sportsbook: "Caesars",
    bets: 18,
    wins: 10,
    losses: 8,
    profit: 95,
    roi: 5.3
  },
  {
    sportsbook: "ESPN BET",
    bets: 12,
    wins: 7,
    losses: 5,
    profit: 75,
    roi: 6.2
  }
];
/**
 * Mock Alerts for Betting Opportunities
 * Used for notifications, EV signals, and line movement tracking
 */
export type Alert = {
  id: string;
  type: "EV" | "CLV" | "Steam" | "Value" | "Injury" | "Model";
  title: string;
  description: string;
  sport: string;
  confidence: number;
  timestamp: string;
  status: "new" | "read";
};

export const mockAlerts: Alert[] = [
  {
    id: "alert-1",
    type: "EV",
    title: "Positive EV Opportunity",
    description: "Lakers -4.5 shows +4.2% expected value at DraftKings.",
    sport: "NBA",
    confidence: 92,
    timestamp: "2026-04-14T10:30:00Z",
    status: "new"
  },
  {
    id: "alert-2",
    type: "CLV",
    title: "Strong Closing Line Value",
    description: "You beat the closing line by 12 cents on Yankees ML.",
    sport: "MLB",
    confidence: 88,
    timestamp: "2026-04-14T09:15:00Z",
    status: "new"
  },
  {
    id: "alert-3",
    type: "Steam",
    title: "Steam Move Detected",
    description: "Heavy action detected on Chiefs -3 across multiple books.",
    sport: "NFL",
    confidence: 85,
    timestamp: "2026-04-14T08:45:00Z",
    status: "read"
  },
  {
    id: "alert-4",
    type: "Value",
    title: "Line Shopping Opportunity",
    description: "FanDuel offers +105 while consensus is -110.",
    sport: "NBA",
    confidence: 81,
    timestamp: "2026-04-14T07:20:00Z",
    status: "read"
  },
  {
    id: "alert-5",
    type: "Model",
    title: "AI Model Pick",
    description: "Model projects Over 48.5 in Bills vs Chiefs with 56% probability.",
    sport: "NFL",
    confidence: 87,
    timestamp: "2026-04-14T06:00:00Z",
    status: "new"
  }
];
