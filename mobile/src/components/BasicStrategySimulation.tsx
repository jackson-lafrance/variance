import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../services/AuthContext';
import { useDarkMode } from '../contexts/DarkModeContext';
import { saveHighScore, SimulationTypes } from '../utils/highScores';
import { savePracticeSession } from '../utils/practiceSessions';

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

  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
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
    if (['10', 'J', 'Q', 'K'].includes(pairRank)) return 'stand';
    if (pairRank === '5') {
      if (dealerValue <= 9 && canDouble) return 'double';
      return 'hit';
    }
    if (pairRank === '4') return 'hit';
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

export default function BasicStrategySimulation({ onBack }: { onBack?: () => void }) {
  const navigation = useNavigation();
  const { currentUser } = useAuth();
  const { isDark } = useDarkMode();
  const styles = getStyles(isDark);
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
    return calculateHandValue(dealer).value === 21;
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

  const handleSaveSession = async () => {
    if (!currentUser || (correctCount + incorrectCount === 0)) return;
    
    const accuracy = Math.round((correctCount / (correctCount + incorrectCount)) * 100);
    const duration = sessionStartTime ? Math.floor((Date.now() - sessionStartTime) / 1000) : undefined;
    const score = correctCount * 100 - incorrectCount * 50;

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

      Alert.alert('Success', 'Session saved successfully!');
    } catch (error) {
      console.error('Error saving session:', error);
      Alert.alert('Error', 'Failed to save session. Please try again.');
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

  const dealerValue = calculateHandValue(dealerHand);
  const currentHand = playerHands[activeHandIndex] || [];
  const canDouble = currentHand.length === 2 && !gameOver && !handComplete[activeHandIndex];
  const canSplit = currentHand.length === 2 && currentHand[0]?.rank === currentHand[1]?.rank && !gameOver && !handComplete[activeHandIndex];

  const renderCard = (card: Card, index: number) => (
    <View key={`${card.code}-${index}`} style={[styles.card, { borderColor: suitColors[card.suit] }]}>
      <Text style={[styles.cardRank, { color: suitColors[card.suit] }]}>{card.rank}</Text>
      <Text style={[styles.cardSuit, { color: suitColors[card.suit] }]}>{suitNames[card.suit]}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => onBack ? onBack() : navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Basic Strategy Practice</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel} numberOfLines={1}>Correct</Text>
            <Text style={[styles.statValue, styles.correct]}>{correctCount}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel} numberOfLines={1}>Incorrect</Text>
            <Text style={[styles.statValue, styles.incorrect]}>{incorrectCount}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel} numberOfLines={1}>Accuracy</Text>
            <Text style={styles.statValue}>{accuracy}%</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel} numberOfLines={1}>Hands</Text>
            <Text style={styles.statValue}>{handsPlayed}</Text>
          </View>
        </View>

        {!gameStarted ? (
          <TouchableOpacity style={styles.primaryButton} onPress={startGame}>
            <Text style={styles.primaryButtonText}>Deal Cards</Text>
          </TouchableOpacity>
        ) : (
          <>
            {gameStarted && (
              <View style={styles.gameArea}>
                <View style={styles.handContainer}>
                  <Text style={styles.handLabel}>Dealer's Hand</Text>
                  <Text style={styles.handValue}>{dealerRevealing || gameOver ? dealerValue.display : '?'}</Text>
                  <View style={styles.cardsContainer}>
                    {dealerHand.map((card, idx) =>
                      idx === 1 && !dealerRevealing && !gameOver ? (
                        <View key="hidden" style={[styles.card, styles.hiddenCard]} />
                      ) : (
                        renderCard(card, idx)
                      )
                    )}
                  </View>
                </View>

                <View style={styles.playerHands}>
                  {playerHands.map((hand, handIdx) => (
                    <View key={handIdx} style={[
                      styles.handContainer,
                      handIdx === activeHandIndex && !handComplete[handIdx] && styles.activeHand
                    ]}>
                      <Text style={styles.handLabel}>
                        Your Hand{playerHands.length > 1 ? ` (${handIdx + 1})` : ''}
                      </Text>
                      <Text style={styles.handValue}>{calculateHandValue(hand).display}</Text>
                      <View style={styles.cardsContainer}>
                        {hand.map((card, cardIdx) => renderCard(card, cardIdx))}
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {feedback ? (
              <View style={[styles.feedbackContainer, feedback.startsWith('✓') ? styles.correctFeedback : styles.incorrectFeedback]}>
                <Text style={styles.feedbackText}>{feedback}</Text>
              </View>
            ) : null}

            <View style={styles.controlsContainer}>
              {!gameOver && !handComplete[activeHandIndex] && (
                <>
                  <TouchableOpacity style={styles.actionButton} onPress={() => handleAction('hit')}>
                    <Text style={styles.actionButtonText}>Hit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton} onPress={() => handleAction('stand')}>
                    <Text style={styles.actionButtonText}>Stand</Text>
                  </TouchableOpacity>
                  {canDouble && (
                    <TouchableOpacity style={styles.actionButton} onPress={() => handleAction('double')}>
                      <Text style={styles.actionButtonText}>Double</Text>
                    </TouchableOpacity>
                  )}
                  {canSplit && (
                    <TouchableOpacity style={styles.actionButton} onPress={() => handleAction('split')}>
                      <Text style={styles.actionButtonText}>Split</Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
              <TouchableOpacity style={styles.secondaryButton} onPress={startGame}>
                <Text style={styles.secondaryButtonText}>New Hand</Text>
              </TouchableOpacity>
              {(correctCount + incorrectCount > 0) && (
                <>
                  <TouchableOpacity style={styles.secondaryButton} onPress={handleSaveSession}>
                    <Text style={styles.secondaryButtonText}>Save Session</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.secondaryButton} onPress={handleReset}>
                    <Text style={styles.secondaryButtonText}>Reset Stats</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#2196f3',
    fontWeight: '600',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: isDark ? '#e0e0e0' : '#333',
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statBox: {
    backgroundColor: isDark ? '#2a2a2a' : '#fff',
    padding: 16,
    borderRadius: 12,
    flex: 1,
    minWidth: '23%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: isDark ? '#444' : '#e0e0e0',
  },
  statLabel: {
    fontSize: 10,
    color: isDark ? '#b0b0b0' : '#666',
    marginBottom: 4,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: isDark ? '#e0e0e0' : '#333',
  },
  correct: {
    color: '#4caf50',
  },
  incorrect: {
    color: '#f44336',
  },
  gameArea: {
    marginBottom: 20,
  },
  handContainer: {
    backgroundColor: isDark ? '#2a2a2a' : '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: isDark ? '#444' : '#e0e0e0',
  },
  activeHand: {
    borderColor: '#2196f3',
    backgroundColor: isDark ? '#1e3a5f' : '#e3f2fd',
  },
  handLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#e0e0e0' : '#333',
    marginBottom: 8,
  },
  handValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: isDark ? '#64b5f6' : '#333',
    marginBottom: 12,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  card: {
    width: 60,
    height: 84,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  hiddenCard: {
    backgroundColor: '#1976d2',
    borderColor: '#1976d2',
  },
  cardRank: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardSuit: {
    fontSize: 24,
  },
  playerHands: {
    gap: 12,
  },
  feedbackContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  correctFeedback: {
    backgroundColor: isDark ? '#1b5e20' : '#c8e6c9',
  },
  incorrectFeedback: {
    backgroundColor: isDark ? '#b71c1c' : '#ffcdd2',
  },
  feedbackText: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#e0e0e0' : '#333',
    textAlign: 'center',
  },
  controlsContainer: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#2196f3',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  actionButton: {
    backgroundColor: '#4caf50',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: isDark ? '#2a2a2a' : '#fff',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2196f3',
  },
  secondaryButtonText: {
    color: '#2196f3',
    fontSize: 16,
    fontWeight: '600',
  },
});

