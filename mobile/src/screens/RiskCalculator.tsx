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
import {
  calculateRiskOfRuin,
  calculateRiskFromTrueCount,
  calculateRequiredBankroll,
  RiskOfRuinResult,
} from '../utils/riskCalculator';

export default function RiskCalculator() {
  const navigation = useNavigation();
  const { isDark } = useDarkMode();
  const styles = getStyles(isDark);
  
  const [bankroll, setBankroll] = useState('10000');
  const [hourlyWinRate, setHourlyWinRate] = useState('25');
  const [hourlySD, setHourlySD] = useState('300');
  const [mode, setMode] = useState<'basic' | 'truecount'>('basic');
  
  const [trueCount, setTrueCount] = useState('1');
  const [baseUnit, setBaseUnit] = useState('10');
  const [bettingSpread, setBettingSpread] = useState('12');
  const [handsPerHour, setHandsPerHour] = useState('100');

  const basicResult: RiskOfRuinResult | null = (() => {
    try {
      const bankrollVal = parseFloat(bankroll);
      const winRateVal = parseFloat(hourlyWinRate);
      const sdVal = parseFloat(hourlySD);
      
      if (bankrollVal <= 0 || sdVal <= 0) {
        return null;
      }
      
      return calculateRiskOfRuin(bankrollVal, winRateVal, sdVal);
    } catch {
      return null;
    }
  })();

  const trueCountResult: RiskOfRuinResult | null = (() => {
    try {
      const bankrollVal = parseFloat(bankroll);
      const trueCountVal = parseFloat(trueCount);
      const baseUnitVal = parseFloat(baseUnit);
      const spreadVal = parseFloat(bettingSpread);
      const handsVal = parseFloat(handsPerHour);
      
      if (bankrollVal <= 0 || baseUnitVal <= 0 || spreadVal <= 0 || handsVal <= 0) {
        return null;
      }
      
      return calculateRiskFromTrueCount(bankrollVal, trueCountVal, baseUnitVal, spreadVal, handsVal);
    } catch {
      return null;
    }
  })();

  const result = mode === 'basic' ? basicResult : trueCountResult;

  const requiredBankroll5 = result 
    ? calculateRequiredBankroll(5, result.hourlyWinRate, result.hourlySD)
    : null;
  const requiredBankroll10 = result 
    ? calculateRequiredBankroll(10, result.hourlyWinRate, result.hourlySD)
    : null;

  const getRiskLevel = (riskPercent: number): string => {
    if (riskPercent < 1) return 'Very Low';
    if (riskPercent < 5) return 'Low';
    if (riskPercent < 10) return 'Moderate';
    if (riskPercent < 20) return 'High';
    return 'Very High';
  };

  const getRiskColor = (riskPercent: number): string => {
    if (riskPercent < 1) return '#4caf50';
    if (riskPercent < 5) return '#8bc34a';
    if (riskPercent < 10) return '#ffc107';
    if (riskPercent < 20) return '#ff9800';
    return '#f44336';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Risk of Ruin</Text>
        </View>

        <View style={styles.modeSelector}>
          <TouchableOpacity
            style={[styles.modeButton, mode === 'basic' && styles.modeButtonActive]}
            onPress={() => setMode('basic')}
          >
            <Text style={[styles.modeButtonText, mode === 'basic' && styles.modeButtonTextActive]}>
              Basic
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, mode === 'truecount' && styles.modeButtonActive]}
            onPress={() => setMode('truecount')}
          >
            <Text style={[styles.modeButtonText, mode === 'truecount' && styles.modeButtonTextActive]}>
              True Count
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

          {mode === 'basic' && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Hourly Win Rate ($)</Text>
                <TextInput
                  style={styles.input}
                  value={hourlyWinRate}
                  onChangeText={setHourlyWinRate}
                  keyboardType="numeric"
                  placeholder="25"
                  placeholderTextColor={isDark ? '#666' : '#999'}
                />
                <Text style={styles.inputHint}>Expected hourly profit</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Hourly Standard Deviation ($)</Text>
                <TextInput
                  style={styles.input}
                  value={hourlySD}
                  onChangeText={setHourlySD}
                  keyboardType="numeric"
                  placeholder="300"
                  placeholderTextColor={isDark ? '#666' : '#999'}
                />
                <Text style={styles.inputHint}>Volatility of your results</Text>
              </View>
            </>
          )}

          {mode === 'truecount' && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Average True Count</Text>
                <TextInput
                  style={styles.input}
                  value={trueCount}
                  onChangeText={setTrueCount}
                  keyboardType="numeric"
                  placeholder="1"
                  placeholderTextColor={isDark ? '#666' : '#999'}
                />
                <Text style={styles.inputHint}>Average true count you play at</Text>
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
                <Text style={styles.inputLabel}>Betting Spread</Text>
                <TextInput
                  style={styles.input}
                  value={bettingSpread}
                  onChangeText={setBettingSpread}
                  keyboardType="numeric"
                  placeholder="12"
                  placeholderTextColor={isDark ? '#666' : '#999'}
                />
                <Text style={styles.inputHint}>Spread ratio (e.g., 12 = 1-12 spread)</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Hands Per Hour</Text>
                <TextInput
                  style={styles.input}
                  value={handsPerHour}
                  onChangeText={setHandsPerHour}
                  keyboardType="numeric"
                  placeholder="100"
                  placeholderTextColor={isDark ? '#666' : '#999'}
                />
                <Text style={styles.inputHint}>Average hands played per hour</Text>
              </View>
            </>
          )}
        </View>

        {result && (
          <View style={styles.resultsSection}>
            <View style={[styles.riskCard, { borderColor: getRiskColor(result.riskOfRuinPercent) }]}>
              <Text style={styles.riskLabel}>Risk of Ruin</Text>
              <Text style={[styles.riskValue, { color: getRiskColor(result.riskOfRuinPercent) }]}>
                {result.riskOfRuinPercent.toFixed(2)}%
              </Text>
              <Text style={styles.riskLevel}>{getRiskLevel(result.riskOfRuinPercent)}</Text>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Bankroll Units</Text>
                <Text style={styles.statValue}>{result.bankrollUnits.toFixed(1)}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Hourly Win Rate</Text>
                <Text style={styles.statValue}>${result.hourlyWinRate.toFixed(2)}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Hourly SD</Text>
                <Text style={styles.statValue}>${result.hourlySD.toFixed(2)}</Text>
              </View>
              {result.timeToRuin > 0 && (
                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>Est. Time to Ruin</Text>
                  <Text style={styles.statValue}>
                    {Math.floor(result.timeToRuin)}h
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.requiredBankrollSection}>
              <Text style={styles.requiredTitle}>Required Bankroll</Text>
              {requiredBankroll5 && (
                <View style={styles.requiredRow}>
                  <Text style={styles.requiredLabel}>For 5% Risk:</Text>
                  <Text style={styles.requiredValue}>
                    ${requiredBankroll5.toFixed(2)}
                  </Text>
                </View>
              )}
              {requiredBankroll10 && (
                <View style={styles.requiredRow}>
                  <Text style={styles.requiredLabel}>For 10% Risk:</Text>
                  <Text style={styles.requiredValue}>
                    ${requiredBankroll10.toFixed(2)}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>About Risk of Ruin</Text>
          <Text style={styles.infoText}>
            Risk of Ruin is the probability of losing your entire bankroll before achieving your goals.
            Lower percentages indicate safer bankroll management.
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
  resultsSection: {
    backgroundColor: isDark ? '#2a2a2a' : '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  riskCard: {
    borderWidth: 3,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  riskLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#b0b0b0' : '#666',
    marginBottom: 8,
  },
  riskValue: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  riskLevel: {
    fontSize: 18,
    fontWeight: '600',
    color: isDark ? '#b0b0b0' : '#666',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: isDark ? '#b0b0b0' : '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: isDark ? '#e0e0e0' : '#333',
  },
  requiredBankrollSection: {
    backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5',
    padding: 16,
    borderRadius: 12,
  },
  requiredTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#e0e0e0' : '#333',
    marginBottom: 12,
  },
  requiredRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  requiredLabel: {
    fontSize: 14,
    color: isDark ? '#b0b0b0' : '#666',
  },
  requiredValue: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#e0e0e0' : '#333',
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


