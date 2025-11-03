import { db } from '../firebase/config';
import { collection, addDoc, query, where, orderBy, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';

export interface Goal {
  id?: string;
  userId: string;
  type: 'bankroll' | 'accuracy' | 'sessions' | 'hours';
  target: number;
  current: number;
  deadline?: number;
  createdAt: number;
  completed: boolean;
  completedAt?: number;
}

export async function createGoal(
  userId: string,
  type: Goal['type'],
  target: number,
  deadline?: number
): Promise<void> {
  try {
    await addDoc(collection(db, 'goals'), {
      userId,
      type,
      target,
      current: 0,
      deadline,
      createdAt: Date.now(),
      completed: false,
    });
  } catch (error) {
    console.error('Error creating goal:', error);
  }
}

export async function getUserGoals(userId: string): Promise<Goal[]> {
  try {
    const q = query(
      collection(db, 'goals'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    const goals: Goal[] = [];
    snapshot.forEach((doc) => {
      goals.push({ id: doc.id, ...doc.data() } as Goal);
    });
    return goals;
  } catch (error: any) {
    if (error.code === 'failed-precondition') {
      return [];
    }
    console.error('Error loading goals:', error);
    return [];
  }
}

export async function updateGoalProgress(
  goalId: string,
  current: number
): Promise<void> {
  try {
    const goalDoc = await getDoc(doc(db, 'goals', goalId));
    if (!goalDoc.exists()) return;
    
    const goal = goalDoc.data() as Goal;
    const completed = current >= goal.target;
    
    await setDoc(doc(db, 'goals', goalId), {
      ...goal,
      current,
      completed,
      completedAt: completed && !goal.completedAt ? Date.now() : goal.completedAt,
    });
  } catch (error) {
    console.error('Error updating goal:', error);
  }
}

export async function deleteGoal(goalId: string): Promise<void> {
  try {
    await setDoc(doc(db, 'goals', goalId), { deleted: true });
  } catch (error) {
    console.error('Error deleting goal:', error);
  }
}


