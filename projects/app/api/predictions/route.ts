import { NextRequest, NextResponse } from 'next/server';
import {
  modelPredictions as mockPredictions,
  propsData as mockPropPredictions,
} from '@/lib/mock-data';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const sport = searchParams.get('sport');

    if (type === 'props') {
      const filteredProps = sport
        ? mockPropPredictions.filter((item) => item.sport === sport)
        : mockPropPredictions;

      return NextResponse.json(filteredProps);
    }

    const filteredPredictions = sport
      ? mockPredictions.filter((item) => {
          if ('sport' in item) {
            return item.sport === sport;
          }
          return true;
        })
      : mockPredictions;

    return NextResponse.json(filteredPredictions);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch predictions' },
      { status: 500 }
    );
  }
}
