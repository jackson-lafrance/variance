/**
 * Card counting utilities shared between web and mobile
 */

export const getHiLoValue = (rank: string): number => {
  if (['2', '3', '4', '5', '6'].includes(rank)) return 1;  // Low cards: +1
  if (['7', '8', '9'].includes(rank)) return 0;            // Neutral cards: 0
  return -1;  // High cards (10, J, Q, K, A): -1
};

export const calculateTrueCount = (
  runningCount: number,
  deckCount: number,
  cardsDealt: number
): number => {
  if (deckCount === 1) {
    return runningCount;
  }
  
  const totalCards = deckCount * 52;
  const cardsRemaining = totalCards - cardsDealt;
  const decksRemaining = Math.max(0.5, cardsRemaining / 52);
  return Math.round((runningCount / decksRemaining) * 10) / 10; // Round to 1 decimal
};

export const calculateDecksRemaining = (
  deckCount: number,
  cardsDealt: number
): number => {
  const totalCards = deckCount * 52;
  const cardsRemaining = totalCards - cardsDealt;
  return Math.max(0, cardsRemaining / 52);
};

