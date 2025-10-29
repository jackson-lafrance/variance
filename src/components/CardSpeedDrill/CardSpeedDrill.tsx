import React, { useState, useEffect, useRef } from 'react';
import './CardSpeedDrill.css';

const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const suits = ['C', 'D', 'H', 'S'];

const suitNames: { [key: string]: string } = {
  'C': '♣', 'D': '♦', 'H': '♥', 'S': '♠'
};

const suitColors: { [key: string]: string } = {
  'C': '#000', 'D': '#d32f2f', 'H': '#d32f2f', 'S': '#000'
};

interface Card {
  rank: string;
  suit: string;
}

const getHiLoValue = (rank: string): number => {
  if (['2', '3', '4', '5', '6'].includes(rank)) return 1;
  if (['7', '8', '9'].includes(rank)) return 0;
  return -1;
};

export default function CardSpeedDrill() {
  const [isActive, setIsActive] = useState(false);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [runningCount, setRunningCount] = useState(0);
  const [cardsShown, setCardsShown] = useState(0);
  const [speed, setSpeed] = useState(1000);
  const [userGuess, setUserGuess] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [accuracy, setAccuracy] = useState(100);
  const [correctGuesses, setCorrectGuesses] = useState(0);
  const [totalGuesses, setTotalGuesses] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const drawRandomCard = () => {
    const randomRank = ranks[Math.floor(Math.random() * ranks.length)];
    const randomSuit = suits[Math.floor(Math.random() * suits.length)];
    return { rank: randomRank, suit: randomSuit };
  };

  const showNextCard = () => {
    const newCard = drawRandomCard();
    setCurrentCard(newCard);
    const cardValue = getHiLoValue(newCard.rank);
    setRunningCount(prev => prev + cardValue);
    setCardsShown(prev => prev + 1);
  };

  const startDrill = () => {
    setIsActive(true);
    setCurrentCard(null);
    setRunningCount(0);
    setCardsShown(0);
    setUserGuess('');
    setIsCorrect(null);
    setCorrectGuesses(0);
    setTotalGuesses(0);
    setAccuracy(100);
    
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    intervalRef.current = setInterval(() => {
      showNextCard();
    }, speed);
  };

  const stopDrill = () => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const checkGuess = () => {
    if (userGuess === '') return;
    
    const guess = parseInt(userGuess);
    const correct = guess === runningCount;
    
    setIsCorrect(correct);
    setTotalGuesses(prev => prev + 1);
    
    if (correct) {
      setCorrectGuesses(prev => prev + 1);
    }
    
    const newTotal = totalGuesses + 1;
    const newCorrect = correct ? correctGuesses + 1 : correctGuesses;
    setAccuracy(Math.round((newCorrect / newTotal) * 100));
    
    setTimeout(() => {
      setUserGuess('');
      setIsCorrect(null);
    }, 1000);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isActive) return;
      
      if (e.key === 'Enter' && userGuess !== '') {
        checkGuess();
      } else if (e.key === 'Escape') {
        stopDrill();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isActive, userGuess]);

  useEffect(() => {
    if (isActive) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        showNextCard();
      }, speed);
    }
  }, [speed]);

  return (
    <div className="card-speed-drill">
      {!isActive ? (
        <div className="drill-setup">
          <h4>Speed Settings</h4>
          <div className="speed-selector">
            <label>Cards per Second:</label>
            <div className="speed-options">
              <button 
                className={`speed-option ${speed === 2000 ? 'active' : ''}`}
                onClick={() => setSpeed(2000)}
              >
                0.5x (Slow)
              </button>
              <button 
                className={`speed-option ${speed === 1000 ? 'active' : ''}`}
                onClick={() => setSpeed(1000)}
              >
                1x (Normal)
              </button>
              <button 
                className={`speed-option ${speed === 500 ? 'active' : ''}`}
                onClick={() => setSpeed(500)}
              >
                2x (Fast)
              </button>
              <button 
                className={`speed-option ${speed === 250 ? 'active' : ''}`}
                onClick={() => setSpeed(250)}
              >
                4x (Expert)
              </button>
            </div>
          </div>
          <button className="drill-start-button" onClick={startDrill}>
            Start Speed Drill
          </button>
        </div>
      ) : (
        <div className="drill-active">
          <div className="drill-stats">
            <div className="drill-stat">
              <span className="drill-stat-label">Cards:</span>
              <span className="drill-stat-value">{cardsShown}</span>
            </div>
            <div className="drill-stat">
              <span className="drill-stat-label">Current Count:</span>
              <span className="drill-stat-value count-value">
                {runningCount >= 0 ? '+' : ''}{runningCount}
              </span>
            </div>
            <div className="drill-stat">
              <span className="drill-stat-label">Accuracy:</span>
              <span className={`drill-stat-value ${accuracy >= 90 ? 'good' : accuracy >= 70 ? 'ok' : 'poor'}`}>
                {totalGuesses > 0 ? `${accuracy}%` : 'N/A'}
              </span>
            </div>
            <div className="drill-stat">
              <span className="drill-stat-label">Correct:</span>
              <span className="drill-stat-value">{correctGuesses}/{totalGuesses}</span>
            </div>
          </div>

          <div className="drill-card-display">
            {currentCard && (
              <div className="drill-card" style={{ borderColor: suitColors[currentCard.suit] }}>
                <div className="drill-card-content" style={{ color: suitColors[currentCard.suit] }}>
                  <div className="drill-card-rank">{currentCard.rank}</div>
                  <div className="drill-card-suit">{suitNames[currentCard.suit]}</div>
                </div>
              </div>
            )}
          </div>

          <div className="drill-guess-section">
            <p className="drill-prompt">Enter your current count:</p>
            <p className="drill-keyboard-hint">Press Enter to check, ESC to stop</p>
            <div className="drill-guess-input">
              <input 
                type="number"
                value={userGuess}
                onChange={(e) => setUserGuess(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && checkGuess()}
                placeholder="Your count"
                className={`drill-input ${isCorrect === true ? 'correct' : isCorrect === false ? 'incorrect' : ''}`}
              />
              <button onClick={checkGuess} className="drill-check-button">
                Check
              </button>
            </div>
            {isCorrect !== null && (
              <div className={`drill-feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
                {isCorrect ? '✓ Correct!' : `✗ Wrong! Count is ${runningCount}`}
              </div>
            )}
          </div>

          <button className="drill-stop-button" onClick={stopDrill}>
            Stop Drill
          </button>
        </div>
      )}
    </div>
  );
}


