/**
 * Risk of Ruin Calculator
 * Calculates probability of losing entire bankroll
 */

export interface RiskOfRuinResult {
  riskOfRuin: number;
  riskOfRuinPercent: number;
  bankrollUnits: number;
  recommendedBankroll: number;
  hourlyWinRate: number;
  hourlySD: number;
  timeToRuin: number;
}

/**
 * Calculate Risk of Ruin using classic formula
 */
export function calculateRiskOfRuin(
  bankroll: number,
  hourlyWinRate: number,
  hourlySD: number,
  goalBankroll?: number
): RiskOfRuinResult {
  if (hourlySD <= 0 || hourlyWinRate <= 0) {
    return {
      riskOfRuin: 1,
      riskOfRuinPercent: 100,
      bankrollUnits: 0,
      recommendedBankroll: 0,
      hourlyWinRate,
      hourlySD,
      timeToRuin: 0,
    };
  }

  const bankrollUnits = bankroll / hourlySD;
  const exponent = (-2 * hourlyWinRate * bankroll) / (hourlySD * hourlySD);
  const riskOfRuin = Math.exp(exponent);
  const safeRiskOfRuin = Math.max(0, Math.min(1, riskOfRuin));
  
  const targetRisk = 0.05;
  const recommendedBankroll = (-Math.log(targetRisk) * hourlySD * hourlySD) / (2 * hourlyWinRate);
  
  const timeToRuin = hourlyWinRate > 0 
    ? bankroll / hourlyWinRate 
    : Infinity;

  return {
    riskOfRuin: safeRiskOfRuin,
    riskOfRuinPercent: safeRiskOfRuin * 100,
    bankrollUnits,
    recommendedBankroll,
    hourlyWinRate,
    hourlySD,
    timeToRuin: timeToRuin === Infinity ? 0 : timeToRuin,
  };
}

/**
 * Calculate risk of ruin based on true count and betting strategy
 */
export function calculateRiskFromTrueCount(
  bankroll: number,
  avgTrueCount: number,
  baseUnit: number,
  bettingSpread: number,
  handsPerHour: number = 100
): RiskOfRuinResult {
  const edge = avgTrueCount * 0.005;
  const avgBet = baseUnit * (1 + bettingSpread) / 2;
  const hourlyWinRate = edge * avgBet * handsPerHour;
  const hourlySD = 1.1 * avgBet * Math.sqrt(handsPerHour);
  
  return calculateRiskOfRuin(bankroll, hourlyWinRate, hourlySD);
}

/**
 * Calculate required bankroll for target risk level
 */
export function calculateRequiredBankroll(
  targetRiskPercent: number,
  hourlyWinRate: number,
  hourlySD: number
): number {
  const targetRisk = targetRiskPercent / 100;
  
  if (hourlySD <= 0 || hourlyWinRate <= 0 || targetRisk <= 0) {
    return 0;
  }
  
  const requiredBankroll = (-Math.log(targetRisk) * hourlySD * hourlySD) / (2 * hourlyWinRate);
  return Math.max(0, requiredBankroll);
}


