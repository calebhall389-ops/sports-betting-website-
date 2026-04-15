import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      bets: {
        Row: {
          id: string;
          created_at: string;
          game: string;
          sport: string;
          market: string;
          sportsbook: string;
          odds: number;
          stake: number;
          result: string;
          profit: number | null;
          placed_line: number | null;
          closing_line: number | null;
          live_line: number | null;
          clv: number | null;
          notes: string | null;
        };
        Insert: Omit<Database['public']['Tables']['bets']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['bets']['Insert']>;
      };
      bet_alerts: {
        Row: {
          id: string;
          created_at: string;
          type: string;
          game: string | null;
          sportsbook: string | null;
          message: string;
          ev_pct: number | null;
          is_read: boolean;
        };
        Insert: Omit<Database['public']['Tables']['bet_alerts']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['bet_alerts']['Insert']>;
      };
      settings: {
        Row: {
          id: string;
          created_at: string;
          key: string;
          value: string;
        };
        Insert: Omit<Database['public']['Tables']['settings']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['settings']['Insert']>;
      };
    };
  };
};
