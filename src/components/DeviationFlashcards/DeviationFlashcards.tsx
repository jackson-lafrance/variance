import React, { useState } from 'react';
import './DeviationFlashcards.css';

interface Deviation {
  id: number;
  hand: string;
  dealer: string;
  trueCount: number;
  action: string;
  basicStrategy: string;
  explanation: string;
}

const illustrious18: Deviation[] = [
  {
    id: 1,
    hand: 'Insurance',
    dealer: 'A',
    trueCount: 3,
    action: 'Take Insurance',
    basicStrategy: 'Never take insurance',
    explanation: 'Most valuable deviation. Take insurance when true count is +3 or higher.'
  },
  {
    id: 2,
    hand: '16',
    dealer: '10',
    trueCount: 0,
    action: 'Stand',
    basicStrategy: 'Hit',
    explanation: 'Stand on 16 vs 10 at true count 0 or higher.'
  },
  {
    id: 3,
    hand: '15',
    dealer: '10',
    trueCount: 4,
    action: 'Stand',
    basicStrategy: 'Hit',
    explanation: 'Stand on 15 vs 10 when true count is +4 or higher.'
  },
  {
    id: 4,
    hand: '10,10',
    dealer: '5',
    trueCount: 5,
    action: 'Split',
    basicStrategy: 'Stand',
    explanation: 'Split 10s vs dealer 5 at true count +5 or higher.'
  },
  {
    id: 5,
    hand: '10,10',
    dealer: '6',
    trueCount: 4,
    action: 'Split',
    basicStrategy: 'Stand',
    explanation: 'Split 10s vs dealer 6 at true count +4 or higher.'
  },
  {
    id: 6,
    hand: '10',
    dealer: '10',
    trueCount: 4,
    action: 'Double',
    basicStrategy: 'Hit',
    explanation: 'Double 10 vs 10 when true count is +4 or higher.'
  },
  {
    id: 7,
    hand: '12',
    dealer: '3',
    trueCount: 2,
    action: 'Stand',
    basicStrategy: 'Hit',
    explanation: 'Stand on 12 vs 3 at true count +2 or higher.'
  },
  {
    id: 8,
    hand: '12',
    dealer: '2',
    trueCount: 3,
    action: 'Stand',
    basicStrategy: 'Hit',
    explanation: 'Stand on 12 vs 2 when true count is +3 or higher.'
  },
  {
    id: 9,
    hand: '11',
    dealer: 'A',
    trueCount: 1,
    action: 'Double',
    basicStrategy: 'Hit',
    explanation: 'Double 11 vs Ace at true count +1 or higher.'
  },
  {
    id: 10,
    hand: '9',
    dealer: '2',
    trueCount: 1,
    action: 'Double',
    basicStrategy: 'Hit',
    explanation: 'Double 9 vs 2 when true count is +1 or higher.'
  },
  {
    id: 11,
    hand: '10',
    dealer: 'A',
    trueCount: 4,
    action: 'Double',
    basicStrategy: 'Hit',
    explanation: 'Double 10 vs Ace at true count +4 or higher.'
  },
  {
    id: 12,
    hand: '9',
    dealer: '7',
    trueCount: 3,
    action: 'Double',
    basicStrategy: 'Hit',
    explanation: 'Double 9 vs 7 when true count is +3 or higher.'
  },
  {
    id: 13,
    hand: '16',
    dealer: '9',
    trueCount: 5,
    action: 'Stand',
    basicStrategy: 'Hit',
    explanation: 'Stand on 16 vs 9 at true count +5 or higher.'
  },
  {
    id: 14,
    hand: '13',
    dealer: '2',
    trueCount: -1,
    action: 'Stand',
    basicStrategy: 'Hit',
    explanation: 'Stand on 13 vs 2 at true count -1 or higher.'
  },
  {
    id: 15,
    hand: '12',
    dealer: '4',
    trueCount: 0,
    action: 'Stand',
    basicStrategy: 'Hit',
    explanation: 'Stand on 12 vs 4 at true count 0 or higher.'
  },
  {
    id: 16,
    hand: '12',
    dealer: '5',
    trueCount: -2,
    action: 'Stand',
    basicStrategy: 'Hit',
    explanation: 'Stand on 12 vs 5 at true count -2 or higher.'
  },
  {
    id: 17,
    hand: '12',
    dealer: '6',
    trueCount: -1,
    action: 'Stand',
    basicStrategy: 'Hit',
    explanation: 'Stand on 12 vs 6 at true count -1 or higher.'
  },
  {
    id: 18,
    hand: '13',
    dealer: '3',
    trueCount: -2,
    action: 'Stand',
    basicStrategy: 'Hit',
    explanation: 'Stand on 13 vs 3 at true count -2 or higher.'
  }
];

