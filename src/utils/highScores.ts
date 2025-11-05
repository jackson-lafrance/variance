import { db } from '../firebase/config';
import { collection, addDoc, query, where, orderBy, getDocs, limit, setDoc, doc } from 'firebase/firestore';

export interface HighScore {
  id?: string;
  userId: string;
  simulationType: string;
  score: number;
  accuracy: number;
  handsPlayed?: number;
  correctCount: number;
  incorrectCount: number;
  timestamp: number;
  date: string;
}

export const SimulationTypes = {
  BASIC_STRATEGY: 'basic-strategy',
  DEVIATIONS: 'deviations',
  COUNTING: 'counting',
  UNIFIED: 'unified',
  CARD_SPEED: 'card-speed',
} as const;

export async function saveHighScore(
  userId: string,
  simulationType: string,
  score: number,
  accuracy: number,
  correctCount: number,
  incorrectCount: number,
  handsPlayed?: number
): Promise<void> {
  try {
    await addDoc(collection(db, 'highScores'), {
      userId,
      simulationType,
      score,
      accuracy,
      correctCount,
      incorrectCount,
      handsPlayed,
      timestamp: Date.now(),
      date: new Date().toISOString().split('T')[0],
    });
  } catch (error) {
    console.error('Error saving high score:', error);
  }
}

export async function getUserHighScores(
  userId: string,
  simulationType?: string
): Promise<HighScore[]> {
  try {
    let q = query(
      collection(db, 'highScores'),
      where('userId', '==', userId),
      orderBy('score', 'desc'),
      limit(10)
    );

    if (simulationType) {
      q = query(
        collection(db, 'highScores'),
        where('userId', '==', userId),
        where('simulationType', '==', simulationType),
        orderBy('score', 'desc'),
        limit(10)
      );
    }

    const snapshot = await getDocs(q);
    const scores: HighScore[] = [];
    snapshot.forEach((doc) => {
      scores.push({ id: doc.id, ...doc.data() } as HighScore);
    });
    return scores;
  } catch (error: any) {
    if (error.code === 'failed-precondition') {
      // Firestore index needed for high scores query
      return [];
    }
    console.error('Error loading high scores:', error);
    return [];
  }
}

export async function getUserBestScore(
  userId: string,
  simulationType: string
): Promise<HighScore | null> {
  try {
    const q = query(
      collection(db, 'highScores'),
      where('userId', '==', userId),
      where('simulationType', '==', simulationType),
      orderBy('score', 'desc'),
      limit(1)
    );

    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() } as HighScore;
    }
    return null;
  } catch (error: any) {
    if (error.code === 'failed-precondition') {
      return null;
    }
    console.error('Error loading best score:', error);
    return null;
  }
}


