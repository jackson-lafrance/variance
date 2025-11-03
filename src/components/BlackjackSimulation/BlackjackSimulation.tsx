import React, { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { saveHighScore, SimulationTypes } from '../../utils/highScores';
import { savePracticeSession } from '../../utils/practiceSessions';
import './BlackjackSimulation.css';

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

const getCardValue = (rank: string): number => {
  if (rank === 'A') return 11;
  if (['J', 'Q', 'K'].includes(rank)) return 10;
  return parseInt(rank);
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

export default function BlackjackSimulation() {
  const { currentUser } = useAuth();
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [gameStatus, setGameStatus] = useState<string>('');
  const [gameStarted, setGameStarted] = useState(false);
  const [dealerRevealing, setDealerRevealing] = useState(false);
  const [handsPlayed, setHandsPlayed] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const drawCard = (): Card => {
    const randomRank = ranks[Math.floor(Math.random() * ranks.length)];
    const randomSuit = suits[Math.floor(Math.random() * suits.length)];
    return {
      rank: randomRank,
      suit: randomSuit,
      code: `${randomRank}${randomSuit}`
    };
  };

  const checkForDealerBlackjack = (dealer: Card[]): boolean => {
    if (dealer.length !== 2) return false;
    const value = calculateHandValue(dealer).value;
    return value === 21;
  };

  const startGame = async () => {
    if (!sessionStartTime) {
      setSessionStartTime(Date.now());
    }
    setGameStarted(true);
    setGameStatus('');
    setDealerRevealing(false);
    
    const playerCard1 = drawCard();
    setPlayerHand([playerCard1]);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    const dealerCard1 = drawCard();
    setDealerHand([dealerCard1]);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    const playerCard2 = drawCard();
    setPlayerHand([playerCard1, playerCard2]);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    const dealerCard2 = drawCard();
    const dealerCards = [dealerCard1, dealerCard2];
    setDealerHand(dealerCards);

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
    } else if (playerValue === 21) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setGameStatus('Blackjack!');
    }
  };

  const hit = async () => {
    const newCard = drawCard();
    const newHand = [...playerHand, newCard];
    setPlayerHand(newHand);

    await new Promise(resolve => setTimeout(resolve, 400));

    const handValue = calculateHandValue(newHand).value;
    if (handValue > 21) {
      setGameStatus('You lose');
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
    setHandsPlayed(prev => prev + 1);
  };

  const handleSaveSession = async () => {
    if (!currentUser || handsPlayed === 0) return;
    
    const duration = sessionStartTime ? Math.floor((Date.now() - sessionStartTime) / 1000) : undefined;
    const score = handsPlayed * 100; // Simple scoring for basic game

    try {
      await saveHighScore(
        currentUser.uid,
        SimulationTypes.UNIFIED,
        score,
        0,
        0,
        0,
        handsPlayed
      );

      await savePracticeSession(
        currentUser.uid,
        SimulationTypes.UNIFIED,
        0,
        0,
        0,
        handsPlayed,
        duration
      );

      alert('Session saved successfully!');
    } catch (error) {
      console.error('Error saving session:', error);
      alert('Failed to save session. Please try again.');
    }
  };

  const handleReset = () => {
    setHandsPlayed(0);
    setSessionStartTime(null);
    setPlayerHand([]);
    setDealerHand([]);
    setGameStatus('');
    setGameStarted(false);
    setDealerRevealing(false);
  };

  const newGame = async () => {
    setPlayerHand([]);
    setDealerHand([]);
    setGameStatus('');
    setDealerRevealing(false);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const playerCard1 = drawCard();
    setPlayerHand([playerCard1]);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    const dealerCard1 = drawCard();
    setDealerHand([dealerCard1]);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    const playerCard2 = drawCard();
    setPlayerHand([playerCard1, playerCard2]);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    const dealerCard2 = drawCard();
    const dealerCards = [dealerCard1, dealerCard2];
    setDealerHand(dealerCards);

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
    } else if (playerValue === 21) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setGameStatus('Blackjack!');
    }
  };

  const renderCard = (card: Card, index: number) => (
    <div key={`${card.code}-${index}`} className="bj-card" style={{ borderColor: suitColors[card.suit] }}>
      <div className="bj-card-content" style={{ color: suitColors[card.suit] }}>
        <div className="bj-card-rank">{card.rank}</div>
        <div className="bj-card-suit">{suitNames[card.suit]}</div>
      </div>
    </div>
  );

  const playerValue = calculateHandValue(playerHand);
  const dealerValue = calculateHandValue(dealerHand);

  return (
      <div className="blackjack-simulation">
      <div className="bj-stats">
        <div className="bj-stat">
          <span className="bj-stat-label">Hands Played:</span>
          <span className="bj-stat-value">{handsPlayed}</span>
        </div>
      </div>

      <div className="bj-controls">
        {!gameStarted ? (
          <button className="bj-button bj-button-primary" onClick={startGame}>
            Deal Cards
          </button>
        ) : (
          <>
            {!gameStatus && (
              <>
                <button className="bj-button bj-button-secondary" onClick={hit}>
                  Hit
                </button>
                <button className="bj-button bj-button-secondary" onClick={() => stand()}>
                  Stand
                </button>
              </>
            )}
            <button className="bj-button bj-button-outline" onClick={newGame}>
              New Game
            </button>
            {handsPlayed > 0 && (
              <>
                <button className="bj-button bj-button-outline" onClick={handleSaveSession}>
                  Save Session
                </button>
                <button className="bj-button bj-button-outline" onClick={handleReset}>
                  Reset Stats
                </button>
              </>
            )}
          </>
        )}
      </div>

      {gameStarted && (
        <div className="bj-game" ref={gameAreaRef}>
          <div className="bj-hand">
            <div className="bj-hand-header">
              <h4>Dealer's Hand</h4>
              <span className="bj-hand-value">{dealerRevealing || gameStatus ? dealerValue.display : '?'}</span>
            </div>
            <div className="bj-cards">
              {dealerHand.map((card, idx) => (
                idx === 1 && !dealerRevealing && !gameStatus ? (
                  <div key="hidden" className="bj-card bj-card-hidden"></div>
                ) : renderCard(card, idx)
              ))}
            </div>
          </div>

          <div className="bj-hand">
            <div className="bj-hand-header">
              <h4>Your Hand</h4>
              <span className="bj-hand-value">{playerValue.display}</span>
            </div>
            <div className="bj-cards">
              {playerHand.map((card, idx) => renderCard(card, idx))}
            </div>
          </div>
        </div>
      )}

      {gameStatus && (
        <div className="bj-status">
          {gameStatus}
        </div>
      )}
    </div>
  );
}
