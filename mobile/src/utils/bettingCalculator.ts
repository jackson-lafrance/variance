/**
 * Kelly Criterion Calculator
 * Calculates optimal bet sizing based on edge and bankroll
 */

export interface BettingResult {
  kellyPercent: number;
  fullKellyBet: number;
  halfKellyBet: number;
  quarterKellyBet: number;
  bankrollPercent: number;
  recommendedBet: number;
  bankrollAfterBet: number;
}

/**
 * Calculate Kelly Criterion bet sizing
 */
export function calculateKellyCriterion(
  bankroll: number,
  edge: number,
  winProb: number = 0.5,
  kellyFraction: number = 0.5
): BettingResult {
  const loseProb = 1 - winProb;
  const odds = 1;
  
  const kellyPercent = ((odds * winProb) - loseProb) / odds;
  const safeKellyPercent = Math.max(0, Math.min(1, kellyPercent));
  
  const fullKellyBet = bankroll * safeKellyPercent;
  const halfKellyBet = bankroll * safeKellyPercent * 0.5;
  const quarterKellyBet = bankroll * safeKellyPercent * 0.25;
  const recommendedBet = bankroll * safeKellyPercent * kellyFraction;
  
  return {
    kellyPercent: safeKellyPercent * 100,
    fullKellyBet,
    halfKellyBet,
    quarterKellyBet,
    bankrollPercent: (safeKellyPercent * kellyFraction) * 100,
    recommendedBet,
    bankrollAfterBet: bankroll - recommendedBet,
  };
}

/**
 * Calculate bet sizing based on true count
 */
export function calculateBetFromTrueCount(
  bankroll: number,
  trueCount: number,
  baseUnit: number = 10,
  maxBet: number = 1000,
  kellyFraction: number = 0.5
): number {
  const edge = Math.max(0, (trueCount * 0.005));
  const result = calculateKellyCriterion(bankroll, edge, 0.5 + edge, kellyFraction);
  const betInUnits = Math.round(result.recommendedBet / baseUnit);
  const bet = betInUnits * baseUnit;
  return Math.min(bet, maxBet);
}


