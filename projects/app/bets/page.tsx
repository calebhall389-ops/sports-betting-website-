"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { betsData as mockBets } from "@/lib/mock-data";
import { supabase } from "@/lib/supabase";

type Bet = {
  id: string;
  date?: string;
  created_at?: string;
  sport: string;
  game: string;
  betType?: string;
  market?: string;
  selection: string;
  sportsbook: string;
  odds: number;
  stake: number;
  toWin?: number;
  to_win?: number;
  result: "win" | "loss" | "push" | "pending";
  placed_line?: number;
  closing_line?: number;
  clv?: number;
  profit?: number;
};

export default function BetsPage() {
  const [bets, setBets] = useState<Bet[]>(mockBets);

  useEffect(() => {
    async function fetchBets() {
      const { data, error } = await supabase.from("bets").select("*");

      if (error) {
        console.error("Error fetching bets:", error);
        return;
      }

      if (data) {
        setBets(data as Bet[]);
      }
    }

    fetchBets();
  }, []);

  return (
    <div className={cn("p-6")}>
      <h1 className="text-2xl font-bold mb-4">Bet Tracker</h1>
      <p>Total Bets: {bets.length}</p>
    </div>
  );
}
