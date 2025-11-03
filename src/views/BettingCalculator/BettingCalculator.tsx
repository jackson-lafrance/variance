import React, { useState } from 'react';
import Header from '../../components/Header';
import { calculateKellyCriterion, BettingResult } from '../../utils/bettingCalculator';
import './BettingCalculator.css';

export default function BettingCalculator() {
  const [bankroll, setBankroll] = useState('10000');
  const [edge, setEdge] = useState('1');
  const [winProb, setWinProb] = useState('50');
  const [kellyFraction, setKellyFraction] = useState(0.5);
  const [trueCount, setTrueCount] = useState('0');
  const [baseUnit, setBaseUnit] = useState('10');
  const [maxBet, setMaxBet] = useState('1000');
  const [mode, setMode] = useState<'kelly' | 'truecount'>('kelly');

  const handleCalculate = () => {
    // Validation happens in the result calculation
  };

  const kellyResult: BettingResult | null = (() => {
    try {
      const bankrollVal = parseFloat(bankroll);
      const edgeVal = parseFloat(edge) / 100; // Convert percentage to decimal
      const winProbVal = parseFloat(winProb) / 100;
      
      if (bankrollVal <= 0 || edgeVal < 0 || winProbVal < 0 || winProbVal > 1) {
        return null;
      }
      
      return calculateKellyCriterion(bankrollVal, edgeVal, winProbVal, kellyFraction);
    } catch {
      return null;
    }
  })();

  const trueCountResult: number | null = (() => {
    try {
      const bankrollVal = parseFloat(bankroll);
      const trueCountVal = parseFloat(trueCount);
      const baseUnitVal = parseFloat(baseUnit);
      const maxBetVal = parseFloat(maxBet);
      
      if (bankrollVal <= 0 || baseUnitVal <= 0 || maxBetVal <= 0) {
        return null;
      }
      
      const { calculateBetFromTrueCount } = require('../../utils/bettingCalculator');
      return calculateBetFromTrueCount(bankrollVal, trueCountVal, baseUnitVal, maxBetVal, kellyFraction);
    } catch {
      return null;
    }
  })();

  return (
    <div className="betting-calculator-page">
      <Header />
      
      <div className="betting-calculator-content">
        <div className="betting-header">
          <h1 className="betting-title">Betting Strategy Calculator</h1>
          <p className="betting-subtitle">Calculate optimal bet sizing using Kelly Criterion</p>
        </div>

        <div className="betting-mode-selector">
          <button
            className={`betting-mode-button ${mode === 'kelly' ? 'active' : ''}`}
            onClick={() => setMode('kelly')}
          >
            Kelly Criterion
          </button>
          <button
            className={`betting-mode-button ${mode === 'truecount' ? 'active' : ''}`}
            onClick={() => setMode('truecount')}
          >
            True Count Based
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

          {mode === 'kelly' && (
            <>
              <div className="betting-input-group">
                <label htmlFor="edge">Player Edge (%)</label>
                <input
                  id="edge"
                  type="number"
                  value={edge}
                  onChange={(e) => setEdge(e.target.value)}
                  min="0"
                  max="100"
                  step="0.1"
                />
                <small>Your advantage over the house</small>
              </div>

              <div className="betting-input-group">
                <label htmlFor="winProb">Win Probability (%)</label>
                <input
                  id="winProb"
                  type="number"
                  value={winProb}
                  onChange={(e) => setWinProb(e.target.value)}
                  min="0"
                  max="100"
                  step="1"
                />
                <small>Probability of winning this bet</small>
              </div>
            </>
          )}

          {mode === 'truecount' && (
            <>
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
            </>
          )}

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

        {mode === 'kelly' && kellyResult && (
          <div className="betting-results">
            <h2 className="betting-results-title">Recommended Bet Sizes</h2>
            <div className="betting-results-grid">
              <div className="betting-result-card">
                <div className="betting-result-label">Kelly Percentage</div>
                <div className="betting-result-value">{kellyResult.kellyPercent.toFixed(2)}%</div>
              </div>
              <div className="betting-result-card">
                <div className="betting-result-label">Full Kelly Bet</div>
                <div className="betting-result-value">${kellyResult.fullKellyBet.toFixed(2)}</div>
              </div>
              <div className="betting-result-card">
                <div className="betting-result-label">Half Kelly Bet</div>
                <div className="betting-result-value">${kellyResult.halfKellyBet.toFixed(2)}</div>
              </div>
              <div className="betting-result-card">
                <div className="betting-result-label">Quarter Kelly Bet</div>
                <div className="betting-result-value">${kellyResult.quarterKellyBet.toFixed(2)}</div>
              </div>
              <div className="betting-result-card recommended">
                <div className="betting-result-label">Recommended Bet</div>
                <div className="betting-result-value">${kellyResult.recommendedBet.toFixed(2)}</div>
                <div className="betting-result-subtext">
                  ({kellyResult.bankrollPercent.toFixed(2)}% of bankroll)
                </div>
              </div>
              <div className="betting-result-card">
                <div className="betting-result-label">Bankroll After Bet</div>
                <div className="betting-result-value">${kellyResult.bankrollAfterBet.toFixed(2)}</div>
              </div>
            </div>
          </div>
        )}

        {mode === 'truecount' && trueCountResult !== null && (
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
                  {(trueCountResult / parseFloat(baseUnit)).toFixed(1)} units
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

        <div className="betting-info">
          <h3>About Kelly Criterion</h3>
          <p>
            The Kelly Criterion is a mathematical formula used to determine the optimal bet size
            that maximizes long-term growth while minimizing risk of ruin. It considers your
            bankroll, edge (advantage), and win probability.
          </p>
          <p>
            <strong>Quarter Kelly (0.25):</strong> Very conservative, reduces risk significantly
          </p>
          <p>
            <strong>Half Kelly (0.5):</strong> Recommended for most players, balances growth and safety
          </p>
          <p>
            <strong>Full Kelly (1.0):</strong> Maximum growth but higher volatility and risk
          </p>
          <p>
            <strong>Note:</strong> Always bet within your means and adjust based on your risk tolerance.
          </p>
        </div>
      </div>
    </div>
  );
}


