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

    let data = type === 'props' ? mockPropPredictions : mockPredictions;

    if (sport) {
      data = data.filter((item: any) => item.sport === sport);
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch predictions' },
      { status: 500 }
    );
  }
}
