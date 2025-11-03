import React, { useState } from 'react';
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

  const isSoft = aces > 0 && value <= 21;

  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }

  return { value, display: value.toString(), isSoft };
};

export default function BlackjackSimulation({ onBack }: { onBack?: () => void }) {
  const navigation = useNavigation();
  const { currentUser } = useAuth();
  const { isDark } = useDarkMode();
  const styles = getStyles(isDark);
  
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [gameStatus, setGameStatus] = useState<string>('');
  const [gameStarted, setGameStarted] = useState(false);
  const [dealerRevealing, setDealerRevealing] = useState(false);
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
      setHandsPlayed(prev => prev + 1);
    } else if (playerValue === 21) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setGameStatus('Blackjack!');
      setHandsPlayed(prev => prev + 1);
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
      setHandsPlayed(prev => prev + 1);
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
    if (!currentUser) {
      Alert.alert('Error', 'Please sign in to save your session');
      return;
    }

    if (handsPlayed === 0) {
      Alert.alert('Error', 'Please play at least one hand before saving');
      return;
    }

    const duration = sessionStartTime ? (Date.now() - sessionStartTime) / 1000 : 0;

    try {
      await saveHighScore(
        currentUser.uid,
        SimulationTypes.UNIFIED,
        handsPlayed * 100,
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

      Alert.alert('Success', 'Session saved successfully!');
    } catch (error) {
      console.error('Error saving session:', error);
      Alert.alert('Error', 'Failed to save session. Please try again.');
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
      setHandsPlayed(prev => prev + 1);
    } else if (playerValue === 21) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setGameStatus('Blackjack!');
      setHandsPlayed(prev => prev + 1);
    }
  };

  const renderCard = (card: Card, index: number) => (
    <View key={`${card.code}-${index}`} style={[styles.card, { borderColor: suitColors[card.suit] }]}>
      <Text style={[styles.cardRank, { color: suitColors[card.suit] }]}>{card.rank}</Text>
      <Text style={[styles.cardSuit, { color: suitColors[card.suit] }]}>{suitNames[card.suit]}</Text>
    </View>
  );

  const playerValue = calculateHandValue(playerHand);
  const dealerValue = calculateHandValue(dealerHand);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => onBack ? onBack() : navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Blackjack Game</Text>
        </View>

        <View style={styles.statsContainer}>
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
              <TouchableOpacity style={styles.primaryButton} onPress={newGame}>
                <Text style={styles.primaryButtonText}>Deal Next Hand</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleSaveSession}>
            <Text style={styles.secondaryButtonText}>Save Session</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleReset}>
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
    color: '#2563EB',
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
    minWidth: '22%',
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
    backgroundColor: '#2563EB',
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
    borderColor: '#2563EB',
  },
  secondaryButtonText: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '600',
  },
});

