// Minimal valid API route to satisfy Next.js
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'Gemini crop diagnosis API placeholder' });
}
