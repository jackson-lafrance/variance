import React, { useState } from 'react';
import Header from '../../components/Header';
import { calculateRiskOfRuin, calculateRiskFromTrueCount, calculateRequiredBankroll, RiskOfRuinResult } from '../../utils/riskCalculator';
import './RiskCalculator.css';

export default function RiskCalculator() {
  const [bankroll, setBankroll] = useState('10000');
  const [hourlyWinRate, setHourlyWinRate] = useState('25');
  const [hourlySD, setHourlySD] = useState('300');
  const [mode, setMode] = useState<'basic' | 'truecount'>('basic');
  
  // True count mode inputs
  const [trueCount, setTrueCount] = useState('1');
  const [baseUnit, setBaseUnit] = useState('10');
  const [bettingSpread, setBettingSpread] = useState('12');
  const [handsPerHour, setHandsPerHour] = useState('100');

  const basicResult: RiskOfRuinResult | null = (() => {
    try {
      const bankrollVal = parseFloat(bankroll);
      const winRateVal = parseFloat(hourlyWinRate);
      const sdVal = parseFloat(hourlySD);
      
      if (bankrollVal <= 0 || sdVal <= 0) {
        return null;
      }
      
      return calculateRiskOfRuin(bankrollVal, winRateVal, sdVal);
    } catch {
      return null;
    }
  })();

  const trueCountResult: RiskOfRuinResult | null = (() => {
    try {
      const bankrollVal = parseFloat(bankroll);
      const trueCountVal = parseFloat(trueCount);
      const baseUnitVal = parseFloat(baseUnit);
      const spreadVal = parseFloat(bettingSpread);
      const handsVal = parseFloat(handsPerHour);
      
      if (bankrollVal <= 0 || baseUnitVal <= 0 || spreadVal <= 0 || handsVal <= 0) {
        return null;
      }
      
      return calculateRiskFromTrueCount(bankrollVal, trueCountVal, baseUnitVal, spreadVal, handsVal);
    } catch {
      return null;
    }
  })();

  const result = mode === 'basic' ? basicResult : trueCountResult;

  const requiredBankroll5 = result 
    ? calculateRequiredBankroll(5, result.hourlyWinRate, result.hourlySD)
    : null;
  const requiredBankroll10 = result 
    ? calculateRequiredBankroll(10, result.hourlyWinRate, result.hourlySD)
    : null;

  const getRiskLevel = (riskPercent: number): string => {
    if (riskPercent < 1) return 'Very Low';
    if (riskPercent < 5) return 'Low';
    if (riskPercent < 10) return 'Moderate';
    if (riskPercent < 20) return 'High';
    return 'Very High';
  };

  const getRiskColor = (riskPercent: number): string => {
    if (riskPercent < 1) return '#4caf50';
    if (riskPercent < 5) return '#8bc34a';
    if (riskPercent < 10) return '#ffc107';
    if (riskPercent < 20) return '#ff9800';
    return '#f44336';
  };

  return (
    <div className="risk-calculator-page">
      <Header />
      
      <div className="risk-calculator-content">
        <div className="risk-header">
          <h1 className="risk-title">Risk of Ruin Calculator</h1>
          <p className="risk-subtitle">Calculate the probability of losing your entire bankroll</p>
        </div>

        <div className="risk-mode-selector">
          <button
            className={`risk-mode-button ${mode === 'basic' ? 'active' : ''}`}
            onClick={() => setMode('basic')}
          >
            Basic Calculation
          </button>
          <button
            className={`risk-mode-button ${mode === 'truecount' ? 'active' : ''}`}
            onClick={() => setMode('truecount')}
          >
            True Count Based
          </button>
        </div>

        <div className="risk-inputs">
          <div className="risk-input-group">
            <label htmlFor="bankroll">Bankroll ($)</label>
            <input
              id="bankroll"
              type="number"
              value={bankroll}
              onChange={(e) => setBankroll(e.target.value)}
              min="0"
              step="100"
            />
          </div>

          {mode === 'basic' && (
            <>
              <div className="risk-input-group">
                <label htmlFor="hourlyWinRate">Hourly Win Rate ($)</label>
                <input
                  id="hourlyWinRate"
                  type="number"
                  value={hourlyWinRate}
                  onChange={(e) => setHourlyWinRate(e.target.value)}
                  step="1"
                />
                <small>Expected hourly profit</small>
              </div>

              <div className="risk-input-group">
                <label htmlFor="hourlySD">Hourly Standard Deviation ($)</label>
                <input
                  id="hourlySD"
                  type="number"
                  value={hourlySD}
                  onChange={(e) => setHourlySD(e.target.value)}
                  min="0"
                  step="10"
                />
                <small>Volatility of your results</small>
              </div>
            </>
          )}

          {mode === 'truecount' && (
            <>
              <div className="risk-input-group">
                <label htmlFor="trueCount">Average True Count</label>
                <input
                  id="trueCount"
                  type="number"
                  value={trueCount}
                  onChange={(e) => setTrueCount(e.target.value)}
                  step="0.5"
                />
                <small>Average true count you play at</small>
              </div>

              <div className="risk-input-group">
                <label htmlFor="baseUnit">Base Unit ($)</label>
                <input
                  id="baseUnit"
                  type="number"
                  value={baseUnit}
                  onChange={(e) => setBaseUnit(e.target.value)}
                  min="1"
                  step="5"
                />
                <small>Minimum bet size</small>
              </div>

              <div className="risk-input-group">
                <label htmlFor="bettingSpread">Betting Spread</label>
                <input
                  id="bettingSpread"
                  type="number"
                  value={bettingSpread}
                  onChange={(e) => setBettingSpread(e.target.value)}
                  min="1"
                  step="1"
                />
                <small>Spread ratio (e.g., 12 = 1-12 spread)</small>
              </div>

              <div className="risk-input-group">
                <label htmlFor="handsPerHour">Hands Per Hour</label>
                <input
                  id="handsPerHour"
                  type="number"
                  value={handsPerHour}
                  onChange={(e) => setHandsPerHour(e.target.value)}
                  min="1"
                  step="10"
                />
                <small>Average hands played per hour</small>
              </div>
            </>
          )}
        </div>

        {result && (
          <div className="risk-results">
            <h2 className="risk-results-title">Risk Analysis</h2>
            <div className="risk-results-grid">
              <div 
                className="risk-result-card primary"
                style={{ borderColor: getRiskColor(result.riskOfRuinPercent) }}
              >
                <div className="risk-result-label">Risk of Ruin</div>
                <div 
                  className="risk-result-value"
                  style={{ color: getRiskColor(result.riskOfRuinPercent) }}
                >
                  {result.riskOfRuinPercent.toFixed(2)}%
                </div>
                <div className="risk-result-subtext">
                  {getRiskLevel(result.riskOfRuinPercent)} Risk
                </div>
              </div>

              <div className="risk-result-card">
                <div className="risk-result-label">Bankroll Units</div>
                <div className="risk-result-value">{result.bankrollUnits.toFixed(1)}</div>
                <div className="risk-result-subtext">Standard deviations</div>
              </div>

              <div className="risk-result-card">
                <div className="risk-result-label">Hourly Win Rate</div>
                <div className="risk-result-value">${result.hourlyWinRate.toFixed(2)}</div>
              </div>

              <div className="risk-result-card">
                <div className="risk-result-label">Hourly SD</div>
                <div className="risk-result-value">${result.hourlySD.toFixed(2)}</div>
              </div>

              {result.timeToRuin > 0 && (
                <div className="risk-result-card">
                  <div className="risk-result-label">Estimated Time to Ruin</div>
                  <div className="risk-result-value">
                    {result.timeToRuin > 8760 
                      ? `${(result.timeToRuin / 8760).toFixed(1)} years`
                      : `${result.timeToRuin.toFixed(0)} hours`}
                  </div>
                </div>
              )}

              {result.recommendedBankroll > 0 && (
                <div className="risk-result-card">
                  <div className="risk-result-label">Recommended Bankroll</div>
                  <div className="risk-result-value">
                    ${result.recommendedBankroll.toFixed(2)}
                  </div>
                  <div className="risk-result-subtext">For 5% risk of ruin</div>
                </div>
              )}
            </div>

            <div className="risk-bankroll-recommendations">
              <h3>Required Bankroll for Target Risk Levels</h3>
              <div className="risk-recommendations-grid">
                {requiredBankroll5 && (
                  <div className="risk-recommendation-card">
                    <div className="risk-recommendation-label">5% Risk</div>
                    <div className="risk-recommendation-value">
                      ${requiredBankroll5.toFixed(2)}
                    </div>
                  </div>
                )}
                {requiredBankroll10 && (
                  <div className="risk-recommendation-card">
                    <div className="risk-recommendation-label">10% Risk</div>
                    <div className="risk-recommendation-value">
                      ${requiredBankroll10.toFixed(2)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="risk-info">
          <h3>About Risk of Ruin</h3>
          <p>
            Risk of Ruin (ROR) is the probability of losing your entire bankroll before
            reaching your target or stopping play. It's calculated based on your win rate,
            volatility (standard deviation), and bankroll size.
          </p>
          <ul>
            <li><strong>&lt; 1%:</strong> Very Low Risk - Very safe</li>
            <li><strong>1-5%:</strong> Low Risk - Generally acceptable</li>
            <li><strong>5-10%:</strong> Moderate Risk - Consider reducing bet sizes</li>
            <li><strong>10-20%:</strong> High Risk - Not recommended</li>
            <li><strong>&gt; 20%:</strong> Very High Risk - Dangerously risky</li>
          </ul>
          <p>
            <strong>Recommendation:</strong> Aim for a risk of ruin below 5% for long-term
            success. If your ROR is too high, consider reducing bet sizes or increasing your bankroll.
          </p>
        </div>
      </div>
    </div>
  );
}


