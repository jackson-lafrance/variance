import React, { useState, useRef } from 'react';
import './BasicHiLoSimulation.css';

const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const suits = ['C', 'D', 'H', 'S'];

const suitNames: { [key: string]: string } = {
  'C': '♣',
  'D': '♦',
  'H': '♥',
  'S': '♠'
};

const suitColors: { [key: string]: string } = {
  'C': '#000',
  'D': '#d32f2f',
  'H': '#d32f2f',
  'S': '#000'
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

const getCardValue = (rank: string): number => {
  if (rank === 'A') return 11;
  if (['J', 'Q', 'K'].includes(rank)) return 10;
  return parseInt(rank);
};

const getHiLoValue = (rank: string): number => {
  if (['2', '3', '4', '5', '6'].includes(rank)) return 1;
  if (['7', '8', '9'].includes(rank)) return 0;
  return -1;
};

const calculateHandValue = (cards: Card[]): { value: number; display: string; isSoft: boolean } => {
  let value = 0;
  let aces = 0;

  cards.forEach(card => {
    const cardValue = getCardValue(card.rank);
    value += cardValue;
    if (card.rank === 'A') aces++;
  });

  const isSoft = aces > 0 && value <= 21;

  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }

  return { value, display: value.toString(), isSoft };
};

export default function BasicHiLoSimulation() {
  const [deckCount, setDeckCount] = useState(6);
  const [penetration, setPenetration] = useState(75);
  const [shoe, setShoe] = useState<Card[]>(() => createShoe(6));
  const [cardsDealt, setCardsDealt] = useState(0);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [gameStatus, setGameStatus] = useState<string>('');
  const [gameStarted, setGameStarted] = useState(false);
  const [dealerRevealing, setDealerRevealing] = useState(false);
  const [runningCount, setRunningCount] = useState(0);
  const [handsPlayed, setHandsPlayed] = useState(0);
  const [userCountInput, setUserCountInput] = useState('');
  const [countCheckNeeded, setCountCheckNeeded] = useState(false);
  const [countFeedback, setCountFeedback] = useState('');
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const drawCard = (): Card => {
    const totalCards = deckCount * 52;
    const penetrationLimit = Math.floor(totalCards * (penetration / 100));
    
    if (cardsDealt >= penetrationLimit) {
      const newShoe = createShoe(deckCount);
      setShoe(newShoe);
      setCardsDealt(0);
      setRunningCount(0);
      const card = newShoe[0];
      setCardsDealt(1);
      return card;
    }
    
    const card = shoe[cardsDealt];
    setCardsDealt(prev => prev + 1);
    return card;
  };

  const updateCount = (cards: Card[]) => {
    const countChange = cards.reduce((sum, card) => sum + getHiLoValue(card.rank), 0);
    setRunningCount(prev => prev + countChange);
  };

  const checkForDealerBlackjack = (dealer: Card[]): boolean => {
    if (dealer.length !== 2) return false;
    const value = calculateHandValue(dealer).value;
    return value === 21;
  };

  const startGame = async () => {
    setGameStarted(true);
    setGameStatus('');
    setDealerRevealing(false);
    setCountFeedback('');
    
    const playerCard1 = drawCard();
    setPlayerHand([playerCard1]);
    updateCount([playerCard1]);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    const dealerCard1 = drawCard();
    setDealerHand([dealerCard1]);
    updateCount([dealerCard1]);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    const playerCard2 = drawCard();
    setPlayerHand([playerCard1, playerCard2]);
    updateCount([playerCard2]);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    const dealerCard2 = drawCard();
    const dealerCards = [dealerCard1, dealerCard2];
    setDealerHand(dealerCards);
    updateCount([dealerCard2]);

    await new Promise(resolve => setTimeout(resolve, 100));
    gameAreaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });

    const playerCards = [playerCard1, playerCard2];
    const playerValue = calculateHandValue(playerCards).value;
    
    if (checkForDealerBlackjack(dealerCards)) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setDealerRevealing(true);
      if (playerValue === 21) {
        setGameStatus('Push! Both have Blackjack');
      } else {
        setGameStatus('Dealer Blackjack - You lose');
      }
      finishHand();
    } else if (playerValue === 21) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setGameStatus('Blackjack!');
      finishHand();
    }
  };

  const hit = async () => {
    const newCard = drawCard();
    const newHand = [...playerHand, newCard];
    setPlayerHand(newHand);
    updateCount([newCard]);

    await new Promise(resolve => setTimeout(resolve, 400));

    const handValue = calculateHandValue(newHand).value;
    if (handValue > 21) {
      setGameStatus('You lose');
      finishHand();
    } else if (handValue === 21) {
      stand(newHand);
    }
  };

  const stand = async (currentHand = playerHand) => {
    setDealerRevealing(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    let dealerCards = [...dealerHand];
    let dealerHandCalc = calculateHandValue(dealerCards);
    let dealerValue = dealerHandCalc.value;

    while (dealerValue < 17 || (dealerValue === 17 && dealerHandCalc.isSoft)) {
      await new Promise(resolve => setTimeout(resolve, 700));
      const newCard = drawCard();
      dealerCards.push(newCard);
      setDealerHand([...dealerCards]);
      updateCount([newCard]);
      dealerHandCalc = calculateHandValue(dealerCards);
      dealerValue = dealerHandCalc.value;
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    const playerValue = calculateHandValue(currentHand).value;

    if (dealerValue > 21) {
      setGameStatus('Dealer busts! You win!');
    } else if (playerValue > dealerValue) {
      setGameStatus('You win!');
    } else if (playerValue < dealerValue) {
      setGameStatus('Dealer wins');
    } else {
      setGameStatus('Push! It\'s a tie');
    }

    finishHand();
  };

  const finishHand = () => {
    const newHandsPlayed = handsPlayed + 1;
    setHandsPlayed(newHandsPlayed);
    
    if (newHandsPlayed % 5 === 0) {
      setCountCheckNeeded(true);
    }
  };

  const checkCount = () => {
    const userCount = parseInt(userCountInput);
    if (isNaN(userCount)) {
      setCountFeedback('Please enter a valid number');
      return;
    }

    if (userCount === runningCount) {
      setCountFeedback(`✓ Correct! The running count is ${runningCount}`);
      setCorrectCount(prev => prev + 1);
    } else {
      setCountFeedback(`✗ Incorrect. You entered ${userCount}, but the running count is ${runningCount}`);
      setIncorrectCount(prev => prev + 1);
    }

    setCountCheckNeeded(false);
    setUserCountInput('');
  };

  const newGame = async () => {
    setPlayerHand([]);
    setDealerHand([]);
    setGameStatus('');
    setDealerRevealing(false);
    setCountFeedback('');
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const playerCard1 = drawCard();
    setPlayerHand([playerCard1]);
    updateCount([playerCard1]);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    const dealerCard1 = drawCard();
    setDealerHand([dealerCard1]);
    updateCount([dealerCard1]);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    const playerCard2 = drawCard();
    setPlayerHand([playerCard1, playerCard2]);
    updateCount([playerCard2]);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    const dealerCard2 = drawCard();
    const dealerCards = [dealerCard1, dealerCard2];
    setDealerHand(dealerCards);
    updateCount([dealerCard2]);

    await new Promise(resolve => setTimeout(resolve, 100));
    gameAreaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });

    const playerCards = [playerCard1, playerCard2];
    const playerValue = calculateHandValue(playerCards).value;
    
    if (checkForDealerBlackjack(dealerCards)) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setDealerRevealing(true);
      if (playerValue === 21) {
        setGameStatus('Push! Both have Blackjack');
      } else {
        setGameStatus('Dealer Blackjack - You lose');
      }
      finishHand();
    } else if (playerValue === 21) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setGameStatus('Blackjack!');
      finishHand();
    }
  };

  const resetSimulation = () => {
    setPlayerHand([]);
    setDealerHand([]);
    setGameStatus('');
    setGameStarted(false);
    setDealerRevealing(false);
    setRunningCount(0);
    setHandsPlayed(0);
    setUserCountInput('');
    setCountCheckNeeded(false);
    setCountFeedback('');
    setCorrectCount(0);
    setIncorrectCount(0);
  };

  const renderCard = (card: Card, index: number) => (
    <div key={`${card.code}-${index}`} className="hilo-card" style={{ borderColor: suitColors[card.suit] }}>
      <div className="hilo-card-content" style={{ color: suitColors[card.suit] }}>
        <div className="hilo-card-rank">{card.rank}</div>
        <div className="hilo-card-suit">{suitNames[card.suit]}</div>
      </div>
    </div>
  );

  const playerValue = calculateHandValue(playerHand);
  const dealerValue = calculateHandValue(dealerHand);

  const getTrueCount = (): number => {
    if (deckCount === 1) {
      return runningCount;
    }
    const totalCards = deckCount * 52;
    const cardsRemaining = totalCards - cardsDealt;
    const decksRemaining = Math.max(0.5, cardsRemaining / 52);
    return Math.round(runningCount / decksRemaining);
  };

  const handleDeckCountChange = (count: number) => {
    setDeckCount(count);
    const newShoe = createShoe(count);
    setShoe(newShoe);
    setCardsDealt(0);
    setRunningCount(0);
  };

  const handlePenetrationChange = (pen: number) => {
    setPenetration(pen);
  };

  return (
    <div className="basic-hilo-simulation">
      {!gameStarted && (
        <div className="hilo-settings">
          <div className="hilo-setting">
            <label className="hilo-setting-label">
              Number of Decks:
              <select 
                value={deckCount}
                onChange={(e) => handleDeckCountChange(Number(e.target.value))}
                className="hilo-setting-select"
              >
                <option value={1}>1 Deck</option>
                <option value={2}>2 Decks</option>
                <option value={4}>4 Decks</option>
                <option value={6}>6 Decks</option>
                <option value={8}>8 Decks</option>
              </select>
            </label>
          </div>
          <div className="hilo-setting">
            <label className="hilo-setting-label">
              Penetration:
              <select 
                value={penetration}
                onChange={(e) => handlePenetrationChange(Number(e.target.value))}
                className="hilo-setting-select"
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

      <div className="hilo-stats">
        <div className="hilo-stat">
          <span className="hilo-stat-label">Hands Played:</span>
          <span className="hilo-stat-value">{handsPlayed}</span>
        </div>
        <div className="hilo-stat">
          <span className="hilo-stat-label">Correct:</span>
          <span className="hilo-stat-value correct">{correctCount}</span>
        </div>
        <div className="hilo-stat">
          <span className="hilo-stat-label">Incorrect:</span>
          <span className="hilo-stat-value incorrect">{incorrectCount}</span>
        </div>
        <div className="hilo-stat">
          <span className="hilo-stat-label">Accuracy:</span>
          <span className="hilo-stat-value">
            {correctCount + incorrectCount > 0 
              ? `${Math.round((correctCount / (correctCount + incorrectCount)) * 100)}%` 
              : 'N/A'}
          </span>
        </div>
        <div className="hilo-stat">
          <span className="hilo-stat-label">Cards Dealt:</span>
          <span className="hilo-stat-value">{cardsDealt}/{deckCount * 52}</span>
        </div>
        <div className="hilo-stat">
          <span className="hilo-stat-label">Decks Remaining:</span>
          <span className="hilo-stat-value">{((deckCount * 52 - cardsDealt) / 52).toFixed(1)}</span>
        </div>
        {deckCount > 1 && gameStarted && (
          <div className="hilo-stat">
            <span className="hilo-stat-label">True Count:</span>
            <span className="hilo-stat-value">{getTrueCount() >= 0 ? '+' : ''}{getTrueCount()}</span>
          </div>
        )}
      </div>

      <div className="hilo-controls">
        {!gameStarted ? (
          <button className="hilo-button hilo-button-primary" onClick={startGame}>
            Deal Cards
          </button>
        ) : (
          <>
            {!gameStatus && !countCheckNeeded && (
              <>
                <button className="hilo-button hilo-button-secondary" onClick={hit}>
                  Hit
                </button>
                <button className="hilo-button hilo-button-secondary" onClick={() => stand()}>
                  Stand
                </button>
              </>
            )}
            {gameStatus && !countCheckNeeded && (
              <button className="hilo-button hilo-button-primary" onClick={newGame}>
                New Hand
              </button>
            )}
            <button className="hilo-button hilo-button-outline" onClick={resetSimulation}>
              Reset Simulation
            </button>
          </>
        )}
      </div>

      {gameStarted && (
        <div className="hilo-game" ref={gameAreaRef}>
          <div className="hilo-hand">
            <div className="hilo-hand-header">
              <h4>Dealer's Hand</h4>
              <span className="hilo-hand-value">{dealerRevealing || gameStatus ? dealerValue.display : '?'}</span>
            </div>
            <div className="hilo-cards">
              {dealerHand.map((card, idx) => (
                idx === 1 && !dealerRevealing && !gameStatus ? (
                  <div key="hidden" className="hilo-card hilo-card-hidden"></div>
                ) : renderCard(card, idx)
              ))}
            </div>
          </div>

          <div className="hilo-hand">
            <div className="hilo-hand-header">
              <h4>Your Hand</h4>
              <span className="hilo-hand-value">{playerValue.display}</span>
            </div>
            <div className="hilo-cards">
              {playerHand.map((card, idx) => renderCard(card, idx))}
            </div>
          </div>
        </div>
      )}

      {gameStatus && (
        <div className="hilo-status">
          {gameStatus}
        </div>
      )}

      {countCheckNeeded && (
        <div className="hilo-count-check">
          <h4>Running Count Check!</h4>
          <p>You've played {handsPlayed} hands. What is the current running count?</p>
          <div className="hilo-count-input-group">
            <input
              type="number"
              className="hilo-count-input"
              value={userCountInput}
              onChange={(e) => setUserCountInput(e.target.value)}
              placeholder="Enter count"
              autoFocus
            />
            <button className="hilo-button hilo-button-primary" onClick={checkCount}>
              Submit
            </button>
          </div>
        </div>
      )}

      {countFeedback && (
        <div className={`hilo-count-feedback ${countFeedback.startsWith('✓') ? 'correct' : 'incorrect'}`}>
          {countFeedback}
        </div>
      )}
    </div>
  );
}

