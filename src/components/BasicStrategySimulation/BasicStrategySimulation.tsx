import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { saveHighScore, SimulationTypes } from '../../utils/highScores';
import { savePracticeSession } from '../../utils/practiceSessions';
import './BasicStrategySimulation.css';

const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const suits = ['C', 'D', 'H', 'S'];

const suitNames: { [key: string]: string } = {
  'C': '♣',
  'D': '♦',
  'H': '♥',
  'S': '♠'
};

const suitColors: { [key: string]: string} = {
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

  let adjustedAces = 0;
  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
    adjustedAces++;
  }

  const isSoft = aces > 0 && value <= 21;

  return { value, display: value.toString(), isSoft };
};

const getCorrectAction = (playerHand: Card[], dealerUpcard: Card, canDouble: boolean, canSplit: boolean): string => {
  const handCalc = calculateHandValue(playerHand);
  const dealerValue = getCardValue(dealerUpcard.rank);
  
  if (canSplit && playerHand.length === 2 && playerHand[0].rank === playerHand[1].rank) {
    const pairRank = playerHand[0].rank;
    
    if (pairRank === 'A' || pairRank === '8') return 'split';
    
    if (['10', 'J', 'Q', 'K'].includes(pairRank)) {
      return 'stand'; // Never split 10s, Js, Qs, Ks
    }
    if (pairRank === '5') {
      // Never split 5s - treat as hard 10
      if (dealerValue <= 9 && canDouble) return 'double';
      return 'hit';
    }
    if (pairRank === '4') {
      // Never split 4s - treat as hard 8
      return 'hit';
    }
    if (pairRank === '9') {
      if (dealerValue === 7 || dealerValue >= 10) return 'stand';
      return 'split';
    }
    if (pairRank === '7') {
      if (dealerValue <= 7) return 'split';
      return 'hit';
    }
    if (pairRank === '6') {
      if (dealerValue >= 2 && dealerValue <= 6) return 'split';
      return 'hit';
    }
    if (pairRank === '3' || pairRank === '2') {
      if (dealerValue >= 4 && dealerValue <= 7) return 'split';
      return 'hit';
    }
  }

  if (handCalc.isSoft) {
    const softValue = handCalc.value;
    
    if (softValue >= 19) return 'stand';
    if (softValue === 18) {
      if (dealerValue >= 9) return 'hit';
      if (dealerValue >= 3 && dealerValue <= 6 && canDouble) return 'double';
      return 'stand';
    }
    if (dealerValue >= 4 && dealerValue <= 6 && canDouble) return 'double';
    return 'hit';
  }

  const hardValue = handCalc.value;
  
  if (hardValue >= 17) return 'stand';
  if (hardValue >= 13 && hardValue <= 16) {
    if (dealerValue >= 2 && dealerValue <= 6) return 'stand';
    return 'hit';
  }
  if (hardValue === 12) {
    if (dealerValue >= 4 && dealerValue <= 6) return 'stand';
    return 'hit';
  }
  if (hardValue === 11) {
    if (canDouble) return 'double';
    return 'hit';
  }
  if (hardValue === 10) {
    if (dealerValue <= 9 && canDouble) return 'double';
    return 'hit';
  }
  if (hardValue === 9) {
    if (dealerValue >= 3 && dealerValue <= 6 && canDouble) return 'double';
    return 'hit';
  }
  
  return 'hit';
};

