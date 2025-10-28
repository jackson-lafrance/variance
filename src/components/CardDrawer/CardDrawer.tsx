import React, { useState } from 'react';
import './CardDrawer.css';

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

export default function CardDrawer() {
  const [currentCard, setCurrentCard] = useState<string | null>(null);

  const drawCard = () => {
    const randomRank = ranks[Math.floor(Math.random() * ranks.length)];
    const randomSuit = suits[Math.floor(Math.random() * suits.length)];
    setCurrentCard(`${randomRank}${randomSuit}`);
  };

  const getCardDisplay = (card: string) => {
    if (!card) return null;
    const rank = card.slice(0, -1);
    const suit = card.slice(-1);
    return { rank, suit, symbol: suitNames[suit], color: suitColors[suit] };
  };

  const cardInfo = currentCard ? getCardDisplay(currentCard) : null;

  return (
    <div className="card-drawer">
      <button className="draw-button" onClick={drawCard}>
        Draw Card
      </button>
      
      {cardInfo && (
        <div className="card" style={{ borderColor: cardInfo.color }}>
          <div className="card-content" style={{ color: cardInfo.color }}>
            <div className="card-rank">{cardInfo.rank}</div>
            <div className="card-suit">{cardInfo.symbol}</div>
          </div>
          <div className="card-name">{currentCard}</div>
        </div>
      )}
    </div>
  );
}
