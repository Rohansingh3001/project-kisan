import { NextRequest, NextResponse } from 'next/server';

// This route proxies requests to the Groq API (OpenAI-compatible)
// Requires GROQ_API_KEY in .env.local

export async function POST(req: NextRequest) {
  try {
    // Accepts either { query, language } (legacy) or { messages, language } (preferred)
    const body = await req.json();
    // Use OpenAI API key directly (for OpenAI API)
    const apiKey = process.env.OPENAI_API_KEY || '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';
    if (!apiKey) {
      return NextResponse.json({ error: 'OPENAI_API_KEY not set' }, { status: 500 });
    }

    let messages = body.messages;
    if (!messages && body.query) {
      // Fallback for old clients: build messages from query
      let prompt = body.query;
      if (body.language && body.language !== 'en') {
        prompt = `Answer in ${body.language}: ` + body.query;
      }
      messages = [
        { role: 'system', content: 'You are a helpful agricultural assistant for Indian farmers.' },
        { role: 'user', content: prompt }
      ];
    }
    if (!messages) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 });
    }

    // Use OpenAI API endpoint and model
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 512,
        temperature: 0.7
      })
    });

    if (!openaiRes.ok) {
      const err = await openaiRes.text();
      return NextResponse.json({ error: err }, { status: 500 });
    }
    const data = await openaiRes.json();
    const text = data.choices?.[0]?.message?.content || '';
    return NextResponse.json({ text });
  } catch (e) {
    return NextResponse.json({ error: 'Groq API error', details: String(e) }, { status: 500 });
  }
}
