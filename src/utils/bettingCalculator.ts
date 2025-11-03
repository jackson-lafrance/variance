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
 * @param bankroll - Current bankroll amount
 * @param edge - Player advantage as decimal (e.g., 0.01 for 1%)
 * @param winProb - Probability of winning (0-1)
 * @param kellyFraction - Fraction of Kelly to use (0.25 = quarter Kelly, 0.5 = half Kelly, 1.0 = full Kelly)
 * @returns BettingResult with optimal bet sizes
 */
export function calculateKellyCriterion(
  bankroll: number,
  edge: number,
  winProb: number = 0.5,
  kellyFraction: number = 0.5
): BettingResult {
  // Kelly Formula: f = (bp - q) / b
  // where f = fraction of bankroll to bet
  // b = odds received on wager (decimal odds - 1)
  // p = probability of winning
  // q = probability of losing (1 - p)
  
  // For blackjack, we use edge directly
  // Edge = (winProb * payout) - (loseProb * 1)
  // Assuming even money bets (1:1 payout)
  const loseProb = 1 - winProb;
  const odds = 1; // Even money (1:1)
  
  // Kelly percentage
  const kellyPercent = ((odds * winProb) - loseProb) / odds;
  
  // Clamp to reasonable values (between 0 and 1)
  const safeKellyPercent = Math.max(0, Math.min(1, kellyPercent));
  
  // Bet sizes
  const fullKellyBet = bankroll * safeKellyPercent;
  const halfKellyBet = bankroll * safeKellyPercent * 0.5;
  const quarterKellyBet = bankroll * safeKellyPercent * 0.25;
  
  // Recommended bet (using kellyFraction)
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
 * @param bankroll - Current bankroll amount
 * @param trueCount - Current true count
 * @param baseUnit - Base betting unit (e.g., $10)
 * @param maxBet - Maximum bet allowed
 * @param kellyFraction - Kelly fraction to use (default 0.5 for half Kelly)
 * @returns Recommended bet size
 */
export function calculateBetFromTrueCount(
  bankroll: number,
  trueCount: number,
  baseUnit: number = 10,
  maxBet: number = 1000,
  kellyFraction: number = 0.5
): number {
  // Simplified edge calculation based on true count
  // Rough approximation: each true count point ≈ 0.5% edge
  const edge = Math.max(0, (trueCount * 0.005));
  
  // Use Kelly Criterion to calculate bet
  const result = calculateKellyCriterion(bankroll, edge, 0.5 + edge, kellyFraction);
  
  // Round to nearest base unit
  const betInUnits = Math.round(result.recommendedBet / baseUnit);
  const bet = betInUnits * baseUnit;
  
  // Clamp to max bet
  return Math.min(bet, maxBet);
}

/**
 * Calculate optimal betting spread
 * @param bankroll - Current bankroll amount
 * @param minBet - Minimum bet size
 * @param maxBet - Maximum bet size
 * @param trueCount - Current true count
 * @returns Bet size within spread
 */
export function calculateBettingSpread(
  bankroll: number,
  minBet: number,
  maxBet: number,
  trueCount: number
): number {
  // Calculate bet based on true count
  const bet = calculateBetFromTrueCount(bankroll, trueCount, minBet, maxBet);
  
  // Ensure bet is within spread limits
  return Math.max(minBet, Math.min(bet, maxBet));
}


