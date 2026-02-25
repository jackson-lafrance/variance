import { db } from '../services/firebase';
import { collection, addDoc, query, where, orderBy, getDocs } from 'firebase/firestore';
import type { QueryConstraint } from 'firebase/firestore';

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
  const constraints: QueryConstraint[] = [where('userId', '==', userId)];
  if (simulationType) {
    constraints.push(where('simulationType', '==', simulationType));
  }

  const mapSnapshotToSessions = (snapshot: any): PracticeSession[] => {
    const sessions: PracticeSession[] = [];
    snapshot.forEach((doc: any) => {
      sessions.push({ id: doc.id, ...doc.data() } as PracticeSession);
    });
    return sessions;
  };

  try {
    const orderedQuery = query(
      collection(db, 'practiceSessions'),
      ...constraints,
      orderBy('timestamp', 'desc'),
    );
    const snapshot = await getDocs(orderedQuery);
    return mapSnapshotToSessions(snapshot);
  } catch (error: any) {
    if (error.code === 'failed-precondition') {
      try {
        const fallbackQuery = query(
          collection(db, 'practiceSessions'),
          ...constraints,
        );
        const fallbackSnapshot = await getDocs(fallbackQuery);
        const sessions = mapSnapshotToSessions(fallbackSnapshot);
        sessions.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        return sessions;
      } catch (fallbackError) {
        console.error('Error loading practice sessions (fallback):', fallbackError);
        return [];
      }
    }
    console.error('Error loading practice sessions:', error);
    return [];
  }
}


