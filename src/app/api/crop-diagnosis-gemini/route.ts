// Minimal valid API route to satisfy Next.js
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'Gemini crop diagnosis API placeholder' });
}

// Default export to ensure module status
export default function handler() {
  return null;
}
