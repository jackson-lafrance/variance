import { db } from '../services/firebase';
import { collection, addDoc, query, where, orderBy, getDocs } from 'firebase/firestore';

export interface PracticeSession {
  id?: string;
  userId: string;
  simulationType: string;
  accuracy: number;
  correctCount: number;
  incorrectCount: number;
  handsPlayed?: number;
  duration?: number;
  timestamp: number;
  date: string;
}

export async function savePracticeSession(
  userId: string,
  simulationType: string,
  accuracy: number,
  correctCount: number,
  incorrectCount: number,
  handsPlayed?: number,
  duration?: number
): Promise<void> {
  try {
    await addDoc(collection(db, 'practiceSessions'), {
      userId,
      simulationType,
      accuracy,
      correctCount,
      incorrectCount,
      handsPlayed,
      duration,
      timestamp: Date.now(),
      date: new Date().toISOString().split('T')[0],
    });
  } catch (error) {
    console.error('Error saving practice session:', error);
  }
}

export async function getUserPracticeSessions(
  userId: string,
  simulationType?: string
): Promise<PracticeSession[]> {
  try {
    let q = query(
      collection(db, 'practiceSessions'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
    );

    if (simulationType) {
      q = query(
        collection(db, 'practiceSessions'),
        where('userId', '==', userId),
        where('simulationType', '==', simulationType),
        orderBy('timestamp', 'desc'),
      );
    }

    const snapshot = await getDocs(q);
    const sessions: PracticeSession[] = [];
    snapshot.forEach((doc) => {
      sessions.push({ id: doc.id, ...doc.data() } as PracticeSession);
    });
    return sessions;
  } catch (error: any) {
    if (error.code === 'failed-precondition') {
      return [];
    }
    console.error('Error loading practice sessions:', error);
    return [];
  }
}


