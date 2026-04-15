import { NextResponse } from 'next/server';
import { propsData as mockPropPredictions } from '@/lib/mock-data';

export async function GET() {
  try {
    return NextResponse.json(mockPropPredictions);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch predictions' },
      { status: 500 }
    );
  }
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sport = searchParams.get('sport');
    const type = searchParams.get('type') || 'games';
    const minEv = parseFloat(searchParams.get('minEv') || '0');
    const minConf = parseInt(searchParams.get('minConf') || '0');

    if (type === 'props') {
      let props = mockPropPredictions;
      if (sport) props = props.filter((p) => p.sport === sport);
      if (minEv > 0) props = props.filter((p) => p.ev >= minEv);
      if (minConf > 0) props = props.filter((p) => p.confidence >= minConf);
      props = props.sort((a, b) => b.ev - a.ev);

      return NextResponse.json({
        success: true,
        data: props,
        meta: {
          count: props.length,
          avgEv: props.length > 0 ? props.reduce((s, p) => s + p.ev, 0) / props.length : 0,
          source: 'mock',
          updatedAt: new Date().toISOString(),
        },
      });
    }

    let games = mockPredictions;
    if (sport) games = games.filter((g) => g.sport === sport);
    if (minEv > 0) games = games.filter(
      (g) => g.recommendation && g.recommendation.ev >= minEv
    );

    return NextResponse.json({
      success: true,
      data: games,
      meta: {
        count: games.length,
        withRecommendation: games.filter((g) => !!g.recommendation).length,
        source: 'mock',
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch predictions' },
      { status: 500 }
    );
  }
}
