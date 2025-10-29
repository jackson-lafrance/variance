import React, { useState, useRef } from 'react';
import './SplitDoubleSimulation.css';

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

export default function SplitDoubleSimulation() {
  const [playerHands, setPlayerHands] = useState<Card[][]>([]);
  const [activeHandIndex, setActiveHandIndex] = useState(0);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [gameStatus, setGameStatus] = useState<string[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [dealerRevealing, setDealerRevealing] = useState(false);
  const [canDoubleDown, setCanDoubleDown] = useState(false);
  const [canSplit, setCanSplit] = useState(false);
  const [handComplete, setHandComplete] = useState<boolean[]>([]);
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

  const drawSpecificCard = (rank: string): Card => {
    const randomSuit = suits[Math.floor(Math.random() * suits.length)];
    return {
      rank: rank,
      suit: randomSuit,
      code: `${rank}${randomSuit}`
    };
  };

  const checkForDealerBlackjack = (dealer: Card[]): boolean => {
    if (dealer.length !== 2) return false;
    const value = calculateHandValue(dealer).value;
    return value === 21;
  };

  const dealPracticeHand = async () => {
    const isSplitScenario = Math.random() > 0.5;

    if (isSplitScenario) {
      const pairRank = ranks[Math.floor(Math.random() * ranks.length)];
      const card1 = drawSpecificCard(pairRank);
      await new Promise(resolve => setTimeout(resolve, 300));
      setPlayerHands([[card1]]);

      const dealerCard1 = drawCard();
      await new Promise(resolve => setTimeout(resolve, 300));
      setDealerHand([dealerCard1]);

      const card2 = drawSpecificCard(pairRank);
      await new Promise(resolve => setTimeout(resolve, 300));
      setPlayerHands([[card1, card2]]);

      const dealerCard2 = drawCard();
      await new Promise(resolve => setTimeout(resolve, 300));
      const dealerCards = [dealerCard1, dealerCard2];
      setDealerHand(dealerCards);

      if (checkForDealerBlackjack(dealerCards)) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setDealerRevealing(true);
        setGameStatus(['Dealer Blackjack']);
        setHandComplete([true]);
        setCanSplit(false);
        setCanDoubleDown(false);
        setActiveHandIndex(0);
        
        await new Promise(resolve => setTimeout(resolve, 100));
        gameAreaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      } else {
        setCanSplit(true);
        setCanDoubleDown(true);
      }
    } else {
      const scenarios = [
        ['5', '4'], ['6', '3'], ['5', '5'],
        ['6', '4'], ['7', '3'], ['8', '2'], 
        ['6', '5'], ['7', '4'], ['8', '3'], ['9', '2'], 
        ['A', '2'], ['A', '3'], ['A', '4'], ['A', '5'], ['A', '6'], ['A', '7'] 
      ];
      
      const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
      const card1 = drawSpecificCard(scenario[0]);
      await new Promise(resolve => setTimeout(resolve, 300));
      setPlayerHands([[card1]]);

      const dealerCard1 = drawCard();
      await new Promise(resolve => setTimeout(resolve, 300));
      setDealerHand([dealerCard1]);

      const card2 = drawSpecificCard(scenario[1]);
      await new Promise(resolve => setTimeout(resolve, 300));
      setPlayerHands([[card1, card2]]);

      const dealerCard2 = drawCard();
      await new Promise(resolve => setTimeout(resolve, 300));
      const dealerCards = [dealerCard1, dealerCard2];
      setDealerHand(dealerCards);

      if (checkForDealerBlackjack(dealerCards)) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setDealerRevealing(true);
        setGameStatus(['Dealer Blackjack']);
        setHandComplete([true]);
        setCanSplit(false);
        setCanDoubleDown(false);
        setActiveHandIndex(0);
        
        await new Promise(resolve => setTimeout(resolve, 100));
        gameAreaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      } else {
        setCanSplit(false);
        setCanDoubleDown(true);
      }
    }

    setHandComplete([false]);
    setGameStatus(['']);
    setActiveHandIndex(0);

    await new Promise(resolve => setTimeout(resolve, 100));
    gameAreaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const startGame = async () => {
    setGameStarted(true);
    setGameStatus([]);
    setDealerRevealing(false);
    setPlayerHands([]);
    setDealerHand([]);
    
    await dealPracticeHand();
  };

  const hit = async () => {
    const newCard = drawCard();
    const updatedHands = [...playerHands];
    updatedHands[activeHandIndex] = [...updatedHands[activeHandIndex], newCard];
    setPlayerHands(updatedHands);

    await new Promise(resolve => setTimeout(resolve, 400));

    const currentHand = updatedHands[activeHandIndex];
    const handValue = calculateHandValue(currentHand).value;
    
    setCanDoubleDown(currentHand.length === 2);
    setCanSplit(currentHand.length === 2 && currentHand[0].rank === currentHand[1].rank);

    if (handValue > 21) {
      const updatedComplete = [...handComplete];
      updatedComplete[activeHandIndex] = true;
      setHandComplete(updatedComplete);
      
      const updatedStatus = [...gameStatus];
      updatedStatus[activeHandIndex] = 'Bust';
      setGameStatus(updatedStatus);

      setCanDoubleDown(false);
      setCanSplit(false);

      if (activeHandIndex < playerHands.length - 1) {
        setActiveHandIndex(activeHandIndex + 1);
        const nextHand = updatedHands[activeHandIndex + 1];
        setCanDoubleDown(nextHand.length === 2);
        setCanSplit(nextHand.length === 2 && nextHand[0].rank === nextHand[1].rank);
      } else {
        finishAllHands();
      }
    } else if (handValue === 21) {
      stand();
    }
  };

  const doubleDown = async () => {
    const newCard = drawCard();
    const updatedHands = [...playerHands];
    updatedHands[activeHandIndex] = [...updatedHands[activeHandIndex], newCard];
    setPlayerHands(updatedHands);
    setCanDoubleDown(false);
    setCanSplit(false);

    await new Promise(resolve => setTimeout(resolve, 400));

    const handValue = calculateHandValue(updatedHands[activeHandIndex]).value;
    const updatedComplete = [...handComplete];
    updatedComplete[activeHandIndex] = true;
    setHandComplete(updatedComplete);

    if (handValue > 21) {
      const updatedStatus = [...gameStatus];
      updatedStatus[activeHandIndex] = 'Bust (Doubled)';
      setGameStatus(updatedStatus);
    }

    if (activeHandIndex < playerHands.length - 1) {
      const nextIndex = activeHandIndex + 1;
      setActiveHandIndex(nextIndex);
      const nextHand = updatedHands[nextIndex];
      setCanDoubleDown(nextHand.length === 2);
      setCanSplit(nextHand.length === 2 && nextHand[0].rank === nextHand[1].rank);
    } else {
      finishAllHands();
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
    
    const newStatus = [
      ...gameStatus.slice(0, activeHandIndex),
      '',
      '',
      ...gameStatus.slice(activeHandIndex + 1)
    ];
    
    setPlayerHands(newHands);
    setHandComplete(newComplete);
    setGameStatus(newStatus);
    setCanSplit(false);
    setCanDoubleDown(false);

    await new Promise(resolve => setTimeout(resolve, 300));
    const card1 = drawCard();
    newHands[activeHandIndex].push(card1);
    setPlayerHands([...newHands]);

    const firstHand = newHands[activeHandIndex];
    setCanSplit(firstHand.length === 2 && firstHand[0].rank === firstHand[1].rank);
    setCanDoubleDown(firstHand.length === 2);

    await new Promise(resolve => setTimeout(resolve, 300));
    const card2 = drawCard();
    newHands[activeHandIndex + 1].push(card2);
    setPlayerHands([...newHands]);
  };

  const stand = async () => {
    const updatedComplete = [...handComplete];
    updatedComplete[activeHandIndex] = true;
    setHandComplete(updatedComplete);
    setCanDoubleDown(false);
    setCanSplit(false);

    if (activeHandIndex < playerHands.length - 1) {
      const nextIndex = activeHandIndex + 1;
      setActiveHandIndex(nextIndex);
      const nextHand = playerHands[nextIndex];
      setCanDoubleDown(nextHand.length === 2);
      setCanSplit(nextHand.length === 2 && nextHand[0].rank === nextHand[1].rank);
    } else {
      finishAllHands();
    }
  };

  const finishAllHands = async () => {
    setCanDoubleDown(false);
    setCanSplit(false);
    
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

    const finalStatuses = playerHands.map((hand, index) => {
      if (gameStatus[index] === 'Bust' || gameStatus[index] === 'Bust (Doubled)') {
        return gameStatus[index];
      }

      const playerValue = calculateHandValue(hand).value;

      if (dealerValue > 21) {
        return 'Win!';
      } else if (playerValue > dealerValue) {
        return 'Win!';
      } else if (playerValue < dealerValue) {
        return 'Lose';
      } else {
        return 'Push';
      }
    });

    setGameStatus(finalStatuses);
  };

  const newGame = async () => {
    setPlayerHands([]);
    setDealerHand([]);
    setGameStatus([]);
    setDealerRevealing(false);
    setHandComplete([]);
    setActiveHandIndex(0);
    
    await dealPracticeHand();
  };

  const renderCard = (card: Card, index: number) => (
    <div key={`${card.code}-${index}`} className="adv-bj-card" style={{ borderColor: suitColors[card.suit] }}>
      <div className="adv-bj-card-content" style={{ color: suitColors[card.suit] }}>
        <div className="adv-bj-card-rank">{card.rank}</div>
        <div className="adv-bj-card-suit">{suitNames[card.suit]}</div>
      </div>
    </div>
  );

  const dealerValue = calculateHandValue(dealerHand);

  return (
    <div className="advanced-blackjack-simulation">
      <div className="adv-bj-controls">
        {!gameStarted ? (
          <button className="adv-bj-button adv-bj-button-primary" onClick={startGame}>
            Deal Cards
          </button>
        ) : (
          <>
            {!handComplete.every(complete => complete) && activeHandIndex < playerHands.length && (
              <>
                <button className="adv-bj-button adv-bj-button-secondary" onClick={hit}>
                  Hit
                </button>
                <button className="adv-bj-button adv-bj-button-secondary" onClick={stand}>
                  Stand
                </button>
                {canDoubleDown && (
                  <button className="adv-bj-button adv-bj-button-special" onClick={doubleDown}>
                    Double Down
                  </button>
                )}
                {canSplit && (
                  <button className="adv-bj-button adv-bj-button-special" onClick={split}>
                    Split
                  </button>
                )}
              </>
            )}
            <button className="adv-bj-button adv-bj-button-outline" onClick={newGame}>
              New Hand
            </button>
          </>
        )}
      </div>

      {gameStarted && (
        <div className="adv-bj-game" ref={gameAreaRef}>
          <div className="adv-bj-hand">
            <div className="adv-bj-hand-header">
              <h4>Dealer's Hand</h4>
              <span className="adv-bj-hand-value">{dealerRevealing || handComplete.every(c => c) ? dealerValue.display : '?'}</span>
            </div>
            <div className="adv-bj-cards">
              {dealerHand.map((card, idx) => (
                idx === 1 && !dealerRevealing && !handComplete.every(c => c) ? (
                  <div key="hidden" className="adv-bj-card adv-bj-card-hidden"></div>
                ) : renderCard(card, idx)
              ))}
            </div>
          </div>

          <div className="adv-bj-player-hands">
            {playerHands.map((hand, handIdx) => {
              const handValue = calculateHandValue(hand);
              return (
                <div 
                  key={handIdx} 
                  className={`adv-bj-hand ${handIdx === activeHandIndex && !handComplete[handIdx] ? 'active' : ''} ${handComplete[handIdx] ? 'complete' : ''}`}
                >
                  <div className="adv-bj-hand-header">
                    <h4>
                      {playerHands.length > 1 ? `Hand ${handIdx + 1}` : 'Your Hand'}
                      {handIdx === activeHandIndex && !handComplete[handIdx] && ' ▸'}
                    </h4>
                    <span className="adv-bj-hand-value">{handValue.display}</span>
                  </div>
                  <div className="adv-bj-cards">
                    {hand.map((card, idx) => renderCard(card, idx))}
                  </div>
                  {gameStatus[handIdx] && (
                    <div className="adv-bj-hand-status">{gameStatus[handIdx]}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