export default function BasicStrategySimulation() {
  const { currentUser } = useAuth();
  const [playerHands, setPlayerHands] = useState<Card[][]>([]);
  const [activeHandIndex, setActiveHandIndex] = useState(0);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [dealerRevealing, setDealerRevealing] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [handComplete, setHandComplete] = useState<boolean[]>([]);
  const [feedback, setFeedback] = useState<string>('');
  const [correctAction, setCorrectAction] = useState<string>('');
  const [wasCorrectMove, setWasCorrectMove] = useState<boolean>(true);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
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
    setGameOver(false);
    setFeedback('');
    setCorrectAction('');
    setDealerRevealing(false);
    setActiveHandIndex(0);
    setHandComplete([false]);
    setWasCorrectMove(true);

    const playerCard1 = drawCard();
    setPlayerHands([[playerCard1]]);

    await new Promise(resolve => setTimeout(resolve, 300));
    const dealerCard1 = drawCard();
    setDealerHand([dealerCard1]);

    await new Promise(resolve => setTimeout(resolve, 300));
    const playerCard2 = drawCard();
    const playerCards = [playerCard1, playerCard2];
    setPlayerHands([playerCards]);

    await new Promise(resolve => setTimeout(resolve, 300));
    const dealerCard2 = drawCard();
    const dealerCards = [dealerCard1, dealerCard2];
    setDealerHand(dealerCards);

    await new Promise(resolve => setTimeout(resolve, 100));
    gameAreaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    if (checkForDealerBlackjack(dealerCards)) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setDealerRevealing(true);
      setGameOver(true);
      setHandComplete([true]);
      const playerValue = calculateHandValue(playerCards).value;
      if (playerValue === 21) {
        setFeedback('Push - Both have Blackjack!');
      } else {
        setFeedback('Dealer has Blackjack - You lose');
      }
      return;
    }

    if (calculateHandValue(playerCards).value === 21) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setFeedback('Blackjack! You win!');
      setGameOver(true);
      setHandComplete([true]);
      return;
    }

    const canDouble = playerCards.length === 2;
    const canSplit = playerCards.length === 2 && playerCards[0].rank === playerCards[1].rank;
    const correct = getCorrectAction(playerCards, dealerCard1, canDouble, canSplit);
    setCorrectAction(correct);
  };

  const handleAction = async (action: string) => {
    const isCorrect = action === correctAction;
    setWasCorrectMove(isCorrect);
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    } else {
      setIncorrectCount(prev => prev + 1);
    }
    const currentHand = playerHands[activeHandIndex];
    
    if (action === 'hit') {
      const newCard = drawCard();
      const updatedHands = [...playerHands];
      updatedHands[activeHandIndex] = [...currentHand, newCard];
      setPlayerHands(updatedHands);

      await new Promise(resolve => setTimeout(resolve, 400));

      const newHand = updatedHands[activeHandIndex];
      const handValue = calculateHandValue(newHand).value;
      if (handValue > 21) {
        setFeedback(isCorrect ? '✓ Correct! But you busted' : `✗ Wrong! Should ${correctAction}. You busted`);
        const updatedComplete = [...handComplete];
        updatedComplete[activeHandIndex] = true;
        setHandComplete(updatedComplete);
        
        if (activeHandIndex < playerHands.length - 1) {
          await moveToNextHand(updatedHands);
        } else {
          finishAllHands();
        }
      } else if (handValue === 21) {
        setFeedback(isCorrect ? '✓ Correct!' : `✗ Wrong! Should have ${correctAction}`);
        const updatedComplete = [...handComplete];
        updatedComplete[activeHandIndex] = true;
        setHandComplete(updatedComplete);
        
        if (activeHandIndex < playerHands.length - 1) {
          await moveToNextHand(updatedHands);
        } else {
          finishAllHands();
        }
      } else {
        const canDouble = false; 
        const canSplit = false;
        const newCorrect = getCorrectAction(newHand, dealerHand[0], canDouble, canSplit);
        setCorrectAction(newCorrect);
        setFeedback(isCorrect ? '✓ Correct!' : `✗ Wrong! Should have ${correctAction}`);
      }
    } else if (action === 'stand') {
      setFeedback(isCorrect ? '✓ Correct!' : `✗ Wrong! Should ${correctAction}`);
      const updatedComplete = [...handComplete];
      updatedComplete[activeHandIndex] = true;
      setHandComplete(updatedComplete);
      
      if (activeHandIndex < playerHands.length - 1) {
        await moveToNextHand(playerHands);
      } else {
        finishAllHands();
      }
    } else if (action === 'double') {
      const newCard = drawCard();
      const updatedHands = [...playerHands];
      updatedHands[activeHandIndex] = [...currentHand, newCard];
      setPlayerHands(updatedHands);

      await new Promise(resolve => setTimeout(resolve, 400));

      const newHand = updatedHands[activeHandIndex];
      const handValue = calculateHandValue(newHand).value;
      setFeedback(isCorrect ? '✓ Correct!' : `✗ Wrong! Should ${correctAction}`);
      
      const updatedComplete = [...handComplete];
      updatedComplete[activeHandIndex] = true;
      setHandComplete(updatedComplete);
      
      if (handValue > 21) {
        setFeedback(isCorrect ? '✓ Correct! But you busted (doubled)' : `✗ Wrong! Should ${correctAction}. Busted (doubled)`);
      }
      
      if (activeHandIndex < playerHands.length - 1) {
        await moveToNextHand(updatedHands);
      } else {
        finishAllHands();
      }
    } else if (action === 'split') {
      setFeedback(isCorrect ? '✓ Correct!' : `✗ Wrong! Should ${correctAction}`);
      await split();
    }
  };

  const split = async () => {
    const hand = playerHands[activeHandIndex];
    const beforeHands = playerHands.slice(0, activeHandIndex);
    const afterHands = playerHands.slice(activeHandIndex + 1);

    const newHands = [
      ...beforeHands,
      [hand[0]],
      [hand[1]],
      ...afterHands
    ];

    const newComplete = [
      ...handComplete.slice(0, activeHandIndex),
      false,
      false,
      ...handComplete.slice(activeHandIndex + 1)
    ];

    setPlayerHands(newHands);
    setHandComplete(newComplete);

    await new Promise(resolve => setTimeout(resolve, 300));
    const card1 = drawCard();
    newHands[activeHandIndex].push(card1);
    setPlayerHands([...newHands]);

    const firstHand = newHands[activeHandIndex];
    const canDouble = firstHand.length === 2;
    const canSplit = firstHand.length === 2 && firstHand[0].rank === firstHand[1].rank;
    const correct = getCorrectAction(firstHand, dealerHand[0], canDouble, canSplit);
    setCorrectAction(correct);
    setFeedback('');

    await new Promise(resolve => setTimeout(resolve, 300));
    const card2 = drawCard();
    newHands[activeHandIndex + 1].push(card2);
    setPlayerHands([...newHands]);
  };

  const moveToNextHand = async (currentHands: Card[][]) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const nextIndex = activeHandIndex + 1;
    setActiveHandIndex(nextIndex);
    
    const nextHand = currentHands[nextIndex];
    const canDouble = nextHand.length === 2;
    const canSplit = nextHand.length === 2 && nextHand[0].rank === nextHand[1].rank;
    const correct = getCorrectAction(nextHand, dealerHand[0], canDouble, canSplit);
    setCorrectAction(correct);
    setFeedback(''); 
  };

  const finishAllHands = async () => {
    setHandsPlayed(prev => prev + 1);
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

    let overallFeedback = '';
    playerHands.forEach((hand, idx) => {
      const playerValue = calculateHandValue(hand).value;
      let result = '';
      
      if (playerValue > 21) {
        result = 'Bust';
      } else if (dealerValue > 21) {
        result = 'Win (dealer bust)';
      } else if (playerValue > dealerValue) {
        result = 'Win';
      } else if (playerValue < dealerValue) {
        result = 'Loss';
      } else {
        result = 'Push';
      }
      
      if (playerHands.length > 1) {
        overallFeedback += `Hand ${idx + 1}: ${result}. `;
      } else {
        overallFeedback = result;
      }
    });

    const correctnessPrefix = wasCorrectMove ? '✓ Correct! ' : `✗ Wrong! Should ${correctAction}. `;
    setFeedback(correctnessPrefix + overallFeedback);
    setGameOver(true);
  };

  const renderCard = (card: Card, index: number) => (
    <div key={`${card.code}-${index}`} className="bs-card" style={{ borderColor: suitColors[card.suit] }}>
      <div className="bs-card-content" style={{ color: suitColors[card.suit] }}>
        <div className="bs-card-rank">{card.rank}</div>
        <div className="bs-card-suit">{suitNames[card.suit]}</div>
      </div>
    </div>
  );

  const dealerValue = calculateHandValue(dealerHand);
  
  const currentHand = playerHands[activeHandIndex] || [];
  const canDouble = currentHand.length === 2 && !gameOver && !handComplete[activeHandIndex];
  const canSplit = currentHand.length === 2 && currentHand[0]?.rank === currentHand[1]?.rank && !gameOver && !handComplete[activeHandIndex];

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver || !gameStarted || handComplete[activeHandIndex]) return;
      
      const key = e.key.toLowerCase();
      if (key === 'h' && !gameOver && !handComplete[activeHandIndex]) {
        handleAction('hit');
      } else if (key === 's' && !gameOver && !handComplete[activeHandIndex]) {
        handleAction('stand');
      } else if (key === 'd' && canDouble && !gameOver && !handComplete[activeHandIndex]) {
        handleAction('double');
      } else if (key === 'p' && canSplit && !gameOver && !handComplete[activeHandIndex]) {
        handleAction('split');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, gameOver, activeHandIndex, handComplete, canDouble, canSplit]);

  const handleSaveSession = async () => {
    if (!currentUser || (correctCount + incorrectCount === 0)) return;
    
    const accuracy = Math.round((correctCount / (correctCount + incorrectCount)) * 100);
    const duration = sessionStartTime ? Math.floor((Date.now() - sessionStartTime) / 1000) : undefined;
    const score = correctCount * 100 - incorrectCount * 50; // Simple scoring system

    try {
      await saveHighScore(
        currentUser.uid,
        SimulationTypes.BASIC_STRATEGY,
        score,
        accuracy,
        correctCount,
        incorrectCount,
        handsPlayed
      );

      await savePracticeSession(
        currentUser.uid,
        SimulationTypes.BASIC_STRATEGY,
        accuracy,
        correctCount,
        incorrectCount,
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
    setCorrectCount(0);
    setIncorrectCount(0);
    setHandsPlayed(0);
    setSessionStartTime(null);
    setGameStarted(false);
    setGameOver(false);
    setFeedback('');
  };

  const accuracy = correctCount + incorrectCount > 0 
    ? Math.round((correctCount / (correctCount + incorrectCount)) * 100) 
    : 0;

  return (
    <div className="basic-strategy-simulation">
      <div className="bs-stats">
        <div className="bs-stat">
          <span className="bs-stat-label">Correct:</span>
          <span className="bs-stat-value correct">{correctCount}</span>
        </div>
        <div className="bs-stat">
          <span className="bs-stat-label">Incorrect:</span>
          <span className="bs-stat-value incorrect">{incorrectCount}</span>
        </div>
        <div className="bs-stat">
          <span className="bs-stat-label">Accuracy:</span>
          <span className="bs-stat-value">
            {accuracy}%
          </span>
        </div>
        <div className="bs-stat">
          <span className="bs-stat-label">Hands Played:</span>
          <span className="bs-stat-value">{handsPlayed}</span>
        </div>
      </div>

      <div className="bs-controls">
        {!gameStarted ? (
          <button className="bs-button bs-button-primary" onClick={startGame}>
            Deal Cards
          </button>
        ) : (
          <>
            {!gameOver && !handComplete[activeHandIndex] && (
              <>
                <button className="bs-button bs-button-secondary" onClick={() => handleAction('hit')}>
                  Hit
                </button>
                <button className="bs-button bs-button-secondary" onClick={() => handleAction('stand')}>
                  Stand
                </button>
                {canDouble && (
                  <button className="bs-button bs-button-special" onClick={() => handleAction('double')}>
                    Double Down
                  </button>
                )}
                {canSplit && (
                  <button className="bs-button bs-button-special" onClick={() => handleAction('split')}>
                    Split
                  </button>
                )}
              </>
            )}
            <button className="bs-button bs-button-outline" onClick={startGame}>
              New Hand
            </button>
            {(correctCount + incorrectCount > 0) && (
              <>
                <button className="bs-button bs-button-outline" onClick={handleSaveSession}>
                  Save Session
                </button>
                <button className="bs-button bs-button-outline" onClick={handleReset}>
                  Reset Stats
                </button>
              </>
            )}
          </>
        )}
      </div>

      {gameStarted && (
        <div className="bs-game" ref={gameAreaRef}>
          <div className="bs-hand">
            <div className="bs-hand-header">
              <h4>Dealer's Hand</h4>
              <span className="bs-hand-value">{dealerRevealing || gameOver ? dealerValue.display : '?'}</span>
            </div>
            <div className="bs-cards">
              {dealerHand.map((card, idx) => (
                idx === 1 && !dealerRevealing && !gameOver ? (
                  <div key="hidden" className="bs-card bs-card-hidden"></div>
                ) : renderCard(card, idx)
              ))}
            </div>
          </div>

          <div className="bs-player-hands">
            {playerHands.map((hand, handIdx) => (
              <div key={handIdx} className={`bs-hand ${handIdx === activeHandIndex && !handComplete[handIdx] ? 'active' : ''} ${handComplete[handIdx] ? 'complete' : ''}`}>
                <div className="bs-hand-header">
                  <h4>Your Hand {playerHands.length > 1 ? `(${handIdx + 1})` : ''} {handIdx === activeHandIndex && !handComplete[handIdx] && '▸'}</h4>
                  <span className="bs-hand-value">{calculateHandValue(hand).display}</span>
                </div>
                <div className="bs-cards">
                  {hand.map((card, cardIdx) => renderCard(card, cardIdx))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={`bs-feedback ${feedback.startsWith('✓') ? 'correct' : 'incorrect'} ${!feedback ? 'hidden' : ''}`}>
        {feedback || 'Waiting for action...'}
      </div>
    </div>
  );
}
