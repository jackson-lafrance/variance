import React, { useState, useRef, useEffect } from 'react';
import './UnifiedSimulation.css';

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

export type PracticeMode = 'full' | 'deviations' | 'soft' | 'hard' | 'pairs' | 'doubling' | 'basic';

export interface SimulationSettings {
  practiceMode: PracticeMode;
  countingEnabled: boolean;
  countCheckFrequency: number;
  deviationsEnabled: boolean;
  animationSpeed: number;
  deckCount: number;
  penetration: number;
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
    value += getCardValue(card.rank);
    if (card.rank === 'A') aces++;
  });
  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }
  const isSoft = aces > 0 && value <= 21;
  return { value, display: value.toString(), isSoft };
};

const getBasicStrategyAction = (playerHand: Card[], dealerUpcard: Card, canDouble: boolean, canSplit: boolean): string => {
  const handCalc = calculateHandValue(playerHand);
  const dealerValue = getCardValue(dealerUpcard.rank);
  
  if (canSplit && playerHand.length === 2 && playerHand[0].rank === playerHand[1].rank) {
    const pairRank = playerHand[0].rank;
    
    if (pairRank === 'A' || pairRank === '8') {
      return 'split';
    }
    
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

const getDeviationAction = (playerHand: Card[], dealerUpcard: Card, trueCount: number, basicAction: string, canDouble: boolean, canSplit: boolean): string => {
  const handCalc = calculateHandValue(playerHand);
  const dealerValue = getCardValue(dealerUpcard.rank);
  const playerValue = handCalc.value;

  if (playerValue === 16 && dealerValue === 10 && trueCount >= 0) return 'stand';
  if (playerValue === 15 && dealerValue === 10 && trueCount >= 4) return 'stand';
  if (playerValue === 16 && dealerValue === 9 && trueCount >= 5) return 'stand';
  if (playerHand.length === 2 && playerHand[0].rank === '10' && playerHand[1].rank === '10' && dealerValue === 5 && trueCount >= 5 && canSplit) return 'split';
  if (playerHand.length === 2 && playerHand[0].rank === '10' && playerHand[1].rank === '10' && dealerValue === 6 && trueCount >= 4 && canSplit) return 'split';
  if (playerValue === 10 && dealerValue === 10 && trueCount >= 4 && canDouble) return 'double';
  if (playerValue === 10 && dealerValue === 11 && trueCount >= 4 && canDouble) return 'double';
  if (playerValue === 12 && dealerValue === 3 && trueCount >= 2) return 'stand';
  if (playerValue === 12 && dealerValue === 2 && trueCount >= 3) return 'stand';
  if (playerValue === 12 && dealerValue === 4 && trueCount >= 0) return 'stand';
  if (playerValue === 12 && dealerValue === 5 && trueCount >= -2) return 'stand';
  if (playerValue === 12 && dealerValue === 6 && trueCount >= -1) return 'stand';
  if (playerValue === 13 && dealerValue === 2 && trueCount >= -1) return 'stand';
  if (playerValue === 13 && dealerValue === 3 && trueCount >= -2) return 'stand';
  if (playerValue === 11 && dealerValue === 11 && trueCount >= 1 && canDouble) return 'double';
  if (playerValue === 9 && dealerValue === 2 && trueCount >= 1 && canDouble) return 'double';
  if (playerValue === 9 && dealerValue === 7 && trueCount >= 3 && canDouble) return 'double';
  
  return basicAction;
};

interface UnifiedSimulationProps {
  settings: SimulationSettings;
}

export default function UnifiedSimulation({ settings }: UnifiedSimulationProps) {
  const [shoe, setShoe] = useState<Card[]>(() => createShoe(settings.deckCount));
  const [cardsDealt, setCardsDealt] = useState(0);
  const [playerHands, setPlayerHands] = useState<Card[][]>([]);
  const [activeHandIndex, setActiveHandIndex] = useState(0);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [dealerRevealing, setDealerRevealing] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [handComplete, setHandComplete] = useState<boolean[]>([]);
  const [feedback, setFeedback] = useState<string>('');
  const [correctAction, setCorrectAction] = useState<string>('');
  const [hasActed, setHasActed] = useState<boolean>(false);
  const [wasCorrectMove, setWasCorrectMove] = useState<boolean>(true);
  const wasCorrectMoveRef = useRef<boolean>(true);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [runningCount, setRunningCount] = useState(0);
  const [handsPlayed, setHandsPlayed] = useState(0);
  const [userCountInput, setUserCountInput] = useState('');
  const [countCheckNeeded, setCountCheckNeeded] = useState(false);
  const [countFeedback, setCountFeedback] = useState('');
  const [countCorrectCount, setCountCorrectCount] = useState(0);
  const [countIncorrectCount, setCountIncorrectCount] = useState(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newShoe = createShoe(settings.deckCount);
    setShoe(newShoe);
    setCardsDealt(0);
    setRunningCount(0);
  }, [settings.deckCount, settings.penetration]);

  useEffect(() => {
    if (gameStarted && !countCheckNeeded) {
      setPlayerHands([]);
      setDealerHand([]);
      setGameStarted(false);
      setGameOver(false);
      setFeedback('');
      setDealerRevealing(false);
    }
  }, [settings.practiceMode, settings.deviationsEnabled, settings.countingEnabled]);

  const drawCard = (): Card => {
    const totalCards = settings.deckCount * 52;
    const penetrationLimit = Math.floor(totalCards * (settings.penetration / 100));
    
    if (cardsDealt >= penetrationLimit) {
      const newShoe = createShoe(settings.deckCount);
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

  const drawSpecificHand = (mode: PracticeMode): { playerCards: Card[], dealerCard: Card } => {
    if (mode === 'deviations') {
      const scenarios = [
        { player: ['10', '6'], dealer: '10' },
        { player: ['9', '6'], dealer: '10' },
        { player: ['10', '10'], dealer: '5' },
        { player: ['10', '10'], dealer: '6' },
        { player: ['7', '3'], dealer: '10' },
      ];
      const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
      return {
        playerCards: scenario.player.map(r => ({ rank: r, suit: suits[Math.floor(Math.random() * suits.length)], code: `${r}C` })),
        dealerCard: { rank: scenario.dealer, suit: suits[Math.floor(Math.random() * suits.length)], code: `${scenario.dealer}C` }
      };
    }
    
    if (mode === 'soft') {
      const softCards = [['A', '2'], ['A', '3'], ['A', '4'], ['A', '5'], ['A', '6'], ['A', '7'], ['A', '8']];
      const hand = softCards[Math.floor(Math.random() * softCards.length)];
      return {
        playerCards: hand.map(r => ({ rank: r, suit: suits[Math.floor(Math.random() * suits.length)], code: `${r}C` })),
        dealerCard: drawCard()
      };
    }
    
    if (mode === 'pairs') {
      const pairRank = ranks[Math.floor(Math.random() * ranks.length)];
      return {
        playerCards: [
          { rank: pairRank, suit: suits[0], code: `${pairRank}C` },
          { rank: pairRank, suit: suits[1], code: `${pairRank}D` }
        ],
        dealerCard: drawCard()
      };
    }
    
    if (mode === 'doubling') {
      const doublingHands = [['6', '5'], ['7', '4'], ['8', '3'], ['6', '4'], ['7', '3'], ['5', '4'], ['6', '3']];
      const hand = doublingHands[Math.floor(Math.random() * doublingHands.length)];
      return {
        playerCards: hand.map(r => ({ rank: r, suit: suits[Math.floor(Math.random() * suits.length)], code: `${r}C` })),
        dealerCard: drawCard()
      };
    }
    
    return {
      playerCards: [drawCard(), drawCard()],
      dealerCard: drawCard()
    };
  };

  const updateCount = (cards: Card[]) => {
    if (!settings.countingEnabled) return;
    const countChange = cards.reduce((sum, card) => sum + getHiLoValue(card.rank), 0);
    setRunningCount(prev => prev + countChange);
  };

  const checkForDealerBlackjack = (dealer: Card[]): boolean => {
    if (dealer.length !== 2) return false;
    return calculateHandValue(dealer).value === 21;
  };

  const getTrueCount = (): number => {
    if (settings.deckCount === 1) {
      return runningCount;
    }
    const totalCards = settings.deckCount * 52;
    const cardsRemaining = totalCards - cardsDealt;
    const decksRemaining = Math.max(0.5, cardsRemaining / 52);
    return Math.round(runningCount / decksRemaining);
  };

  const startGame = async () => {
    setGameStarted(true);
    setGameOver(false);
    setFeedback('');
    setCorrectAction('');
    setHasActed(false);
    setWasCorrectMove(true);
    wasCorrectMoveRef.current = true;
    setDealerRevealing(false);
    setHandComplete([]);
    setActiveHandIndex(0);
    setCountFeedback('');

    const { playerCards, dealerCard } = drawSpecificHand(settings.practiceMode);
    
    setPlayerHands([playerCards]);
    updateCount(playerCards);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const dealerCard2 = drawCard();
    const dealerCards = [dealerCard, dealerCard2];
    setDealerHand(dealerCards);
    updateCount([dealerCard]);
    
    setHandComplete([false]);

    await new Promise(resolve => setTimeout(resolve, 100));

    const canDouble = true;
    const canSplit = playerCards[0].rank === playerCards[1].rank;
    const basicAction = getBasicStrategyAction(playerCards, dealerCard, canDouble, canSplit);
    const trueCount = getTrueCount();
    const correctActionValue = settings.deviationsEnabled && settings.countingEnabled 
      ? getDeviationAction(playerCards, dealerCard, trueCount, basicAction, canDouble, canSplit)
      : basicAction;
    setCorrectAction(correctActionValue);

    const playerValue = calculateHandValue(playerCards).value;
    
    if (checkForDealerBlackjack(dealerCards)) {
      await new Promise(resolve => setTimeout(resolve, 500 * settings.animationSpeed));
      setDealerRevealing(true);
      updateCount([dealerCards[1]]);
      setGameOver(true);
      if (playerValue === 21) {
        setFeedback('Push! Both have Blackjack');
      } else {
        setFeedback('Dealer Blackjack - You lose');
      }
      finishHand();
    } else if (playerValue === 21) {
      await new Promise(resolve => setTimeout(resolve, 500 * settings.animationSpeed));
      setGameOver(true);
      setFeedback('Blackjack!');
      finishHand();
    }
  };

  const handleAction = async (action: string) => {
    const isCorrect = action === correctAction;
    
    if (!hasActed) {
      setHasActed(true);
    }
    
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    } else {
      setIncorrectCount(prev => prev + 1);
      setWasCorrectMove(false);
      wasCorrectMoveRef.current = false;
    }
    
    const currentHand = playerHands[activeHandIndex];
    
    if (action === 'hit') {
      const newCard = drawCard();
      const updatedHands = [...playerHands];
      updatedHands[activeHandIndex] = [...currentHand, newCard];
      setPlayerHands(updatedHands);
      updateCount([newCard]);

      await new Promise(resolve => setTimeout(resolve, 400 * settings.animationSpeed));

      const handValue = calculateHandValue(updatedHands[activeHandIndex]).value;
      if (handValue > 21) {
        const updatedComplete = [...handComplete];
        updatedComplete[activeHandIndex] = true;
        setHandComplete(updatedComplete);
        
        if (activeHandIndex < updatedHands.length - 1) {
          setActiveHandIndex(activeHandIndex + 1);
          setHasActed(false);
          const nextHand = updatedHands[activeHandIndex + 1];
          const canDouble = nextHand.length === 2;
          const canSplit = nextHand.length === 2 && nextHand[0].rank === nextHand[1].rank;
          const basicAction = getBasicStrategyAction(nextHand, dealerHand[0], canDouble, canSplit);
          const trueCount = getTrueCount();
          const correctActionValue = settings.deviationsEnabled && settings.countingEnabled
            ? getDeviationAction(nextHand, dealerHand[0], trueCount, basicAction, canDouble, canSplit)
            : basicAction;
          setCorrectAction(correctActionValue);
        } else {
          finishAllHands(updatedHands);
        }
      } else {
        const canDouble = false;
        const canSplit = false;
        const basicAction = getBasicStrategyAction(updatedHands[activeHandIndex], dealerHand[0], canDouble, canSplit);
        const trueCount = getTrueCount();
        const correctActionValue = settings.deviationsEnabled && settings.countingEnabled
          ? getDeviationAction(updatedHands[activeHandIndex], dealerHand[0], trueCount, basicAction, canDouble, canSplit)
          : basicAction;
        setCorrectAction(correctActionValue);
      }
    } else if (action === 'stand') {
      const updatedComplete = [...handComplete];
      updatedComplete[activeHandIndex] = true;
      setHandComplete(updatedComplete);
      
      if (activeHandIndex < playerHands.length - 1) {
        setActiveHandIndex(activeHandIndex + 1);
        setHasActed(false);
        const nextHand = playerHands[activeHandIndex + 1];
        const canDouble = nextHand.length === 2;
        const canSplit = nextHand.length === 2 && nextHand[0].rank === nextHand[1].rank;
        const basicAction = getBasicStrategyAction(nextHand, dealerHand[0], canDouble, canSplit);
        const trueCount = getTrueCount();
        const correctActionValue = settings.deviationsEnabled && settings.countingEnabled
          ? getDeviationAction(nextHand, dealerHand[0], trueCount, basicAction, canDouble, canSplit)
          : basicAction;
        setCorrectAction(correctActionValue);
      } else {
        finishAllHands(playerHands);
      }
    } else if (action === 'double') {
      const newCard = drawCard();
      const updatedHands = [...playerHands];
      updatedHands[activeHandIndex] = [...currentHand, newCard];
      setPlayerHands(updatedHands);
      updateCount([newCard]);

      await new Promise(resolve => setTimeout(resolve, 400 * settings.animationSpeed));

      const updatedComplete = [...handComplete];
      updatedComplete[activeHandIndex] = true;
      setHandComplete(updatedComplete);
      
      if (activeHandIndex < updatedHands.length - 1) {
        setActiveHandIndex(activeHandIndex + 1);
        setHasActed(false);
        const nextHand = updatedHands[activeHandIndex + 1];
        const canDouble = nextHand.length === 2;
        const canSplit = nextHand.length === 2 && nextHand[0].rank === nextHand[1].rank;
        const basicAction = getBasicStrategyAction(nextHand, dealerHand[0], canDouble, canSplit);
        const trueCount = getTrueCount();
        const correctActionValue = settings.deviationsEnabled && settings.countingEnabled
          ? getDeviationAction(nextHand, dealerHand[0], trueCount, basicAction, canDouble, canSplit)
          : basicAction;
        setCorrectAction(correctActionValue);
      } else {
        finishAllHands(updatedHands);
      }
    } else if (action === 'split') {
      const card1 = drawCard();
      const card2 = drawCard();
      const newHands = [
        [currentHand[0], card1],
        [currentHand[1], card2]
      ];
      const updatedAllHands = [...playerHands];
      updatedAllHands.splice(activeHandIndex, 1, ...newHands);
      setPlayerHands(updatedAllHands);
      updateCount([card1, card2]);
      
      const updatedComplete = [...handComplete];
      updatedComplete.splice(activeHandIndex, 1, false, false);
      setHandComplete(updatedComplete);

      await new Promise(resolve => setTimeout(resolve, 400 * settings.animationSpeed));

      setHasActed(false);
      const canDouble = true;
      const canSplit = newHands[0][0].rank === newHands[0][1].rank;
      const basicAction = getBasicStrategyAction(newHands[0], dealerHand[0], canDouble, canSplit);
      const trueCount = getTrueCount();
      const correctActionValue = settings.deviationsEnabled && settings.countingEnabled
        ? getDeviationAction(newHands[0], dealerHand[0], trueCount, basicAction, canDouble, canSplit)
        : basicAction;
      setCorrectAction(correctActionValue);
    }
  };

  const finishAllHands = async (handsToEvaluate = playerHands) => {
    setDealerRevealing(true);
    
    let dealerCards = [...dealerHand];
    if (dealerCards.length >= 2) {
      updateCount([dealerCards[1]]);
    }
    
    await new Promise(resolve => setTimeout(resolve, 800 * settings.animationSpeed));

    let dealerHandCalc = calculateHandValue(dealerCards);
    let dealerValue = dealerHandCalc.value;

    const allPlayerHandsBusted = handsToEvaluate.every(hand => calculateHandValue(hand).value > 21);

    if (!allPlayerHandsBusted) {
      while (dealerValue < 17 || (dealerValue === 17 && dealerHandCalc.isSoft)) {
        await new Promise(resolve => setTimeout(resolve, 700 * settings.animationSpeed));
        const newCard = drawCard();
        dealerCards.push(newCard);
        setDealerHand([...dealerCards]);
        updateCount([newCard]);
        dealerHandCalc = calculateHandValue(dealerCards);
        dealerValue = dealerHandCalc.value;
      }
    }

    await new Promise(resolve => setTimeout(resolve, 500 * settings.animationSpeed));

    const results: string[] = [];
    let anyWin = false;
    let anyLoss = false;

    handsToEvaluate.forEach((hand, idx) => {
      const playerValue = calculateHandValue(hand).value;
      
      if (playerValue > 21) {
        results.push(`Hand ${idx + 1}: Bust - Loss`);
        anyLoss = true;
      } else if (dealerValue > 21) {
        results.push(`Hand ${idx + 1}: Dealer Bust - Win`);
        anyWin = true;
      } else if (playerValue > dealerValue) {
        results.push(`Hand ${idx + 1}: Win`);
        anyWin = true;
      } else if (playerValue < dealerValue) {
        results.push(`Hand ${idx + 1}: Loss`);
        anyLoss = true;
      } else {
        results.push(`Hand ${idx + 1}: Push`);
      }
    });

    const correctPrefix = wasCorrectMoveRef.current ? '✓ Correct move! ' : '✗ Wrong move! ';
    setFeedback(correctPrefix + results.join(', '));
    setGameOver(true);
    finishHand();
  };

  const finishHand = () => {
    const newHandsPlayed = handsPlayed + 1;
    setHandsPlayed(newHandsPlayed);
    
    if (settings.countingEnabled && settings.countCheckFrequency > 0 && newHandsPlayed % settings.countCheckFrequency === 0) {
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
      setCountCorrectCount(prev => prev + 1);
    } else {
      setCountFeedback(`✗ Incorrect. You entered ${userCount}, but the running count is ${runningCount}`);
      setCountIncorrectCount(prev => prev + 1);
    }

    setCountCheckNeeded(false);
    setUserCountInput('');
  };

  const renderCard = (card: Card, index: number) => (
    <div key={`${card.code}-${index}`} className="unified-card" style={{ borderColor: suitColors[card.suit] }}>
      <div className="unified-card-content" style={{ color: suitColors[card.suit] }}>
        <div className="unified-card-rank">{card.rank}</div>
        <div className="unified-card-suit">{suitNames[card.suit]}</div>
      </div>
    </div>
  );

  const currentHand = playerHands[activeHandIndex] || [];
  const canDouble = currentHand.length === 2 && !gameOver && !handComplete[activeHandIndex];
  const canSplit = currentHand.length === 2 && currentHand[0]?.rank === currentHand[1]?.rank && !gameOver && !handComplete[activeHandIndex];
  const dealerValue = calculateHandValue(dealerHand);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver || !gameStarted || handComplete[activeHandIndex] || countCheckNeeded) return;
      
      const key = e.key.toLowerCase();
      if (key === 'h') {
        handleAction('hit');
      } else if (key === 's') {
        handleAction('stand');
      } else if (key === 'd' && canDouble) {
        handleAction('double');
      } else if (key === 'p' && canSplit) {
        handleAction('split');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, gameOver, activeHandIndex, handComplete, canDouble, canSplit, countCheckNeeded]);

  return (
    <div className="unified-simulation">
      <div className="unified-stats">
        <div className="unified-stat">
          <span className="unified-stat-label">Correct Plays:</span>
          <span className="unified-stat-value correct">{correctCount}</span>
        </div>
        <div className="unified-stat">
          <span className="unified-stat-label">Incorrect Plays:</span>
          <span className="unified-stat-value incorrect">{incorrectCount}</span>
        </div>
        <div className="unified-stat">
          <span className="unified-stat-label">Accuracy:</span>
          <span className="unified-stat-value">
            {correctCount + incorrectCount > 0 
              ? `${Math.round((correctCount / (correctCount + incorrectCount)) * 100)}%` 
              : 'N/A'}
          </span>
        </div>
        {settings.countingEnabled && (
          <>
            <div className="unified-stat">
              <span className="unified-stat-label">Count Checks:</span>
              <span className="unified-stat-value">
                {countCorrectCount}/{countCorrectCount + countIncorrectCount}
              </span>
            </div>
            {settings.countCheckFrequency === 0 && (
              <>
                <div className="unified-stat">
                  <span className="unified-stat-label">Running Count:</span>
                  <span className="unified-stat-value">{runningCount >= 0 ? '+' : ''}{runningCount}</span>
                </div>
                {settings.deckCount > 1 && (
                  <div className="unified-stat">
                    <span className="unified-stat-label">True Count:</span>
                    <span className="unified-stat-value">{getTrueCount() >= 0 ? '+' : ''}{getTrueCount()}</span>
                  </div>
                )}
              </>
            )}
          </>
        )}
        <div className="unified-stat">
          <span className="unified-stat-label">Cards Dealt:</span>
          <span className="unified-stat-value">{cardsDealt}/{settings.deckCount * 52}</span>
        </div>
        <div className="unified-stat">
          <span className="unified-stat-label">Decks Remaining:</span>
          <span className="unified-stat-value">{((settings.deckCount * 52 - cardsDealt) / 52).toFixed(1)}</span>
        </div>
      </div>

      <div className="unified-controls">
        {!gameStarted ? (
          <button className="unified-button unified-button-primary" onClick={startGame}>
            Start Practice
          </button>
        ) : (
          <>
            {!gameOver && !handComplete[activeHandIndex] && !countCheckNeeded && (
              <>
                <button className="unified-button unified-button-secondary" onClick={() => handleAction('hit')}>
                  Hit
                </button>
                <button className="unified-button unified-button-secondary" onClick={() => handleAction('stand')}>
                  Stand
                </button>
                {canDouble && (
                  <button className="unified-button unified-button-special" onClick={() => handleAction('double')}>
                    Double Down
                  </button>
                )}
                {canSplit && (
                  <button className="unified-button unified-button-special" onClick={() => handleAction('split')}>
                    Split
                  </button>
                )}
              </>
            )}
            {(gameOver || handComplete[activeHandIndex]) && !countCheckNeeded && (
              <button className="unified-button unified-button-primary" onClick={startGame}>
                New Hand
              </button>
            )}
          </>
        )}
      </div>

      {gameStarted && (
        <div className="unified-game" ref={gameAreaRef}>
          <div className="unified-hand">
            <div className="unified-hand-header">
              <h4>Dealer's Hand</h4>
              <span className="unified-hand-value">{dealerRevealing || gameOver ? dealerValue.display : '?'}</span>
            </div>
            <div className="unified-cards">
              {dealerHand.map((card, idx) => (
                idx === 1 && !dealerRevealing && !gameOver ? (
                  <div key="hidden" className="unified-card unified-card-hidden"></div>
                ) : renderCard(card, idx)
              ))}
            </div>
          </div>

          <div className="unified-player-hands">
            {playerHands.map((hand, handIdx) => (
              <div key={handIdx} className={`unified-hand ${handIdx === activeHandIndex && !handComplete[handIdx] ? 'active' : ''} ${handComplete[handIdx] ? 'complete' : ''}`}>
                <div className="unified-hand-header">
                  <h4>Your Hand {playerHands.length > 1 ? `(${handIdx + 1})` : ''} {handIdx === activeHandIndex && !handComplete[handIdx] && '▸'}</h4>
                  <span className="unified-hand-value">{calculateHandValue(hand).display}</span>
                </div>
                <div className="unified-cards">
                  {hand.map((card, cardIdx) => renderCard(card, cardIdx))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {feedback && !countCheckNeeded && (
        <div className={`unified-feedback ${feedback.startsWith('✓') ? 'correct' : 'incorrect'}`}>
          {feedback}
        </div>
      )}

      {countCheckNeeded && (
        <div className="unified-count-check">
          <h4>Running Count Check!</h4>
          <p>You've played {handsPlayed} hands. What is the current running count?</p>
          <div className="unified-count-input-group">
            <input
              type="number"
              className="unified-count-input"
              value={userCountInput}
              onChange={(e) => setUserCountInput(e.target.value)}
              placeholder="Enter count"
              autoFocus
            />
            <button className="unified-button unified-button-primary" onClick={checkCount}>
              Submit
            </button>
          </div>
        </div>
      )}

      {countFeedback && (
        <div className={`unified-count-feedback ${countFeedback.startsWith('✓') ? 'correct' : 'incorrect'}`}>
          {countFeedback}
        </div>
      )}
    </div>
  );
}
