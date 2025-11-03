import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../services/AuthContext';
import { useDarkMode } from '../contexts/DarkModeContext';
import { getHiLoValue, calculateTrueCount, calculateDecksRemaining } from '../utils/cardCounting';
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

export default function BasicHiLoSimulation({ onBack }: { onBack?: () => void }) {
  const navigation = useNavigation();
  const { currentUser } = useAuth();
  const { isDark } = useDarkMode();
  const styles = getStyles(isDark);
  
  const [deckCount] = useState(6);
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
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);

  const drawCard = (): Card => {
    const totalCards = deckCount * 52;
    const penetrationLimit = Math.floor(totalCards * 0.75);
    
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
    if (!sessionStartTime) {
      setSessionStartTime(Date.now());
    }
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
      setCountFeedback(`✗ Incorrect. The running count is ${runningCount}, not ${userCount}`);
      setIncorrectCount(prev => prev + 1);
    }
    
    setUserCountInput('');
    setCountCheckNeeded(false);
  };

  const handleSaveSession = async () => {
    if (!currentUser) {
      Alert.alert('Error', 'Please sign in to save your session');
      return;
    }

    if (handsPlayed === 0) {
      Alert.alert('Error', 'Please play at least one hand before saving');
      return;
    }

    const duration = sessionStartTime ? (Date.now() - sessionStartTime) / 1000 : 0;
    const accuracy = correctCount + incorrectCount > 0 
      ? Math.round((correctCount / (correctCount + incorrectCount)) * 100) 
      : 0;

    try {
      await saveHighScore(
        currentUser.uid,
        SimulationTypes.COUNTING,
        correctCount * 100 - incorrectCount * 50,
        accuracy,
        correctCount,
        incorrectCount,
        handsPlayed
      );

      await savePracticeSession(
        currentUser.uid,
        SimulationTypes.COUNTING,
        {
          accuracy,
          correctCount,
          incorrectCount,
          handsPlayed,
          duration,
        }
      );

      Alert.alert('Success', 'Session saved successfully!');
    } catch (error) {
      console.error('Error saving session:', error);
      Alert.alert('Error', 'Failed to save session. Please try again.');
    }
  };

  const resetSimulation = () => {
    setPlayerHand([]);
    setDealerHand([]);
    setGameStatus('');
    setGameStarted(false);
    setDealerRevealing(false);
    setRunningCount(0);
    setCardsDealt(0);
    setHandsPlayed(0);
    setUserCountInput('');
    setCountCheckNeeded(false);
    setCountFeedback('');
    setCorrectCount(0);
    setIncorrectCount(0);
    setSessionStartTime(null);
    setShoe(createShoe(deckCount));
  };

  const playerValue = calculateHandValue(playerHand);
  const dealerValue = calculateHandValue(dealerHand);
  const trueCount = calculateTrueCount(runningCount, deckCount, cardsDealt);
  const decksRemaining = calculateDecksRemaining(deckCount, cardsDealt);
  const accuracy = correctCount + incorrectCount > 0 
    ? Math.round((correctCount / (correctCount + incorrectCount)) * 100) 
    : 0;

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
          <Text style={styles.screenTitle}>Card Counting Practice</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel} numberOfLines={1}>Running Count</Text>
            <Text style={[styles.statValue, runningCount >= 0 ? styles.positive : styles.negative]}>
              {runningCount > 0 ? '+' : ''}{runningCount}
            </Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel} numberOfLines={1}>True Count</Text>
            <Text style={[styles.statValue, trueCount >= 0 ? styles.positive : styles.negative]}>
              {trueCount > 0 ? '+' : ''}{trueCount.toFixed(1)}
            </Text>
          </View>
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

        {countCheckNeeded && (
          <View style={styles.countCheckContainer}>
            <Text style={styles.countCheckTitle}>What's the running count?</Text>
            <TextInput
              style={styles.countInput}
              value={userCountInput}
              onChangeText={setUserCountInput}
              keyboardType="numeric"
              placeholder="Enter count"
              placeholderTextColor={isDark ? '#666' : '#999'}
            />
            <TouchableOpacity style={styles.checkButton} onPress={checkCount}>
              <Text style={styles.checkButtonText}>Check</Text>
            </TouchableOpacity>
            {countFeedback !== '' && (
              <Text style={styles.countFeedback}>{countFeedback}</Text>
            )}
          </View>
        )}

        {!gameStarted ? (
          <TouchableOpacity style={styles.primaryButton} onPress={startGame}>
            <Text style={styles.primaryButtonText}>Deal Cards</Text>
          </TouchableOpacity>
        ) : (
          <>
            <View style={styles.gameArea}>
              <View style={styles.handContainer}>
                <Text style={styles.handLabel}>Dealer's Hand</Text>
                <Text style={styles.handValue}>
                  {dealerRevealing || gameStatus ? dealerValue.display : '?'}
                </Text>
                <View style={styles.cardsContainer}>
                  {dealerHand.map((card, idx) =>
                    idx === 1 && !dealerRevealing && !gameStatus ? (
                      <View key="hidden" style={[styles.card, styles.hiddenCard]} />
                    ) : (
                      renderCard(card, idx)
                    )
                  )}
                </View>
              </View>

              <View style={styles.handContainer}>
                <Text style={styles.handLabel}>Your Hand</Text>
                <Text style={styles.handValue}>{playerValue.display}</Text>
                <View style={styles.cardsContainer}>
                  {playerHand.map((card, idx) => renderCard(card, idx))}
                </View>
              </View>

              {gameStatus !== '' && (
                <View style={styles.statusContainer}>
                  <Text style={styles.statusText}>{gameStatus}</Text>
                </View>
              )}
            </View>

            {gameStatus === '' && (
              <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.actionButton} onPress={hit}>
                  <Text style={styles.actionButtonText}>Hit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => stand()}>
                  <Text style={styles.actionButtonText}>Stand</Text>
                </TouchableOpacity>
              </View>
            )}

            {gameStatus !== '' && (
              <TouchableOpacity style={styles.primaryButton} onPress={startGame}>
                <Text style={styles.primaryButtonText}>Deal Next Hand</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleSaveSession}>
            <Text style={styles.secondaryButtonText}>Save Session</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={resetSimulation}>
            <Text style={styles.secondaryButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>
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
    color: '#FF004D',
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
    minWidth: '30%',
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
  positive: {
    color: '#4caf50',
  },
  negative: {
    color: '#f44336',
  },
  correct: {
    color: '#4caf50',
  },
  incorrect: {
    color: '#f44336',
  },
  countCheckContainer: {
    backgroundColor: isDark ? '#2a2a2a' : '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#ff9800',
  },
  countCheckTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: isDark ? '#e0e0e0' : '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  countInput: {
    backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5',
    borderWidth: 1,
    borderColor: isDark ? '#444' : '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    color: isDark ? '#e0e0e0' : '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  checkButton: {
    backgroundColor: '#2196f3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  checkButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  countFeedback: {
    fontSize: 14,
    color: isDark ? '#b0b0b0' : '#666',
    textAlign: 'center',
    marginTop: 8,
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
    borderWidth: 2,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  hiddenCard: {
    backgroundColor: '#333',
    borderColor: '#333',
  },
  cardRank: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardSuit: {
    fontSize: 24,
  },
  statusContainer: {
    backgroundColor: isDark ? '#2a2a2a' : '#fff',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    color: isDark ? '#e0e0e0' : '#333',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#2196f3',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#4caf50',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: isDark ? '#2a2a2a' : '#fff',
    padding: 16,
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

