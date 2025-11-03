import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDarkMode } from '../contexts/DarkModeContext';
import BasicStrategySimulation from '../components/BasicStrategySimulation';
import BasicHiLoSimulation from '../components/BasicHiLoSimulation';
import CardSpeedDrill from '../components/CardSpeedDrill';
import BlackjackSimulation from '../components/BlackjackSimulation';

type SimulationMode = 'menu' | 'basic-strategy' | 'card-counting' | 'speed-drill' | 'blackjack';

export default function SimulationPractice() {
  const navigation = useNavigation();
  const { isDark } = useDarkMode();
  const [mode, setMode] = useState<SimulationMode>('menu');
  const styles = getStyles(isDark);

  if (mode === 'basic-strategy') {
    return <BasicStrategySimulation onBack={() => setMode('menu')} />;
  }
  if (mode === 'card-counting') {
    return <BasicHiLoSimulation onBack={() => setMode('menu')} />;
  }
  if (mode === 'speed-drill') {
    return <CardSpeedDrill onBack={() => setMode('menu')} />;
  }
  if (mode === 'blackjack') {
    return <BlackjackSimulation onBack={() => setMode('menu')} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Simulations</Text>
        <Text style={styles.subtitle}>
          Master blackjack with our comprehensive practice simulators. Choose a simulation mode to begin training.
        </Text>

        <View style={styles.simulationGrid}>
            <TouchableOpacity
              style={styles.simulationCard}
              onPress={() => setMode('basic-strategy')}
            >
              <Text style={styles.simulationCardTitle}>Basic Strategy</Text>
              <Text style={styles.simulationCardDescription}>
                Practice basic strategy decisions with instant feedback on correct plays.
              </Text>
              <Text style={styles.simulationCardBadge}>Available</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.simulationCard}
              onPress={() => setMode('card-counting')}
            >
              <Text style={styles.simulationCardTitle}>Card Counting</Text>
              <Text style={styles.simulationCardDescription}>
                Practice maintaining a running count while playing hands.
              </Text>
              <Text style={styles.simulationCardBadge}>Available</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.simulationCard}
              onPress={() => setMode('speed-drill')}
            >
              <Text style={styles.simulationCardTitle}>Speed Drill</Text>
              <Text style={styles.simulationCardDescription}>
                Rapid-fire card counting practice to improve speed and accuracy.
              </Text>
              <Text style={styles.simulationCardBadge}>Available</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.simulationCard}
              onPress={() => setMode('blackjack')}
            >
              <Text style={styles.simulationCardTitle}>Blackjack Game</Text>
              <Text style={styles.simulationCardDescription}>
                Complete blackjack simulation with dealer play.
              </Text>
              <Text style={styles.simulationCardBadge}>Available</Text>
            </TouchableOpacity>
        </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                Use the Start Card Counting screen for real-time counting practice, or access the web app for
                advanced simulations including deviations and full game scenarios.
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
  content: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: isDark ? '#e0e0e0' : '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: isDark ? '#b0b0b0' : '#666',
    marginBottom: 24,
    lineHeight: 24,
  },
  simulationGrid: {
    gap: 16,
    marginBottom: 24,
  },
  simulationCard: {
    backgroundColor: isDark ? '#2a2a2a' : '#fff',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2196f3',
  },
  comingSoonCard: {
    borderColor: isDark ? '#444' : '#e0e0e0',
    opacity: 0.7,
  },
  simulationCardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: isDark ? '#e0e0e0' : '#333',
    marginBottom: 8,
  },
  simulationCardDescription: {
    fontSize: 14,
    color: isDark ? '#b0b0b0' : '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  simulationCardBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#4caf50',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
  },
  comingSoonBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#999',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: isDark ? '#2a2a2a' : '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: isDark ? '#444' : '#e0e0e0',
  },
  infoText: {
    fontSize: 14,
    color: isDark ? '#b0b0b0' : '#666',
    lineHeight: 22,
  },
});

