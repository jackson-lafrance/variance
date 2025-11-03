import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { calculateTrueCount, calculateDecksRemaining } from '../utils/cardCounting';

export default function StartCardCounting() {
  const [deckCount, setDeckCount] = useState(1);
  const [runningCount, setRunningCount] = useState(0);
  const [cardsDealt, setCardsDealt] = useState(0);
  const [cardsHistory, setCardsHistory] = useState<{ value: number; count: number }[]>([]);

  const decksRemaining = calculateDecksRemaining(deckCount, cardsDealt);
  const trueCount = calculateTrueCount(runningCount, deckCount, cardsDealt);

  const handleCardAdd = (hiLoValue: number) => {
    const newCount = runningCount + hiLoValue;
    setRunningCount(newCount);
    setCardsDealt(prev => prev + 1);
    setCardsHistory(prev => [...prev, { value: hiLoValue, count: newCount }]);
  };

  const handleReset = () => {
    setRunningCount(0);
    setCardsDealt(0);
    setCardsHistory([]);
  };

  const handleResetShoe = () => {
    setRunningCount(0);
    setCardsDealt(0);
    setCardsHistory([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Start Card Counting</Text>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Number of Decks:</Text>
            <View style={styles.valueContainer}>
              <TouchableOpacity
                style={styles.valueButton}
                onPress={() => {
                  if (deckCount > 1) {
                    setDeckCount(deckCount - 1);
                    handleResetShoe();
                  }
                }}
                disabled={deckCount <= 1}
              >
                <Text style={[styles.valueButtonText, deckCount <= 1 && styles.valueButtonTextDisabled]}>-</Text>
              </TouchableOpacity>
              <View style={styles.valueDisplay}>
                <Text style={styles.valueText}>{deckCount}{deckCount === 1 ? ' Deck' : ' Decks'}</Text>
              </View>
              <TouchableOpacity
                style={styles.valueButton}
                onPress={() => {
                  if (deckCount < 8) {
                    setDeckCount(deckCount + 1);
                    handleResetShoe();
                  }
                }}
                disabled={deckCount >= 8}
              >
                <Text style={[styles.valueButtonText, deckCount >= 8 && styles.valueButtonTextDisabled]}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Running Count</Text>
            <Text style={[styles.statValue, runningCount >= 0 ? styles.positive : styles.negative]}>
              {runningCount > 0 ? '+' : ''}{runningCount}
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>True Count</Text>
            <Text style={[styles.statValue, trueCount >= 0 ? styles.positive : styles.negative]}>
              {trueCount > 0 ? '+' : ''}{trueCount.toFixed(1)}
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Cards Dealt</Text>
            <Text style={styles.statValue}>{cardsDealt}</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Decks Remaining</Text>
            <Text style={styles.statValue}>{decksRemaining.toFixed(1)}</Text>
          </View>
        </View>

        <View style={styles.buttonsSection}>
          <Text style={styles.sectionTitle}>Add Card</Text>
          
          <TouchableOpacity
            style={[styles.cardButton, styles.lowCardButton]}
            onPress={() => handleCardAdd(1)}
          >
            <Text style={styles.buttonText}>+</Text>
            <Text style={styles.buttonSubtext}>Low Card (+1)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.cardButton, styles.neutralCardButton]}
            onPress={() => handleCardAdd(0)}
          >
            <Text style={styles.buttonText}>=</Text>
            <Text style={styles.buttonSubtext}>Neutral Card (0)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.cardButton, styles.highCardButton]}
            onPress={() => handleCardAdd(-1)}
          >
            <Text style={styles.buttonText}>-</Text>
            <Text style={styles.buttonSubtext}>High Card (-1)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleReset}
          >
            <Text style={styles.resetButtonText}>Reset Count</Text>
          </TouchableOpacity>
        </View>

        {cardsHistory.length > 0 && (
          <View style={styles.historySection}>
            <Text style={styles.sectionTitle}>Recent Cards</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.historyRow}>
                {cardsHistory.slice(-20).reverse().map((item, index) => (
                  <View key={index} style={styles.historyItem}>
                    <Text style={styles.historyValue}>
                      {item.value > 0 ? '+' : ''}{item.value}
                    </Text>
                    <Text style={styles.historyCount}>{item.count}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2EFFF',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  settingsSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 77, 0.15)',
  },
  settingRow: {
    marginBottom: 24,
    zIndex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7A7A7A',
    marginBottom: 8,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  valueButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#FF004D',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF004D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  valueButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  valueButtonTextDisabled: {
    color: '#ccc',
  },
  valueDisplay: {
    flex: 1,
    height: 50,
    borderWidth: 2,
    borderColor: '#FF004D',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 120,
  },
  valueText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  statsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 24,
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 77, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  statLabel: {
    fontSize: 14,
    color: '#7A7A7A',
    marginBottom: 8,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  positive: {
    color: '#4caf50',
  },
  negative: {
    color: '#FF004D',
  },
  buttonsSection: {
    marginBottom: 20,
  },
  cardButton: {
    height: 120,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  lowCardButton: {
    backgroundColor: '#4caf50',
  },
  neutralCardButton: {
    backgroundColor: '#A48BFF',
  },
  highCardButton: {
    backgroundColor: '#FF004D',
  },
  buttonText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#fff',
  },
  buttonSubtext: {
    fontSize: 16,
    color: '#fff',
    marginTop: 8,
    fontWeight: '500',
  },
  resetButton: {
    backgroundColor: '#FF004D',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#FF004D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  historySection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 77, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  historyRow: {
    flexDirection: 'row',
    gap: 8,
  },
  historyItem: {
    backgroundColor: '#F2EFFF',
    padding: 12,
    borderRadius: 12,
    minWidth: 60,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(164, 139, 255, 0.3)',
  },
  historyValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  historyCount: {
    fontSize: 12,
    color: '#7A7A7A',
    marginTop: 4,
  },
});

