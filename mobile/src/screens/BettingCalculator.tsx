import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDarkMode } from '../contexts/DarkModeContext';
import { calculateKellyCriterion, calculateBetFromTrueCount, BettingResult } from '../utils/bettingCalculator';

export default function BettingCalculator() {
  const navigation = useNavigation();
  const { isDark } = useDarkMode();
  const styles = getStyles(isDark);
  
  const [bankroll, setBankroll] = useState('10000');
  const [edge, setEdge] = useState('1');
  const [winProb, setWinProb] = useState('50');
  const [kellyFraction, setKellyFraction] = useState(0.5);
  const [trueCount, setTrueCount] = useState('0');
  const [baseUnit, setBaseUnit] = useState('10');
  const [maxBet, setMaxBet] = useState('1000');
  const [mode, setMode] = useState<'kelly' | 'truecount'>('kelly');

  const kellyResult: BettingResult | null = (() => {
    try {
      const bankrollVal = parseFloat(bankroll);
      const edgeVal = parseFloat(edge) / 100;
      const winProbVal = parseFloat(winProb) / 100;
      
      if (bankrollVal <= 0 || edgeVal < 0 || winProbVal < 0 || winProbVal > 1) {
        return null;
      }
      
      return calculateKellyCriterion(bankrollVal, edgeVal, winProbVal, kellyFraction);
    } catch {
      return null;
    }
  })();

  const trueCountResult: number | null = (() => {
    try {
      const bankrollVal = parseFloat(bankroll);
      const trueCountVal = parseFloat(trueCount);
      const baseUnitVal = parseFloat(baseUnit);
      const maxBetVal = parseFloat(maxBet);
      
      if (bankrollVal <= 0 || baseUnitVal <= 0 || maxBetVal <= 0) {
        return null;
      }
      
      return calculateBetFromTrueCount(bankrollVal, trueCountVal, baseUnitVal, maxBetVal, kellyFraction);
    } catch {
      return null;
    }
  })();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Betting Calculator</Text>
        </View>

        <View style={styles.modeSelector}>
          <TouchableOpacity
            style={[styles.modeButton, mode === 'kelly' && styles.modeButtonActive]}
            onPress={() => setMode('kelly')}
          >
            <Text style={[styles.modeButtonText, mode === 'kelly' && styles.modeButtonTextActive]}>
              Kelly Criterion
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, mode === 'truecount' && styles.modeButtonActive]}
            onPress={() => setMode('truecount')}
          >
            <Text style={[styles.modeButtonText, mode === 'truecount' && styles.modeButtonTextActive]}>
              True Count Based
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Bankroll ($)</Text>
            <TextInput
              style={styles.input}
              value={bankroll}
              onChangeText={setBankroll}
              keyboardType="numeric"
              placeholder="10000"
              placeholderTextColor={isDark ? '#666' : '#999'}
            />
          </View>

          {mode === 'kelly' && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Player Edge (%)</Text>
                <TextInput
                  style={styles.input}
                  value={edge}
                  onChangeText={setEdge}
                  keyboardType="numeric"
                  placeholder="1"
                  placeholderTextColor={isDark ? '#666' : '#999'}
                />
                <Text style={styles.inputHint}>Your advantage over the house</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Win Probability (%)</Text>
                <TextInput
                  style={styles.input}
                  value={winProb}
                  onChangeText={setWinProb}
                  keyboardType="numeric"
                  placeholder="50"
                  placeholderTextColor={isDark ? '#666' : '#999'}
                />
                <Text style={styles.inputHint}>Probability of winning this bet</Text>
              </View>
            </>
          )}

          {mode === 'truecount' && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>True Count</Text>
                <TextInput
                  style={styles.input}
                  value={trueCount}
                  onChangeText={setTrueCount}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={isDark ? '#666' : '#999'}
                />
                <Text style={styles.inputHint}>Current true count</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Base Unit ($)</Text>
                <TextInput
                  style={styles.input}
                  value={baseUnit}
                  onChangeText={setBaseUnit}
                  keyboardType="numeric"
                  placeholder="10"
                  placeholderTextColor={isDark ? '#666' : '#999'}
                />
                <Text style={styles.inputHint}>Minimum bet size</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Maximum Bet ($)</Text>
                <TextInput
                  style={styles.input}
                  value={maxBet}
                  onChangeText={setMaxBet}
                  keyboardType="numeric"
                  placeholder="1000"
                  placeholderTextColor={isDark ? '#666' : '#999'}
                />
                <Text style={styles.inputHint}>Maximum bet allowed</Text>
              </View>
            </>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Kelly Fraction</Text>
            <View style={styles.kellyButtons}>
              {[0.25, 0.5, 0.75, 1.0].map((fraction) => (
                <TouchableOpacity
                  key={fraction}
                  style={[
                    styles.kellyButton,
                    kellyFraction === fraction && styles.kellyButtonActive,
                  ]}
                  onPress={() => setKellyFraction(fraction)}
                >
                  <Text
                    style={[
                      styles.kellyButtonText,
                      kellyFraction === fraction && styles.kellyButtonTextActive,
                    ]}
                  >
                    {fraction === 0.25 ? '1/4' : fraction === 0.5 ? '1/2' : fraction === 0.75 ? '3/4' : 'Full'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.inputHint}>Fraction of Kelly to use (lower = safer)</Text>
          </View>
        </View>

        {mode === 'kelly' && kellyResult && (
          <View style={styles.resultsSection}>
            <Text style={styles.resultsTitle}>Recommended Bet Sizes</Text>
            <View style={styles.resultsGrid}>
              <View style={styles.resultCard}>
                <Text style={styles.resultLabel}>Kelly %</Text>
                <Text style={styles.resultValue}>{kellyResult.kellyPercent.toFixed(2)}%</Text>
              </View>
              <View style={styles.resultCard}>
                <Text style={styles.resultLabel}>Full Kelly</Text>
                <Text style={styles.resultValue}>${kellyResult.fullKellyBet.toFixed(2)}</Text>
              </View>
              <View style={styles.resultCard}>
                <Text style={styles.resultLabel}>Half Kelly</Text>
                <Text style={styles.resultValue}>${kellyResult.halfKellyBet.toFixed(2)}</Text>
              </View>
              <View style={styles.resultCard}>
                <Text style={styles.resultLabel}>Quarter Kelly</Text>
                <Text style={styles.resultValue}>${kellyResult.quarterKellyBet.toFixed(2)}</Text>
              </View>
              <View style={[styles.resultCard, styles.resultCardRecommended]}>
                <Text style={styles.resultLabel}>Recommended</Text>
                <Text style={styles.resultValue}>${kellyResult.recommendedBet.toFixed(2)}</Text>
                <Text style={styles.resultSubtext}>
                  ({kellyResult.bankrollPercent.toFixed(2)}% of bankroll)
                </Text>
              </View>
              <View style={styles.resultCard}>
                <Text style={styles.resultLabel}>After Bet</Text>
                <Text style={styles.resultValue}>${kellyResult.bankrollAfterBet.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        )}

        {mode === 'truecount' && trueCountResult !== null && (
          <View style={styles.resultsSection}>
            <Text style={styles.resultsTitle}>Recommended Bet Size</Text>
            <View style={styles.resultsGrid}>
              <View style={[styles.resultCard, styles.resultCardRecommended]}>
                <Text style={styles.resultLabel}>Recommended Bet</Text>
                <Text style={styles.resultValue}>${trueCountResult.toFixed(2)}</Text>
                <Text style={styles.resultSubtext}>
                  True Count: {trueCount}
                </Text>
              </View>
              <View style={styles.resultCard}>
                <Text style={styles.resultLabel}>Bet in Units</Text>
                <Text style={styles.resultValue}>
                  {(trueCountResult / parseFloat(baseUnit)).toFixed(1)} units
                </Text>
              </View>
              <View style={styles.resultCard}>
                <Text style={styles.resultLabel}>Bankroll After</Text>
                <Text style={styles.resultValue}>
                  ${(parseFloat(bankroll) - trueCountResult).toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>About Kelly Criterion</Text>
          <Text style={styles.infoText}>
            The Kelly Criterion calculates optimal bet sizing to maximize long-term growth while minimizing risk.
            Lower fractions (e.g., 0.25) are safer but slower growth.
          </Text>
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
    marginBottom: 24,
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: isDark ? '#e0e0e0' : '#333',
    flex: 1,
  },
  modeSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  modeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: isDark ? '#2a2a2a' : '#fff',
    borderWidth: 2,
    borderColor: isDark ? '#444' : '#e0e0e0',
    alignItems: 'center',
  },
  modeButtonActive: {
    borderColor: '#2196f3',
    backgroundColor: '#2196f3',
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: isDark ? '#b0b0b0' : '#666',
  },
  modeButtonTextActive: {
    color: '#fff',
  },
  inputSection: {
    backgroundColor: isDark ? '#2a2a2a' : '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#e0e0e0' : '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5',
    borderWidth: 1,
    borderColor: isDark ? '#444' : '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: isDark ? '#e0e0e0' : '#333',
  },
  inputHint: {
    fontSize: 12,
    color: isDark ? '#888' : '#999',
    marginTop: 4,
  },
  kellyButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  kellyButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5',
    borderWidth: 1,
    borderColor: isDark ? '#444' : '#ddd',
    alignItems: 'center',
  },
  kellyButtonActive: {
    borderColor: '#2196f3',
    backgroundColor: '#2196f3',
  },
  kellyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: isDark ? '#b0b0b0' : '#666',
  },
  kellyButtonTextActive: {
    color: '#fff',
  },
  resultsSection: {
    backgroundColor: isDark ? '#2a2a2a' : '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: isDark ? '#e0e0e0' : '#333',
    marginBottom: 16,
  },
  resultsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  resultCard: {
    backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
  },
  resultCardRecommended: {
    borderWidth: 2,
    borderColor: '#2196f3',
  },
  resultLabel: {
    fontSize: 12,
    color: isDark ? '#b0b0b0' : '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  resultValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: isDark ? '#e0e0e0' : '#333',
    marginBottom: 4,
  },
  resultSubtext: {
    fontSize: 11,
    color: isDark ? '#888' : '#999',
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: isDark ? '#2a2a2a' : '#fff',
    padding: 16,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#e0e0e0' : '#333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: isDark ? '#b0b0b0' : '#666',
    lineHeight: 20,
  },
});


