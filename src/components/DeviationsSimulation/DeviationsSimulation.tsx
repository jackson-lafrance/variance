import React, { useState, useRef } from 'react';
import './DeviationsSimulation.css';

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
  code: string;
}

const createShoe = (deckCount: number): Card[] => {
  const shoe: Card[] = [];
  for (let d = 0; d < deckCount; d++) {
    for (const rank of ranks) {
      for (const suit of suits) {
        shoe.push({ rank, suit, code: `${rank}${suit}` });
      }
    }
  }
  for (let i = shoe.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shoe[i], shoe[j]] = [shoe[j], shoe[i]];
  }
  return shoe;
};

interface DeviationScenario {
  playerCards: string[];
  dealerCard: string;
  trueCount: number;
  correctAction: string;
  basicStrategyAction: string;
  description: string;
}

const deviationScenarios: DeviationScenario[] = [
  { playerCards: ['10', '6'], dealerCard: '10', trueCount: 0, correctAction: 'stand', basicStrategyAction: 'hit', description: '16 vs 10' },
  { playerCards: ['9', '7'], dealerCard: '10', trueCount: 0, correctAction: 'stand', basicStrategyAction: 'hit', description: '16 vs 10' },
  { playerCards: ['9', '6'], dealerCard: '10', trueCount: 4, correctAction: 'stand', basicStrategyAction: 'hit', description: '15 vs 10' },
  { playerCards: ['8', '7'], dealerCard: '10', trueCount: 4, correctAction: 'stand', basicStrategyAction: 'hit', description: '15 vs 10' },
  { playerCards: ['10', '10'], dealerCard: '5', trueCount: 5, correctAction: 'split', basicStrategyAction: 'stand', description: '10,10 vs 5' },
  { playerCards: ['10', '10'], dealerCard: '6', trueCount: 4, correctAction: 'split', basicStrategyAction: 'stand', description: '10,10 vs 6' },
  { playerCards: ['7', '3'], dealerCard: '10', trueCount: 4, correctAction: 'double', basicStrategyAction: 'hit', description: '10 vs 10' },
  { playerCards: ['6', '4'], dealerCard: '10', trueCount: 4, correctAction: 'double', basicStrategyAction: 'hit', description: '10 vs 10' },
  { playerCards: ['8', '4'], dealerCard: '3', trueCount: 2, correctAction: 'stand', basicStrategyAction: 'hit', description: '12 vs 3' },
  { playerCards: ['10', '2'], dealerCard: '3', trueCount: 2, correctAction: 'stand', basicStrategyAction: 'hit', description: '12 vs 3' },
  { playerCards: ['7', '5'], dealerCard: '2', trueCount: 3, correctAction: 'stand', basicStrategyAction: 'hit', description: '12 vs 2' },
  { playerCards: ['9', '3'], dealerCard: '2', trueCount: 3, correctAction: 'stand', basicStrategyAction: 'hit', description: '12 vs 2' },
  { playerCards: ['6', '5'], dealerCard: 'A', trueCount: 1, correctAction: 'double', basicStrategyAction: 'hit', description: '11 vs A' },
  { playerCards: ['8', '3'], dealerCard: 'A', trueCount: 1, correctAction: 'double', basicStrategyAction: 'hit', description: '11 vs A' },
  { playerCards: ['6', '3'], dealerCard: '2', trueCount: 1, correctAction: 'double', basicStrategyAction: 'hit', description: '9 vs 2' },
  { playerCards: ['5', '4'], dealerCard: '2', trueCount: 1, correctAction: 'double', basicStrategyAction: 'hit', description: '9 vs 2' },
  { playerCards: ['7', '3'], dealerCard: 'A', trueCount: 4, correctAction: 'double', basicStrategyAction: 'hit', description: '10 vs A' },
  { playerCards: ['6', '4'], dealerCard: 'A', trueCount: 4, correctAction: 'double', basicStrategyAction: 'hit', description: '10 vs A' },
  { playerCards: ['5', '4'], dealerCard: '7', trueCount: 3, correctAction: 'double', basicStrategyAction: 'hit', description: '9 vs 7' },
  { playerCards: ['6', '3'], dealerCard: '7', trueCount: 3, correctAction: 'double', basicStrategyAction: 'hit', description: '9 vs 7' },
  { playerCards: ['10', '6'], dealerCard: '9', trueCount: 5, correctAction: 'stand', basicStrategyAction: 'hit', description: '16 vs 9' },
  { playerCards: ['9', '7'], dealerCard: '9', trueCount: 5, correctAction: 'stand', basicStrategyAction: 'hit', description: '16 vs 9' },
  { playerCards: ['10', '3'], dealerCard: '2', trueCount: -1, correctAction: 'stand', basicStrategyAction: 'hit', description: '13 vs 2' },
  { playerCards: ['9', '4'], dealerCard: '2', trueCount: -1, correctAction: 'stand', basicStrategyAction: 'hit', description: '13 vs 2' },
  { playerCards: ['8', '4'], dealerCard: '4', trueCount: 0, correctAction: 'stand', basicStrategyAction: 'hit', description: '12 vs 4' },
  { playerCards: ['10', '2'], dealerCard: '4', trueCount: 0, correctAction: 'stand', basicStrategyAction: 'hit', description: '12 vs 4' },
  { playerCards: ['7', '5'], dealerCard: '5', trueCount: -2, correctAction: 'stand', basicStrategyAction: 'hit', description: '12 vs 5' },
  { playerCards: ['9', '3'], dealerCard: '5', trueCount: -2, correctAction: 'stand', basicStrategyAction: 'hit', description: '12 vs 5' },
  { playerCards: ['8', '4'], dealerCard: '6', trueCount: -1, correctAction: 'stand', basicStrategyAction: 'hit', description: '12 vs 6' },
  { playerCards: ['10', '2'], dealerCard: '6', trueCount: -1, correctAction: 'stand', basicStrategyAction: 'hit', description: '12 vs 6' },
  { playerCards: ['10', '3'], dealerCard: '3', trueCount: -2, correctAction: 'stand', basicStrategyAction: 'hit', description: '13 vs 3' },
  { playerCards: ['9', '4'], dealerCard: '3', trueCount: -2, correctAction: 'stand', basicStrategyAction: 'hit', description: '13 vs 3' },
];

