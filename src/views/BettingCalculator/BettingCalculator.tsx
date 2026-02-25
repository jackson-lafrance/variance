import React, { useState, useMemo } from 'react';
import Header from '../../components/Header';
import { calculateBetFromTrueCount } from '../../utils/bettingCalculator';
import './BettingCalculator.css';

export default function BettingCalculator() {
  const [bankroll, setBankroll] = useState('10000');
  const [kellyFraction, setKellyFraction] = useState(0.5);
  const [trueCount, setTrueCount] = useState('0');
  const [baseUnit, setBaseUnit] = useState('10');
  const [maxBet, setMaxBet] = useState('1000');
  const [mode, setMode] = useState<'single' | 'spread'>('single');

  const trueCountResult: number | null = useMemo(() => {
    try {
      const bankrollVal = parseFloat(bankroll);
      const trueCountVal = parseFloat(trueCount);
      const baseUnitVal = parseFloat(baseUnit);
      const maxBetVal = parseFloat(maxBet);

      if (bankrollVal <= 0 || baseUnitVal <= 0 || maxBetVal <= 0) {
        return null;
      }

      return calculateBetFromTrueCount(bankrollVal, trueCountVal, baseUnitVal, maxBetVal, kellyFraction);
    } catch {
      return null;
    }
  }, [bankroll, trueCount, baseUnit, maxBet, kellyFraction]);

  const spreadResults = useMemo(() => {
    try {
      const bankrollVal = parseFloat(bankroll);
      const baseUnitVal = parseFloat(baseUnit);
      const maxBetVal = parseFloat(maxBet);

      if (bankrollVal <= 0 || baseUnitVal <= 0 || maxBetVal <= 0) {
        return null;
      }

      const counts = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      return counts.map((tc) => ({
        trueCount: tc,
        bet: calculateBetFromTrueCount(bankrollVal, tc, baseUnitVal, maxBetVal, kellyFraction),
        units: calculateBetFromTrueCount(bankrollVal, tc, baseUnitVal, maxBetVal, kellyFraction) / baseUnitVal,
      }));
    } catch {
      return null;
    }
  }, [bankroll, baseUnit, maxBet, kellyFraction]);

  const riskOfRuin = useMemo(() => {
    if (!spreadResults) return null;

    const bankrollVal = parseFloat(bankroll);
    const baseUnitVal = parseFloat(baseUnit);
    if (bankrollVal <= 0 || baseUnitVal <= 0) return null;

    // Approximate TC frequency distribution for a 6-deck shoe
    const tcFrequencies: Record<number, number> = {
      [-1]: 0.240,
      [0]: 0.240,
      [1]: 0.180,
      [2]: 0.130,
      [3]: 0.080,
      [4]: 0.050,
      [5]: 0.030,
      [6]: 0.020,
      [7]: 0.010,
      [8]: 0.008,
      [9]: 0.005,
      [10]: 0.007,
    };

    const HOUSE_EDGE = 0.005;
    const EDGE_PER_TC = 0.005;
    const BJ_VARIANCE = 1.32; // ≈ 1.15²

    let avgEV = 0;
    let avgVar = 0;

    for (const row of spreadResults) {
      const freq = tcFrequencies[row.trueCount] ?? 0;
      const bet = Math.max(baseUnitVal, row.bet);
      const edge = row.trueCount * EDGE_PER_TC - HOUSE_EDGE;

      avgEV += freq * bet * edge;
      avgVar += freq * bet * bet * BJ_VARIANCE;
    }

    if (avgEV <= 0 || avgVar === 0) return 100;

    const ror = Math.exp((-2 * avgEV * bankrollVal) / avgVar) * 100;
    return Math.min(ror, 100);
  }, [spreadResults, bankroll, baseUnit]);

  return (
    <div className="betting-calculator-page">
      <Header />

      <div className="betting-calculator-content">
        <div className="betting-header">
          <h1 className="betting-title">Betting Strategy Calculator</h1>
          <p className="betting-subtitle">Calculate optimal bet sizing based on the true count</p>
        </div>

        <div className="betting-mode-selector">
          <button
            className={`betting-mode-button ${mode === 'single' ? 'active' : ''}`}
            onClick={() => setMode('single')}
          >
            Calculate One Bet
          </button>
          <button
            className={`betting-mode-button ${mode === 'spread' ? 'active' : ''}`}
            onClick={() => setMode('spread')}
          >
            Generate Bet Spread
          </button>
        </div>

        <div className="betting-inputs">
          <div className="betting-input-group">
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

          {mode === 'single' && (
            <div className="betting-input-group">
              <label htmlFor="trueCount">True Count</label>
              <input
                id="trueCount"
                type="number"
                value={trueCount}
                onChange={(e) => setTrueCount(e.target.value)}
                step="0.5"
              />
              <small>Current true count</small>
            </div>
          )}

          <div className="betting-input-group">
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

          <div className="betting-input-group">
            <label htmlFor="maxBet">Maximum Bet ($)</label>
            <input
              id="maxBet"
              type="number"
              value={maxBet}
              onChange={(e) => setMaxBet(e.target.value)}
              min="0"
              step="100"
            />
            <small>Maximum bet allowed</small>
          </div>

          <div className="betting-input-group">
            <label htmlFor="kellyFraction">Kelly Fraction</label>
            <select
              id="kellyFraction"
              value={kellyFraction}
              onChange={(e) => setKellyFraction(parseFloat(e.target.value))}
            >
              <option value={0.25}>Quarter Kelly (0.25)</option>
              <option value={0.5}>Half Kelly (0.5) - Recommended</option>
              <option value={0.75}>Three-Quarter Kelly (0.75)</option>
              <option value={1.0}>Full Kelly (1.0) - Aggressive</option>
            </select>
            <small>Fraction of Kelly Criterion to use (lower = safer)</small>
          </div>
        </div>

        {mode === 'single' && trueCountResult !== null && (
          <div className="betting-results">
            <h2 className="betting-results-title">Recommended Bet Size</h2>
            <div className="betting-results-grid">
              <div className="betting-result-card recommended">
                <div className="betting-result-label">Recommended Bet</div>
                <div className="betting-result-value">${trueCountResult.toFixed(2)}</div>
                <div className="betting-result-subtext">
                  Based on True Count: {trueCount}
                </div>
              </div>
              <div className="betting-result-card">
                <div className="betting-result-label">Bet in Units</div>
                <div className="betting-result-value">
                  {Math.round(trueCountResult / parseFloat(baseUnit))} units
                </div>
              </div>
              <div className="betting-result-card">
                <div className="betting-result-label">Bankroll After Bet</div>
                <div className="betting-result-value">
                  ${(parseFloat(bankroll) - trueCountResult).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        )}

        {mode === 'spread' && spreadResults && (
          <div className="betting-results">
            <h2 className="betting-results-title">Bet Spread</h2>
            <div className="betting-spread-table-wrapper">
              <table className="betting-spread-table">
                <thead>
                  <tr>
                    <th>True Count</th>
                    <th>Bet Size</th>
                    <th>Units</th>
                  </tr>
                </thead>
                <tbody>
                  {spreadResults.map((row) => (
                    <tr key={row.trueCount} className={row.trueCount >= 2 ? 'positive-count' : ''}>
                      <td>{row.trueCount >= 0 ? `+${row.trueCount}` : row.trueCount}</td>
                      <td>${row.bet.toFixed(2)}</td>
                      <td>{Math.round(row.units)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {riskOfRuin !== null && (
              <div className="betting-ror-summary">
                <div className="betting-ror-card">
                  <div className="betting-ror-label">Risk of Ruin</div>
                  <div className={`betting-ror-value ${riskOfRuin < 1 ? 'low' : riskOfRuin < 5 ? 'moderate' : 'high'}`}>
                    {riskOfRuin < 0.01 ? '<0.01' : riskOfRuin.toFixed(2)}%
                  </div>
                  <div className="betting-ror-rating">
                    {riskOfRuin < 1 && 'Excellent — very low risk of going broke.'}
                    {riskOfRuin >= 1 && riskOfRuin < 5 && 'Acceptable for most players.'}
                    {riskOfRuin >= 5 && riskOfRuin < 13 && 'Moderate risk — consider a larger bankroll or smaller bets.'}
                    {riskOfRuin >= 13 && riskOfRuin < 100 && 'High risk — increase your bankroll or reduce your spread.'}
                    {riskOfRuin >= 100 && 'No positive edge with this spread — you will lose long term.'}
                  </div>
                </div>
                <div className="betting-ror-note">
                  Assumes a 6-deck shoe with 0.5% house edge and ~0.5% edge shift per true count point.
                </div>
              </div>
            )}
          </div>
        )}

        <div className="betting-info">
          <h3>About True Count Betting</h3>
          <p>
            True count based betting adjusts your wager according to the count advantage.
            Each point of true count represents roughly a 0.5% shift in player edge. The
            calculator uses the Kelly Criterion internally to size bets optimally.
          </p>
          <p>
            <strong>Calculate One Bet:</strong> Enter a specific true count to get the recommended bet size.
          </p>
          <p>
            <strong>Generate Bet Spread:</strong> See a full table of recommended bets across a range of true counts.
          </p>
          <p>
            <strong>Kelly Fraction:</strong> Controls aggression. Half Kelly (0.5) is recommended
            for most players — it balances bankroll growth with safety.
          </p>
          <p>
            <strong>Note:</strong> Always bet within your means and adjust based on your risk tolerance.
          </p>
        </div>
      </div>
    </div>
  );
}
