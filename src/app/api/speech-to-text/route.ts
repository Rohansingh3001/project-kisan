import { NextRequest, NextResponse } from 'next/server';
// @ts-ignore
import FormData from 'form-data';
import fetch, { Headers } from 'node-fetch';

// Use OpenAI Whisper API for speech-to-text (no Google Cloud required)
// Requires OPENAI_API_KEY in .env.local

export async function POST(request: NextRequest) {
  try {
    const { audioData, language = 'en' } = await request.json();
    if (!audioData) {
      return NextResponse.json({ error: 'Audio data is required' }, { status: 400 });
    }
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OPENAI_API_KEY not set' }, { status: 500 });
    }

    // Decode base64 audio to buffer
    const audioBuffer = Buffer.from(audioData, 'base64');
    // Use form-data npm package for Node.js compatibility
    const formData = new FormData();
    formData.append('file', audioBuffer, {
      filename: 'audio.webm',
      contentType: 'audio/webm',
      knownLength: audioBuffer.length
    });
    formData.append('model', 'whisper-1');
    formData.append('language', language);
    const openaiRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        ...formData.getHeaders()
      },
      // @ts-ignore
      body: formData as any
    });
    if (!openaiRes.ok) {
      const err = await openaiRes.text();
      console.error('OpenAI Whisper API error:', err);
      return NextResponse.json({ error: 'OpenAI Whisper API error', details: err }, { status: 500 });
    }
    const data = await openaiRes.json() as { text?: string; [key: string]: any };
    if (!data.text) {
      console.error('No transcript returned from Whisper:', data);
      return NextResponse.json({ error: 'No transcript returned from Whisper', details: data }, { status: 500 });
    }
    return NextResponse.json({ transcript: data.text, language });
  } catch (error) {
    console.error('Speech-to-text API error:', error);
    return NextResponse.json({ error: 'Failed to transcribe audio' }, { status: 500 });
  }
}

// Example implementation for actual Google Speech-to-Text integration:
/*
import { SpeechClient } from '@google-cloud/speech';

export async function POST(request: NextRequest) {
  try {
    const { audioData, language = 'en' } = await request.json();

    const client = new SpeechClient({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });

    // Configure speech recognition
    const config = {
      encoding: 'WEBM_OPUS',
      sampleRateHertz: 48000,
      languageCode: language === 'kn' ? 'kn-IN' : language === 'hi' ? 'hi-IN' : 'en-IN',
      alternativeLanguageCodes: ['en-US', 'kn-IN', 'hi-IN'],
      enableAutomaticPunctuation: true,
      enableWordTimeOffsets: true,
    };

    const audio = {
      content: audioData, // Base64 encoded audio
    };

    const request = {
      config: config,
      audio: audio,
    };

    // Perform speech recognition
    const [response] = await client.recognize(request);
    const transcription = response.results
      ?.map(result => result.alternatives?.[0]?.transcript)
      .join('\n');

    const confidence = response.results?.[0]?.alternatives?.[0]?.confidence || 0;

    return NextResponse.json({
      transcript: transcription,
      confidence,
      language
    });
  } catch (error) {
    console.error('Google Speech-to-Text API error:', error);
    return NextResponse.json(
      { error: 'Failed to transcribe audio' },
      { status: 500 }
    );
  }
}
*/
