import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, applicationDefault } from 'firebase-admin/app';

declare global {
  // Prevent re-initialization of Firebase Admin
  var _firebaseAdminInitialized: boolean | undefined;
}

if (!global._firebaseAdminInitialized) {
  initializeApp({
    credential: applicationDefault(),
  });
  global._firebaseAdminInitialized = true;
}

const db = getFirestore();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, location, farmSize, language, notifications, voiceAssistant, theme } = body;
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await db.collection('users').doc(userId).set({
      name,
      location,
      farmSize,
      language,
      notifications,
      voiceAssistant,
      theme,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
