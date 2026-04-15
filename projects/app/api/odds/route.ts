import { NextRequest, NextResponse } from 'next/server';
import { mockGameOdds } from '../lib/mock-data';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sport = searchParams.get('sport');
    const gameId = searchParams.get('gameId');

    let games = mockGameOdds;

    if (sport) {
      games = games.filter((g) => g.sport === sport);
    }

    if (gameId) {
      games = games.filter((g) => g.id === gameId);
    }

    return NextResponse.json({
      success: true,
      data: games,
      meta: {
        count: games.length,
        updatedAt: new Date().toISOString(),
        source: 'mock',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch odds' },
      { status: 500 }
    );
  }
}