const getCardValue = (rank: string): number => {
  if (rank === 'A') return 11;
  if (['J', 'Q', 'K'].includes(rank)) return 10;
  return parseInt(rank);
};

const calculateHandValue = (cards: Card[]): { value: number; display: string } => {
  let value = 0;
  let aces = 0;
  cards.forEach(card => {
    value += getCardValue(card.rank);
    if (card.rank === 'A') aces++;
  });
  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }
  return { value, display: value.toString() };
};

export default function DeviationsSimulation() {
  const [deckCount, setDeckCount] = useState(6);
  const [penetration, setPenetration] = useState(75);
  const [shoe, setShoe] = useState<Card[]>(() => createShoe(6));
  const [cardsDealt, setCardsDealt] = useState(0);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [trueCount, setTrueCount] = useState(0);
  const [currentScenario, setCurrentScenario] = useState<DeviationScenario | null>(null);
  const [feedback, setFeedback] = useState('');
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [awaitingAction, setAwaitingAction] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const drawSpecificCard = (rank: string): Card => {
    const totalCards = deckCount * 52;
    const penetrationLimit = Math.floor(totalCards * (penetration / 100));
    
    if (cardsDealt >= penetrationLimit) {
      const newShoe = createShoe(deckCount);
      setShoe(newShoe);
      setCardsDealt(0);
      const randomSuit = suits[Math.floor(Math.random() * suits.length)];
      setCardsDealt(1);
      return { rank, suit: randomSuit, code: `${rank}${randomSuit}` };
    }
    
    setCardsDealt(prev => prev + 1);
    const randomSuit = suits[Math.floor(Math.random() * suits.length)];
    return { rank, suit: randomSuit, code: `${rank}${randomSuit}` };
  };

  const dealScenario = async () => {
    const scenario = deviationScenarios[Math.floor(Math.random() * deviationScenarios.length)];
    setCurrentScenario(scenario);
    setTrueCount(scenario.trueCount);
    setFeedback('');
    
    const playerCards = scenario.playerCards.map(r => drawSpecificCard(r));
    const dealerCard = drawSpecificCard(scenario.dealerCard);
    
    setPlayerHand(playerCards);
    setDealerHand([dealerCard]);
    setAwaitingAction(true);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    gameAreaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const startGame = async () => {
    setGameStarted(true);
    await dealScenario();
  };

  const handleAction = (action: string) => {
    if (!currentScenario || !awaitingAction) return;
    
    const isCorrect = action === currentScenario.correctAction;
    
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
      setFeedback(`✓ Correct! At count ${currentScenario.trueCount >= 0 ? '+' : ''}${currentScenario.trueCount}, you should ${currentScenario.correctAction} (deviation from basic strategy)`);
    } else {
      setIncorrectCount(prev => prev + 1);
      setFeedback(`✗ Incorrect. At count ${currentScenario.trueCount >= 0 ? '+' : ''}${currentScenario.trueCount}, you should ${currentScenario.correctAction}, not ${action}. Basic strategy says ${currentScenario.basicStrategyAction}, but this count calls for a deviation.`);
    }
    
    setAwaitingAction(false);
  };

  const nextHand = async () => {
    await dealScenario();
  };

  const renderCard = (card: Card, index: number) => (
    <div key={`${card.code}-${index}`} className="dev-card" style={{ borderColor: suitColors[card.suit] }}>
      <div className="dev-card-content" style={{ color: suitColors[card.suit] }}>
        <div className="dev-card-rank">{card.rank}</div>
        <div className="dev-card-suit">{suitNames[card.suit]}</div>
      </div>
    </div>
  );

  const handleDeckCountChange = (count: number) => {
    setDeckCount(count);
    const newShoe = createShoe(count);
    setShoe(newShoe);
    setCardsDealt(0);
  };

  const handlePenetrationChange = (pen: number) => {
    setPenetration(pen);
  };

  const playerValue = calculateHandValue(playerHand);
  const canDouble = playerHand.length === 2;
  const canSplit = playerHand.length === 2 && playerHand[0]?.rank === playerHand[1]?.rank;

  return (
    <div className="deviations-simulation">
      {!gameStarted && (
        <div className="dev-settings">
          <div className="dev-setting">
            <label className="dev-setting-label">
              Number of Decks:
              <select 
                value={deckCount}
                onChange={(e) => handleDeckCountChange(Number(e.target.value))}
                className="dev-setting-select"
              >
                <option value={1}>1 Deck</option>
                <option value={2}>2 Decks</option>
                <option value={4}>4 Decks</option>
                <option value={6}>6 Decks</option>
                <option value={8}>8 Decks</option>
              </select>
            </label>
          </div>
          <div className="dev-setting">
            <label className="dev-setting-label">
              Penetration:
              <select 
                value={penetration}
                onChange={(e) => handlePenetrationChange(Number(e.target.value))}
                className="dev-setting-select"
              >
                <option value={50}>50%</option>
                <option value={60}>60%</option>
                <option value={70}>70%</option>
                <option value={75}>75%</option>
                <option value={80}>80%</option>
                <option value={85}>85%</option>
                <option value={90}>90%</option>
              </select>
            </label>
          </div>
        </div>
      )}

      <div className="dev-stats">
        <div className="dev-stat">
          <span className="dev-stat-label">Correct:</span>
          <span className="dev-stat-value correct">{correctCount}</span>
        </div>
        <div className="dev-stat">
          <span className="dev-stat-label">Incorrect:</span>
          <span className="dev-stat-value incorrect">{incorrectCount}</span>
        </div>
        <div className="dev-stat">
          <span className="dev-stat-label">Accuracy:</span>
          <span className="dev-stat-value">
            {correctCount + incorrectCount > 0 
              ? `${Math.round((correctCount / (correctCount + incorrectCount)) * 100)}%` 
              : 'N/A'}
          </span>
        </div>
        <div className="dev-stat">
          <span className="dev-stat-label">Cards Dealt:</span>
          <span className="dev-stat-value">{cardsDealt}/{deckCount * 52}</span>
        </div>
        <div className="dev-stat">
          <span className="dev-stat-label">Decks Remaining:</span>
          <span className="dev-stat-value">{((deckCount * 52 - cardsDealt) / 52).toFixed(1)}</span>
        </div>
      </div>

      {gameStarted && currentScenario && (
        <div className="dev-count-display">
          <span className="dev-count-label">Count:</span>
          <span className="dev-count-value">{trueCount >= 0 ? '+' : ''}{trueCount}</span>
        </div>
      )}

      <div className="dev-controls">
        {!gameStarted ? (
          <button className="dev-button dev-button-primary" onClick={startGame}>
            Start Practice
          </button>
        ) : (
          <>
            {awaitingAction && (
              <>
                <button className="dev-button dev-button-secondary" onClick={() => handleAction('hit')}>
                  Hit
                </button>
                <button className="dev-button dev-button-secondary" onClick={() => handleAction('stand')}>
                  Stand
                </button>
                {canDouble && (
                  <button className="dev-button dev-button-special" onClick={() => handleAction('double')}>
                    Double Down
                  </button>
                )}
                {canSplit && (
                  <button className="dev-button dev-button-special" onClick={() => handleAction('split')}>
                    Split
                  </button>
                )}
              </>
            )}
            {!awaitingAction && (
              <button className="dev-button dev-button-primary" onClick={nextHand}>
                Next Hand
              </button>
            )}
          </>
        )}
      </div>

      {gameStarted && (
        <div className="dev-game" ref={gameAreaRef}>
          <div className="dev-hand">
            <div className="dev-hand-header">
              <h4>Dealer's Hand</h4>
              <span className="dev-hand-value">{calculateHandValue(dealerHand).display}</span>
            </div>
            <div className="dev-cards">
              {dealerHand.map((card, idx) => renderCard(card, idx))}
            </div>
          </div>

          <div className="dev-hand">
            <div className="dev-hand-header">
              <h4>Your Hand</h4>
              <span className="dev-hand-value">{playerValue.display}</span>
            </div>
            <div className="dev-cards">
              {playerHand.map((card, idx) => renderCard(card, idx))}
            </div>
          </div>
        </div>
      )}

      {feedback && (
        <div className={`dev-feedback ${feedback.startsWith('✓') ? 'correct' : 'incorrect'}`}>
          {feedback}
        </div>
      )}
    </div>
  );
}
