import { NextResponse } from 'next/server';
import { searchInsights } from '@/agents/peoplexity';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const { query } = await req.json();

  const insights = await searchInsights(query);
  return NextResponse.json(insights);
}
