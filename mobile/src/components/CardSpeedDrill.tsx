import React, { useState, useEffect, useRef } from 'react';
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
import { getHiLoValue } from '../utils/cardCounting';
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
}

export default function CardSpeedDrill({ onBack }: { onBack?: () => void }) {
  const navigation = useNavigation();
  const { currentUser } = useAuth();
  const { isDark } = useDarkMode();
  const styles = getStyles(isDark);
  
  const [isActive, setIsActive] = useState(false);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [runningCount, setRunningCount] = useState(0);
  const [cardsShown, setCardsShown] = useState(0);
  const [speed, setSpeed] = useState(1000);
  const [userGuess, setUserGuess] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctGuesses, setCorrectGuesses] = useState(0);
  const [totalGuesses, setTotalGuesses] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const drawRandomCard = () => {
    const randomRank = ranks[Math.floor(Math.random() * ranks.length)];
    const randomSuit = suits[Math.floor(Math.random() * suits.length)];
    return { rank: randomRank, suit: randomSuit };
  };

  const showNextCard = () => {
    const newCard = drawRandomCard();
    setCurrentCard(newCard);
    const cardValue = getHiLoValue(newCard.rank);
    setRunningCount(prev => prev + cardValue);
    setCardsShown(prev => prev + 1);
  };

  const startDrill = () => {
    if (!sessionStartTime) {
      setSessionStartTime(Date.now());
    }
    setIsActive(true);
    setCurrentCard(null);
    setRunningCount(0);
    setCardsShown(0);
    setUserGuess('');
    setIsCorrect(null);
    setCorrectGuesses(0);
    setTotalGuesses(0);
    
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    intervalRef.current = setInterval(() => {
      showNextCard();
    }, speed);
  };

  const stopDrill = () => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleSaveSession = async () => {
    if (!currentUser) {
      Alert.alert('Error', 'Please sign in to save your session');
      return;
    }

    if (totalGuesses === 0) {
      Alert.alert('Error', 'Please make at least one guess before saving');
      return;
    }

    const duration = sessionStartTime ? Math.floor((Date.now() - sessionStartTime) / 1000) : undefined;
    const accuracy = Math.round((correctGuesses / totalGuesses) * 100);
    const score = correctGuesses * 100 - (totalGuesses - correctGuesses) * 50;

    try {
      await saveHighScore(
        currentUser.uid,
        SimulationTypes.CARD_SPEED,
        score,
        accuracy,
        correctGuesses,
        totalGuesses - correctGuesses,
        cardsShown
      );

      await savePracticeSession(
        currentUser.uid,
        SimulationTypes.CARD_SPEED,
        accuracy,
        correctGuesses,
        totalGuesses - correctGuesses,
        cardsShown,
        duration
      );

      Alert.alert('Success', 'Session saved successfully!');
    } catch (error) {
      console.error('Error saving session:', error);
      Alert.alert('Error', 'Failed to save session. Please try again.');
    }
  };

  const handleReset = () => {
    setCorrectGuesses(0);
    setTotalGuesses(0);
    setCardsShown(0);
    setRunningCount(0);
    setSessionStartTime(null);
    setCurrentCard(null);
    setIsCorrect(null);
    setUserGuess('');
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const checkGuess = () => {
    if (userGuess === '') return;
    
    const guess = parseInt(userGuess);
    const correct = guess === runningCount;
    
    setIsCorrect(correct);
    setTotalGuesses(prev => prev + 1);
    
    if (correct) {
      setCorrectGuesses(prev => prev + 1);
    }
    
    setTimeout(() => {
      setUserGuess('');
      setIsCorrect(null);
    }, 1000);
  };

  useEffect(() => {
    if (isActive) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        showNextCard();
      }, speed);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [speed, isActive]);

  const accuracy = totalGuesses > 0 ? Math.round((correctGuesses / totalGuesses) * 100) : 100;

  const renderCard = (card: Card) => (
    <View style={[styles.card, { borderColor: suitColors[card.suit] }]}>
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
          <Text style={styles.screenTitle}>Card Speed Drill</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel} numberOfLines={1}>Cards</Text>
            <Text style={styles.statValue}>{cardsShown}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel} numberOfLines={1}>Count</Text>
            <Text style={[styles.statValue, runningCount >= 0 ? styles.positive : styles.negative]}>
              {runningCount > 0 ? '+' : ''}{runningCount}
            </Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel} numberOfLines={1}>Accuracy</Text>
            <Text style={[styles.statValue, accuracy >= 90 ? styles.good : accuracy >= 70 ? styles.ok : styles.poor]}>
              {accuracy}%
            </Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel} numberOfLines={1}>Correct</Text>
            <Text style={styles.statValue}>{correctGuesses}/{totalGuesses}</Text>
          </View>
        </View>

        {!isActive ? (
          <View style={styles.setupContainer}>
            <Text style={styles.setupTitle}>Speed Settings</Text>
            <View style={styles.speedOptions}>
              <TouchableOpacity
                style={[styles.speedOption, speed === 2000 && styles.speedOptionActive]}
                onPress={() => setSpeed(2000)}
              >
                <Text style={[styles.speedOptionText, speed === 2000 && styles.speedOptionTextActive]}>
                  0.5x (Slow)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.speedOption, speed === 1000 && styles.speedOptionActive]}
                onPress={() => setSpeed(1000)}
              >
                <Text style={[styles.speedOptionText, speed === 1000 && styles.speedOptionTextActive]}>
                  1x (Normal)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.speedOption, speed === 500 && styles.speedOptionActive]}
                onPress={() => setSpeed(500)}
              >
                <Text style={[styles.speedOptionText, speed === 500 && styles.speedOptionTextActive]}>
                  2x (Fast)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.speedOption, speed === 250 && styles.speedOptionActive]}
                onPress={() => setSpeed(250)}
              >
                <Text style={[styles.speedOptionText, speed === 250 && styles.speedOptionTextActive]}>
                  4x (Very Fast)
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.primaryButton} onPress={startDrill}>
              <Text style={styles.primaryButtonText}>Start Speed Drill</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.cardDisplay}>
              {currentCard && renderCard(currentCard)}
            </View>

            <View style={styles.guessContainer}>
              <TextInput
                style={styles.guessInput}
                value={userGuess}
                onChangeText={setUserGuess}
                keyboardType="numeric"
                placeholder="Enter running count"
                placeholderTextColor={isDark ? '#666' : '#999'}
                editable={isActive}
              />
              <TouchableOpacity style={styles.checkButton} onPress={checkGuess} disabled={!isActive || userGuess === ''}>
                <Text style={styles.checkButtonText}>Check</Text>
              </TouchableOpacity>
              {isCorrect !== null && (
                <Text style={[styles.feedback, isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect]}>
                  {isCorrect ? '✓ Correct!' : `✗ Wrong! Count is ${runningCount}`}
                </Text>
              )}
            </View>

            <TouchableOpacity style={styles.stopButton} onPress={stopDrill}>
              <Text style={styles.stopButtonText}>Stop Drill</Text>
            </TouchableOpacity>
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
  positive: {
    color: '#4caf50',
  },
  negative: {
    color: '#f44336',
  },
  good: {
    color: '#4caf50',
  },
  ok: {
    color: '#ff9800',
  },
  poor: {
    color: '#f44336',
  },
  setupContainer: {
    backgroundColor: isDark ? '#2a2a2a' : '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  setupTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: isDark ? '#e0e0e0' : '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  speedOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  speedOption: {
    flex: 1,
    minWidth: '45%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: isDark ? '#444' : '#ddd',
    backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5',
    alignItems: 'center',
  },
  speedOptionActive: {
    borderColor: '#2563EB',
    backgroundColor: '#2563EB',
  },
  speedOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: isDark ? '#b0b0b0' : '#666',
  },
  speedOptionTextActive: {
    color: '#fff',
  },
  cardDisplay: {
    alignItems: 'center',
    marginVertical: 40,
    minHeight: 120,
    justifyContent: 'center',
  },
  card: {
    width: 120,
    height: 168,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  cardRank: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardSuit: {
    fontSize: 48,
  },
  guessContainer: {
    backgroundColor: isDark ? '#2a2a2a' : '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  guessInput: {
    backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5',
    borderWidth: 1,
    borderColor: isDark ? '#444' : '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 24,
    color: isDark ? '#e0e0e0' : '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  checkButton: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  checkButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  feedback: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '600',
  },
  feedbackCorrect: {
    color: '#4caf50',
  },
  feedbackIncorrect: {
    color: '#f44336',
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
  stopButton: {
    backgroundColor: '#f44336',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  stopButtonText: {
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

