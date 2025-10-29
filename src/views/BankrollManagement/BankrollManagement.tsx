import React, { useState } from 'react';
import Header from '../../components/Header';
import CollapsibleSection from '../../components/CollapsibleSection';
import './BankrollManagement.css';

export default function BankrollManagement() {
  const [bankroll, setBankroll] = useState(10000);
  const [maxBet, setMaxBet] = useState(100);
  const [advantage, setAdvantage] = useState(1);
  const [hourlyHands, setHourlyHands] = useState(80);
  const [hoursPlayed, setHoursPlayed] = useState(100);
  const [stdDev, setStdDev] = useState(1.15);
  
  const [kellyBankroll, setKellyBankroll] = useState(10000);
  const [kellyAdvantage, setKellyAdvantage] = useState(1.5);
  
  const [rorBankroll, setRorBankroll] = useState(10000);
  const [rorMaxBet, setRorMaxBet] = useState(100);
  const [rorAdvantage, setRorAdvantage] = useState(1);
  const [rorStdDev, setRorStdDev] = useState(1.15);

  const calculateEV = () => {
    const handsPlayed = hourlyHands * hoursPlayed;
    const ev = (advantage / 100) * maxBet * handsPlayed;
    return ev;
  };

  const calculateStdDeviation = () => {
    const handsPlayed = hourlyHands * hoursPlayed;
    const variance = Math.pow(stdDev * maxBet, 2) * handsPlayed;
    return Math.sqrt(variance);
  };

  const calculate95PercentRange = () => {
    const ev = calculateEV();
    const sd = calculateStdDeviation();
    return {
      lower: ev - (1.96 * sd),
      upper: ev + (1.96 * sd)
    };
  };

  const calculateKellyBet = () => {
    const edge = kellyAdvantage / 100;
    const kellyFraction = edge;
    const optimalBet = kellyBankroll * kellyFraction;
    const halfKellyBet = optimalBet * 0.5;
    const quarterKellyBet = optimalBet * 0.25;
    
    return {
      full: optimalBet,
      half: halfKellyBet,
      quarter: quarterKellyBet
    };
  };

  const calculateRiskOfRuin = () => {
    const edge = rorAdvantage / 100;
    const unitsInBankroll = rorBankroll / rorMaxBet;
    
    if (edge <= 0) return 100;
    
    const ror = Math.exp(-2 * edge * unitsInBankroll / Math.pow(rorStdDev, 2)) * 100;
    return Math.min(ror, 100);
  };

  const ev = calculateEV();
  const sd = calculateStdDeviation();
  const range = calculate95PercentRange();
  const kelly = calculateKellyBet();
  const ror = calculateRiskOfRuin();

  return (
    <div className="bankroll-management-page">
      <div className="bankroll-management-header">
        <Header />
        <p className="bankroll-management-subtitle">
          Master the financial side of card counting. Calculate optimal bet sizes, understand variance,
          and manage your bankroll to minimize risk and maximize profits.
        </p>
      </div>

      <div className="bankroll-management-content">
        <CollapsibleSection title="Expected Value & Variance Calculator">
          <p>
            Calculate your expected winnings and understand the variance you'll experience over a given playing period.
            This helps you set realistic expectations and prepare for the inevitable swings.
          </p>

          <div className="calculator">
            <div className="calculator-inputs">
              <div className="input-group">
                <label>Bankroll ($)</label>
                <input 
                  type="number" 
                  value={bankroll}
                  onChange={(e) => setBankroll(Number(e.target.value))}
                  className="calculator-input"
                />
              </div>
              
              <div className="input-group">
                <label>Maximum Bet ($)</label>
                <input 
                  type="number" 
                  value={maxBet}
                  onChange={(e) => setMaxBet(Number(e.target.value))}
                  className="calculator-input"
                />
              </div>
              
              <div className="input-group">
                <label>Average Advantage (%)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={advantage}
                  onChange={(e) => setAdvantage(Number(e.target.value))}
                  className="calculator-input"
                />
              </div>
              
              <div className="input-group">
                <label>Hands per Hour</label>
                <input 
                  type="number" 
                  value={hourlyHands}
                  onChange={(e) => setHourlyHands(Number(e.target.value))}
                  className="calculator-input"
                />
              </div>
              
              <div className="input-group">
                <label>Hours Played</label>
                <input 
                  type="number" 
                  value={hoursPlayed}
                  onChange={(e) => setHoursPlayed(Number(e.target.value))}
                  className="calculator-input"
                />
              </div>
              
              <div className="input-group">
                <label>Std Deviation (units)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={stdDev}
                  onChange={(e) => setStdDev(Number(e.target.value))}
                  className="calculator-input"
                />
              </div>
            </div>

            <div className="calculator-results">
              <h3>Results</h3>
              <div className="result-item">
                <span className="result-label">Total Hands:</span>
                <span className="result-value">{(hourlyHands * hoursPlayed).toLocaleString()}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Expected Value:</span>
                <span className="result-value positive">${ev.toFixed(2)}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Standard Deviation:</span>
                <span className="result-value">${sd.toFixed(2)}</span>
              </div>
              <div className="result-item">
                <span className="result-label">95% Confidence Range:</span>
                <span className="result-value">
                  ${range.lower.toFixed(2)} to ${range.upper.toFixed(2)}
                </span>
              </div>
              <div className="result-note">
                This means you have a 95% chance of ending up within this range after {hoursPlayed} hours of play.
                Variance can be brutal in the short term, even with a positive edge!
              </div>
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Kelly Criterion Calculator">
          <p>
            The Kelly Criterion is a formula that tells you the optimal bet size to maximize long-term growth while
            minimizing risk of ruin. Most professional players use a fraction of Kelly (half or quarter) for safety.
          </p>

          <div className="calculator">
            <div className="calculator-inputs">
              <div className="input-group">
                <label>Bankroll ($)</label>
                <input 
                  type="number" 
                  value={kellyBankroll}
                  onChange={(e) => setKellyBankroll(Number(e.target.value))}
                  className="calculator-input"
                />
              </div>
              
              <div className="input-group">
                <label>Your Advantage (%)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={kellyAdvantage}
                  onChange={(e) => setKellyAdvantage(Number(e.target.value))}
                  className="calculator-input"
                />
              </div>
            </div>

            <div className="calculator-results">
              <h3>Optimal Bet Sizes</h3>
              <div className="result-item">
                <span className="result-label">Full Kelly:</span>
                <span className="result-value aggressive">${kelly.full.toFixed(2)}</span>
              </div>
              <div className="result-note">
                Most aggressive. High variance, faster growth.
              </div>
              
              <div className="result-item">
                <span className="result-label">Half Kelly (Recommended):</span>
                <span className="result-value positive">${kelly.half.toFixed(2)}</span>
              </div>
              <div className="result-note">
                Reduces variance by 75% while still capturing 75% of growth. Most professionals use this.
              </div>
              
              <div className="result-item">
                <span className="result-label">Quarter Kelly (Conservative):</span>
                <span className="result-value">${kelly.quarter.toFixed(2)}</span>
              </div>
              <div className="result-note">
                Very safe, smooth bankroll growth. Good for beginners or smaller bankrolls.
              </div>
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Risk of Ruin Calculator">
          <p>
            Risk of Ruin (ROR) is the probability that you'll lose your entire bankroll. Even with a positive edge,
            there's always some risk. Proper bankroll sizing keeps this risk acceptably low.
          </p>

          <div className="calculator">
            <div className="calculator-inputs">
              <div className="input-group">
                <label>Bankroll ($)</label>
                <input 
                  type="number" 
                  value={rorBankroll}
                  onChange={(e) => setRorBankroll(Number(e.target.value))}
                  className="calculator-input"
                />
              </div>
              
              <div className="input-group">
                <label>Maximum Bet ($)</label>
                <input 
                  type="number" 
                  value={rorMaxBet}
                  onChange={(e) => setRorMaxBet(Number(e.target.value))}
                  className="calculator-input"
                />
              </div>
              
              <div className="input-group">
                <label>Average Advantage (%)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={rorAdvantage}
                  onChange={(e) => setRorAdvantage(Number(e.target.value))}
                  className="calculator-input"
                />
              </div>
              
              <div className="input-group">
                <label>Std Deviation (units)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={rorStdDev}
                  onChange={(e) => setRorStdDev(Number(e.target.value))}
                  className="calculator-input"
                />
              </div>
            </div>

            <div className="calculator-results">
              <h3>Risk Assessment</h3>
              <div className="result-item">
                <span className="result-label">Units in Bankroll:</span>
                <span className="result-value">{(rorBankroll / rorMaxBet).toFixed(1)}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Risk of Ruin:</span>
                <span className={`result-value ${ror < 1 ? 'positive' : ror < 5 ? 'warning' : 'negative'}`}>
                  {ror.toFixed(2)}%
                </span>
              </div>
              <div className="result-note">
                {ror < 1 && 'Excellent! Your risk is very low.'}
                {ror >= 1 && ror < 5 && 'Acceptable risk for most players.'}
                {ror >= 5 && ror < 13 && 'Moderate risk. Consider a larger bankroll or smaller bets.'}
                {ror >= 13 && 'High risk! You need a much larger bankroll or smaller maximum bet.'}
              </div>
              <div className="result-note">
                Professional players typically aim for ROR below 5%, with many targeting 1% or less.
              </div>
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Bankroll Management Guidelines">
          <h3>Essential Rules</h3>
          <ul>
            <li><strong>Never play with money you can't afford to lose.</strong> Your bankroll should be completely separate from living expenses.</li>
            <li><strong>Have enough units.</strong> Aim for at least 100 max bets in your bankroll, preferably 200+.</li>
            <li><strong>Adjust bet sizes as bankroll changes.</strong> Recalculate your max bet every few sessions as your bankroll grows or shrinks.</li>
            <li><strong>Use fractional Kelly.</strong> Half-Kelly or quarter-Kelly reduces variance significantly while maintaining good growth.</li>
            <li><strong>Keep records.</strong> Track every session to monitor your actual win rate and variance.</li>
          </ul>

          <h3>Bet Spread Strategy</h3>
          <p>
            A typical bet spread for a 6-deck game with good penetration:
          </p>
          <ul>
            <li><strong>True Count ≤ +1:</strong> Minimum bet (1 unit)</li>
            <li><strong>True Count +2:</strong> 2-4 units</li>
            <li><strong>True Count +3:</strong> 4-6 units</li>
            <li><strong>True Count +4:</strong> 6-8 units</li>
            <li><strong>True Count +5+:</strong> 8-12 units (max bet)</li>
          </ul>

          <h3>Common Mistakes</h3>
          <ul>
            <li><strong>Playing under-bankrolled:</strong> The #1 reason counters go broke. Be patient and build your roll.</li>
            <li><strong>Chasing losses:</strong> Increasing bets after losing streaks. Stick to the math!</li>
            <li><strong>Not adjusting for conditions:</strong> Bad penetration, more decks, or more players all reduce your edge.</li>
            <li><strong>Ignoring variance:</strong> Even perfect play can result in losing streaks of 20+ hours.</li>
          </ul>

          <h3>Building Your Bankroll</h3>
          <p>
            If you're starting small:
          </p>
          <ul>
            <li>Start with single-deck or double-deck games if available (less variance)</li>
            <li>Play shorter sessions to reduce risk</li>
            <li>Consider starting at lower stakes to build experience and roll</li>
            <li>Reinvest winnings to grow bankroll faster</li>
            <li>Track every session meticulously</li>
          </ul>
        </CollapsibleSection>
      </div>
    </div>
  );
}


