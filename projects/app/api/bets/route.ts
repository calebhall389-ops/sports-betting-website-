import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabase();
    const { searchParams } = new URL(req.url);
    const sport = searchParams.get('sport');
    const result = searchParams.get('result');
    const limit = parseInt(searchParams.get('limit') || '100');

    let query = supabase
      .from('bets')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (sport) query = query.eq('sport', sport);
    if (result) query = query.eq('result', result);

    const { data, error } = await query;

    if (error) throw error;

    const totalProfit = (data || []).reduce((sum: number, b: any) => sum + (b.profit || 0), 0);
    const totalStaked = (data || []).reduce((sum: number, b: any) => sum + b.stake, 0);
    const wins = (data || []).filter((b: any) => b.result === 'win').length;
    const settled = (data || []).filter((b: any) => b.result !== 'pending').length;

    return NextResponse.json({
      success: true,
      data: data || [],
      meta: {
        count: (data || []).length,
        totalProfit,
        totalStaked,
        roi: totalStaked > 0 ? totalProfit / totalStaked : 0,
        winRate: settled > 0 ? wins / settled : 0,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch bets' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabase();
    const body = await req.json();

    const { game, sport, market, sportsbook, odds, stake, placed_line, notes } = body;

    if (!game || !odds || !stake) {
      return NextResponse.json(
        { success: false, error: 'game, odds, and stake are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('bets')
      .insert({
        game,
        sport: sport || 'NFL',
        market: market || 'moneyline',
        sportsbook: sportsbook || 'DraftKings',
        odds: parseInt(odds),
        stake: parseFloat(stake),
        result: 'pending',
        placed_line: placed_line ? parseInt(placed_line) : parseInt(odds),
        notes: notes || null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create bet' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const supabase = getSupabase();
    const body = await req.json();
    const { id, result, profit, closing_line, clv } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });
    }

    const updates: Record<string, any> = {};
    if (result !== undefined) updates.result = result;
    if (profit !== undefined) updates.profit = profit;
    if (closing_line !== undefined) updates.closing_line = closing_line;
    if (clv !== undefined) updates.clv = clv;

    const { data, error } = await supabase
      .from('bets')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update bet' },
      { status: 500 }
    );
  }
}
