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
 * @param bankroll - Current bankroll in dollars
 * @param hourlyWinRate - Expected hourly win rate in dollars
 * @param hourlySD - Hourly standard deviation in dollars
 * @param goalBankroll - Target bankroll (optional, for goal probability)
 * @returns RiskOfRuinResult
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

  // Calculate bankroll in units (hourly SD units)
  const bankrollUnits = bankroll / hourlySD;
  
  // Risk of Ruin formula: ROR = e^(-2 * WR * BR / SD^2)
  // where WR = win rate, BR = bankroll, SD = standard deviation
  const exponent = (-2 * hourlyWinRate * bankroll) / (hourlySD * hourlySD);
  const riskOfRuin = Math.exp(exponent);
  
  // Clamp between 0 and 1
  const safeRiskOfRuin = Math.max(0, Math.min(1, riskOfRuin));
  
  // Calculate recommended bankroll for 5% risk of ruin
  const targetRisk = 0.05;
  const recommendedBankroll = (-Math.log(targetRisk) * hourlySD * hourlySD) / (2 * hourlyWinRate);
  
  // Estimate time to ruin (hours) - simplified calculation
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
 * @param bankroll - Current bankroll
 * @param avgTrueCount - Average true count
 * @param baseUnit - Base betting unit
 * @param bettingSpread - Betting spread ratio (e.g., 1-12 means min bet to 12x min bet)
 * @param handsPerHour - Average hands per hour
 * @returns RiskOfRuinResult
 */
export function calculateRiskFromTrueCount(
  bankroll: number,
  avgTrueCount: number,
  baseUnit: number,
  bettingSpread: number,
  handsPerHour: number = 100
): RiskOfRuinResult {
  // Estimate win rate based on true count
  // Each true count point ≈ 0.5% edge
  const edge = avgTrueCount * 0.005;
  
  // Average bet size (simplified - midpoint of spread)
  const avgBet = baseUnit * (1 + bettingSpread) / 2;
  
  // Hourly win rate = edge * avg bet * hands per hour
  const hourlyWinRate = edge * avgBet * handsPerHour;
  
  // Hourly SD approximation (simplified)
  // Standard deviation ≈ 1.1 * avg bet * sqrt(hands per hour)
  const hourlySD = 1.1 * avgBet * Math.sqrt(handsPerHour);
  
  return calculateRiskOfRuin(bankroll, hourlyWinRate, hourlySD);
}

/**
 * Calculate required bankroll for target risk level
 * @param targetRiskPercent - Desired risk of ruin percentage (e.g., 5 for 5%)
 * @param hourlyWinRate - Expected hourly win rate
 * @param hourlySD - Hourly standard deviation
 * @returns Required bankroll
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
  
  // Solve for bankroll: ROR = e^(-2 * WR * BR / SD^2)
  // BR = -ln(ROR) * SD^2 / (2 * WR)
  const requiredBankroll = (-Math.log(targetRisk) * hourlySD * hourlySD) / (2 * hourlyWinRate);
  
  return Math.max(0, requiredBankroll);
}

/**
 * Calculate Kelly Criterion risk percentage
 * @param bankroll - Current bankroll
 * @param edge - Player edge (decimal, e.g., 0.01 for 1%)
 * @param kellyFraction - Kelly fraction to use
 * @returns Risk percentage of bankroll
 */
export function calculateKellyRisk(
  bankroll: number,
  edge: number,
  kellyFraction: number = 0.5
): number {
  // Kelly percentage
  const kellyPercent = Math.max(0, Math.min(1, edge));
  
  // Risk as percentage of bankroll
  return kellyPercent * kellyFraction * 100;
}


