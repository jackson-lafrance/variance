import { db } from '../firebase/config';
import { collection, addDoc, query, where, orderBy, getDocs, limit } from 'firebase/firestore';
import type { QueryConstraint } from 'firebase/firestore';

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
    throw error;
  }
}

export async function getUserHighScores(
  userId: string,
  simulationType?: string
): Promise<HighScore[]> {
  const constraints: QueryConstraint[] = [where('userId', '==', userId)];
  if (simulationType) {
    constraints.push(where('simulationType', '==', simulationType));
  }

  const mapSnapshotToScores = (snapshot: any): HighScore[] => {
    const scores: HighScore[] = [];
    snapshot.forEach((doc: any) => {
      scores.push({ id: doc.id, ...doc.data() } as HighScore);
    });
    return scores;
  };

  try {
    const orderedQuery = query(
      collection(db, 'highScores'),
      ...constraints,
      orderBy('score', 'desc'),
      limit(10)
    );

    const snapshot = await getDocs(orderedQuery);
    return mapSnapshotToScores(snapshot);
  } catch (error: any) {
    if (error.code === 'failed-precondition') {
      // Fallback for missing composite index: query without orderBy/limit, then sort in memory.
      try {
        const fallbackQuery = query(
          collection(db, 'highScores'),
          ...constraints,
        );
        const fallbackSnapshot = await getDocs(fallbackQuery);
        const scores = mapSnapshotToScores(fallbackSnapshot);
        scores.sort((a, b) => (b.score || 0) - (a.score || 0));
        return scores.slice(0, 10);
      } catch (fallbackError) {
        console.error('Error loading high scores (fallback):', fallbackError);
        return [];
      }
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
      const fallbackScores = await getUserHighScores(userId, simulationType);
      return fallbackScores.length > 0 ? fallbackScores[0] : null;
    }
    console.error('Error loading best score:', error);
    return null;
  }
}


