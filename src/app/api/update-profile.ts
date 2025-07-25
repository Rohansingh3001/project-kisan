import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';

// Add a type declaration for the global variable
declare global {
  // eslint-disable-next-line no-var
  var _firebaseAdminInitialized: boolean | undefined;
}

// Only initialize once
if (!global._firebaseAdminInitialized) {
  initializeApp({
    credential: applicationDefault(),
  });
  global._firebaseAdminInitialized = true;
}

const db = getFirestore();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { name, location, farmSize, language, notifications, voiceAssistant, theme } = req.body;
    // You should get the user id from session/auth context
    const userId = req.headers['x-user-id'] as string;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
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
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update profile' });
  }
}
