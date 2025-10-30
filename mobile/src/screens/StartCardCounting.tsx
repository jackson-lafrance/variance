import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getHiLoValue, calculateTrueCount, calculateDecksRemaining } from '../utils/cardCounting';

export default function StartCardCounting() {
  const [deckCount, setDeckCount] = useState(6);
  const [penetration, setPenetration] = useState(75);
  const [runningCount, setRunningCount] = useState(0);
  const [cardsDealt, setCardsDealt] = useState(0);
  const [cardsHistory, setCardsHistory] = useState<{ value: number; count: number }[]>([]);

  const totalCards = deckCount * 52;
  const penetrationLimit = Math.floor(totalCards * (penetration / 100));
  const cardsRemaining = totalCards - cardsDealt;
  const decksRemaining = calculateDecksRemaining(deckCount, cardsDealt);
  const trueCount = calculateTrueCount(runningCount, deckCount, cardsDealt);

  const handleCardAdd = (hiLoValue: number) => {
    if (cardsDealt >= penetrationLimit) {
      // Reset when penetration limit reached
      setCardsDealt(0);
      setRunningCount(0);
      setCardsHistory([]);
      return;
    }

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

  const getCardValueLabel = (value: number): string => {
    if (value === 1) return 'Low Card (+1)';
    if (value === 0) return 'Neutral Card (0)';
    return 'High Card (-1)';
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
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={deckCount}
                onValueChange={(itemValue) => {
                  setDeckCount(itemValue);
                  handleResetShoe();
                }}
                style={styles.picker}
              >
                <Picker.Item label="1 Deck" value={1} />
                <Picker.Item label="2 Decks" value={2} />
                <Picker.Item label="4 Decks" value={4} />
                <Picker.Item label="6 Decks" value={6} />
                <Picker.Item label="8 Decks" value={8} />
              </Picker>
            </View>
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Penetration:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={penetration}
                onValueChange={(itemValue) => {
                  setPenetration(itemValue);
                  handleResetShoe();
                }}
                style={styles.picker}
              >
                <Picker.Item label="50%" value={50} />
                <Picker.Item label="60%" value={60} />
                <Picker.Item label="70%" value={70} />
                <Picker.Item label="75%" value={75} />
                <Picker.Item label="80%" value={80} />
                <Picker.Item label="85%" value={85} />
                <Picker.Item label="90%" value={90} />
              </Picker>
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
            <Text style={styles.statValue}>{cardsDealt} / {penetrationLimit}</Text>
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
            disabled={cardsDealt >= penetrationLimit}
          >
            <Text style={styles.buttonText}>+</Text>
            <Text style={styles.buttonSubtext}>Low Card (+1)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.cardButton, styles.neutralCardButton]}
            onPress={() => handleCardAdd(0)}
            disabled={cardsDealt >= penetrationLimit}
          >
            <Text style={styles.buttonText}>=</Text>
            <Text style={styles.buttonSubtext}>Neutral Card (0)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.cardButton, styles.highCardButton]}
            onPress={() => handleCardAdd(-1)}
            disabled={cardsDealt >= penetrationLimit}
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

          <TouchableOpacity
            style={styles.resetShoeButton}
            onPress={handleResetShoe}
          >
            <Text style={styles.resetButtonText}>Reset Shoe</Text>
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
    backgroundColor: '#f5f5f5',
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
    color: '#333',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  settingsSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  settingRow: {
    marginBottom: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  statsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  positive: {
    color: '#4caf50',
  },
  negative: {
    color: '#f44336',
  },
  buttonsSection: {
    marginBottom: 20,
  },
  cardButton: {
    height: 120,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  lowCardButton: {
    backgroundColor: '#4caf50',
  },
  neutralCardButton: {
    backgroundColor: '#ff9800',
  },
  highCardButton: {
    backgroundColor: '#f44336',
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
    backgroundColor: '#2196f3',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  resetShoeButton: {
    backgroundColor: '#757575',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  historySection: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
  },
  historyRow: {
    flexDirection: 'row',
    gap: 8,
  },
  historyItem: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  historyValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  historyCount: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});

