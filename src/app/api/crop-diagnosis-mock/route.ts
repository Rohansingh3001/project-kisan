// Minimal valid API route to satisfy Next.js
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'Mock crop diagnosis API placeholder' });
}