export default function DeviationFlashcards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [shuffled, setShuffled] = useState<Deviation[]>(illustrious18);
  const [studied, setStudied] = useState<Set<number>>(new Set());

  const currentCard = shuffled[currentIndex];

  const shuffleCards = () => {
    const newShuffled = [...illustrious18].sort(() => Math.random() - 0.5);
    setShuffled(newShuffled);
    setCurrentIndex(0);
    setShowAnswer(false);
    setStudied(new Set());
  };

  const nextCard = () => {
    setStudied(prev => new Set(prev).add(currentCard.id));
    setShowAnswer(false);
    setCurrentIndex((prev) => (prev + 1) % shuffled.length);
  };

  const prevCard = () => {
    setShowAnswer(false);
    setCurrentIndex((prev) => (prev - 1 + shuffled.length) % shuffled.length);
  };

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  return (
    <div className="deviation-flashcards">
      <div className="flashcards-header">
        <div className="flashcard-progress">
          Card {currentIndex + 1} of {shuffled.length}
          <span className="studied-count">
            ({studied.size} studied)
          </span>
        </div>
        <button onClick={shuffleCards} className="shuffle-button">
          🔀 Shuffle
        </button>
      </div>

      <div className="flashcard-container">
        <div className={`flashcard ${showAnswer ? 'flipped' : ''}`} onClick={toggleAnswer}>
          {!showAnswer ? (
            <div className="flashcard-front">
              <div className="flashcard-label">Situation</div>
              <div className="flashcard-situation">
                <div className="situation-hand">
                  <span className="situation-label">Your Hand:</span>
                  <span className="situation-value">{currentCard.hand}</span>
                </div>
                <div className="situation-dealer">
                  <span className="situation-label">Dealer Shows:</span>
                  <span className="situation-value">{currentCard.dealer}</span>
                </div>
                <div className="situation-count">
                  <span className="situation-label">True Count:</span>
                  <span className="situation-value count-badge">
                    {currentCard.trueCount >= 0 ? '+' : ''}{currentCard.trueCount}
                  </span>
                </div>
              </div>
              <div className="flashcard-prompt">
                What should you do?
              </div>
              <div className="tap-hint">Tap to reveal</div>
            </div>
          ) : (
            <div className="flashcard-back">
              <div className="flashcard-label">Answer</div>
              <div className="flashcard-action">{currentCard.action}</div>
              <div className="flashcard-comparison">
                <div className="comparison-item basic">
                  <span className="comparison-label">Basic Strategy:</span>
                  <span className="comparison-value">{currentCard.basicStrategy}</span>
                </div>
                <div className="comparison-arrow">→</div>
                <div className="comparison-item deviation">
                  <span className="comparison-label">Deviation:</span>
                  <span className="comparison-value">{currentCard.action}</span>
                </div>
              </div>
              <div className="flashcard-explanation">
                {currentCard.explanation}
              </div>
              <div className="tap-hint">Tap to flip back</div>
            </div>
          )}
        </div>
      </div>

      <div className="flashcard-controls">
        <button onClick={prevCard} className="flashcard-nav-button">
          ← Previous
        </button>
        <button onClick={toggleAnswer} className="flashcard-flip-button">
          {showAnswer ? 'Hide Answer' : 'Show Answer'}
        </button>
        <button onClick={nextCard} className="flashcard-nav-button">
          Next →
        </button>
      </div>

      <div className="flashcard-tips">
        <strong>Study Tip:</strong> Try to answer before flipping. Focus on the true count trigger for each deviation.
      </div>
    </div>
  );
}


