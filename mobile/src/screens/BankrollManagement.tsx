import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { CollapsibleSection } from '../components/CollapsibleSection';

export default function BankrollManagement() {
  const [bankroll, setBankroll] = useState('10000');
  const [maxBet, setMaxBet] = useState('100');
  const [advantage, setAdvantage] = useState('1');
  const [hourlyHands, setHourlyHands] = useState('80');
  const [hoursPlayed, setHoursPlayed] = useState('100');
  const [stdDev, setStdDev] = useState('1.15');

  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const calculateEV = () => {
    const handsPlayed = parseFloat(hourlyHands) * parseFloat(hoursPlayed);
    const ev = (parseFloat(advantage) / 100) * parseFloat(maxBet) * handsPlayed;
    return ev;
  };

  const calculateStdDeviation = () => {
    const handsPlayed = parseFloat(hourlyHands) * parseFloat(hoursPlayed);
    const variance = Math.pow(parseFloat(stdDev) * parseFloat(maxBet), 2) * handsPlayed;
    return Math.sqrt(variance);
  };

  const calculate95PercentRange = () => {
    const ev = calculateEV();
    const sd = calculateStdDeviation();
    return {
      lower: ev - (1.96 * sd),
      upper: ev + (1.96 * sd)
    };
  };

  const ev = calculateEV();
  const sd = calculateStdDeviation();
  const range = calculate95PercentRange();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Bankroll Management</Text>
        <Text style={styles.subtitle}>
          Master the financial side of card counting. Calculate optimal bet sizes, understand variance,
          and manage your bankroll to minimize risk and maximize profits.
        </Text>

        <CollapsibleSection
          title="Expected Value & Variance Calculator"
          expanded={expandedSections.ev}
          onToggle={() => toggleSection('ev')}
        >
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bankroll ($)</Text>
            <TextInput
              style={styles.input}
              value={bankroll}
              onChangeText={setBankroll}
              keyboardType="numeric"
              placeholder="10000"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Max Bet ($)</Text>
            <TextInput
              style={styles.input}
              value={maxBet}
              onChangeText={setMaxBet}
              keyboardType="numeric"
              placeholder="100"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Advantage (%)</Text>
            <TextInput
              style={styles.input}
              value={advantage}
              onChangeText={setAdvantage}
              keyboardType="numeric"
              placeholder="1"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Hands Per Hour</Text>
            <TextInput
              style={styles.input}
              value={hourlyHands}
              onChangeText={setHourlyHands}
              keyboardType="numeric"
              placeholder="80"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Hours Played</Text>
            <TextInput
              style={styles.input}
              value={hoursPlayed}
              onChangeText={setHoursPlayed}
              keyboardType="numeric"
              placeholder="100"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Standard Deviation</Text>
            <TextInput
              style={styles.input}
              value={stdDev}
              onChangeText={setStdDev}
              keyboardType="numeric"
              placeholder="1.15"
            />
          </View>

          <View style={styles.resultBox}>
            <Text style={styles.resultLabel}>Expected Value</Text>
            <Text style={styles.resultValue}>${ev.toFixed(2)}</Text>
          </View>

          <View style={styles.resultBox}>
            <Text style={styles.resultLabel}>Standard Deviation</Text>
            <Text style={styles.resultValue}>${sd.toFixed(2)}</Text>
          </View>

          <View style={styles.resultBox}>
            <Text style={styles.resultLabel}>95% Confidence Range</Text>
            <Text style={styles.resultValue}>
              ${range.lower.toFixed(2)} to ${range.upper.toFixed(2)}
            </Text>
          </View>
        </CollapsibleSection>

        <CollapsibleSection
          title="Bankroll Sizing Guidelines"
          expanded={expandedSections.sizing}
          onToggle={() => toggleSection('sizing')}
        >
          <Text style={styles.paragraph}>
            Your bankroll should be large enough to withstand the inevitable swings (variance) you'll experience.
            A general rule is to have at least 100-200 maximum bets in your bankroll.
          </Text>
          <Text style={styles.paragraph}>
            For a 1-8 spread with a $100 max bet, you should have at least $8,000-$16,000 in your bankroll.
          </Text>
          <Text style={styles.paragraph}>
            Conservative players use 200-300 max bets, while aggressive players might use 50-100 max bets.
            The larger your bankroll relative to your max bet, the lower your risk of ruin.
          </Text>
        </CollapsibleSection>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    lineHeight: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  resultBox: {
    backgroundColor: '#e8f5e9',
    padding: 16,
    borderRadius: 8,
    marginTop: 12,
  },
  resultLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  paragraph: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
    lineHeight: 24,
  },
});

