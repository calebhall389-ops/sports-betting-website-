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

export const mockGameOdds = oddsData;
