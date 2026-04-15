/*
  # Create Sports Betting App Tables

  ## Summary
  Initial schema for the sports betting application with two core tables.

  ## Tables

  ### bets
  Stores all placed bets with full tracking information for CLV analysis and performance metrics.
  - id: unique identifier
  - created_at: timestamp when bet was placed
  - game: game/matchup description (e.g., "Chiefs vs Bills")
  - sport: sport category (NFL, NBA, MLB, etc.)
  - market: bet market (moneyline, spread, total, etc.)
  - sportsbook: which sportsbook the bet was placed at
  - odds: American odds at time of placement
  - stake: amount wagered in USD
  - result: win/loss/push/pending
  - profit: net profit/loss on the bet
  - placed_line: American odds at time of placement (for CLV comparison)
  - closing_line: final closing line American odds
  - live_line: current live line if available
  - clv: closing line value as decimal (placed_line implied prob - closing implied prob)
  - notes: optional notes about the bet

  ### bet_alerts
  Stores automated alerts for EV opportunities and line movements.
  - id: unique identifier
  - created_at: timestamp
  - type: alert type (ev_opportunity, line_move, etc.)
  - game: game reference
  - sportsbook: relevant sportsbook
  - message: alert description
  - ev_pct: expected value percentage if applicable
  - is_read: whether alert has been acknowledged

  ## Security
  - RLS enabled on both tables
  - Anon role policies allow access without authentication (to be restricted when auth is added)
*/

CREATE TABLE IF NOT EXISTS bets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  game text NOT NULL,
  sport text NOT NULL DEFAULT 'NFL',
  market text NOT NULL DEFAULT 'moneyline',
  sportsbook text NOT NULL,
  odds integer NOT NULL,
  stake numeric(10,2) NOT NULL DEFAULT 0,
  result text NOT NULL DEFAULT 'pending',
  profit numeric(10,2),
  placed_line integer,
  closing_line integer,
  live_line integer,
  clv numeric(10,4),
  notes text
);

ALTER TABLE bets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon read bets"
  ON bets FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anon insert bets"
  ON bets FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon update bets"
  ON bets FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon delete bets"
  ON bets FOR DELETE
  TO anon
  USING (true);

CREATE TABLE IF NOT EXISTS bet_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  type text NOT NULL DEFAULT 'ev_opportunity',
  game text,
  sportsbook text,
  message text NOT NULL,
  ev_pct numeric(6,2),
  is_read boolean NOT NULL DEFAULT false
);

ALTER TABLE bet_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon read alerts"
  ON bet_alerts FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anon insert alerts"
  ON bet_alerts FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon update alerts"
  ON bet_alerts FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  key text UNIQUE NOT NULL,
  value text NOT NULL
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon read settings"
  ON settings FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anon insert settings"
  ON settings FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon update settings"
  ON settings FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS bets_sport_idx ON bets(sport);
CREATE INDEX IF NOT EXISTS bets_sportsbook_idx ON bets(sportsbook);
CREATE INDEX IF NOT EXISTS bets_result_idx ON bets(result);
CREATE INDEX IF NOT EXISTS bets_created_at_idx ON bets(created_at DESC);
