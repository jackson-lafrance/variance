import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../services/AuthContext';
import { useDarkMode } from '../contexts/DarkModeContext';
import { getUserPracticeSessions, PracticeSession } from '../utils/practiceSessions';
import { getUserHighScores, HighScore } from '../utils/highScores';

const simulationTypes = [
  { value: 'all', label: 'All Simulations' },
  { value: 'basic-strategy', label: 'Basic Strategy' },
  { value: 'counting', label: 'Card Counting' },
  { value: 'deviations', label: 'Deviations' },
  { value: 'unified', label: 'Unified' },
  { value: 'card-speed', label: 'Card Speed' },
];

export default function ProgressTracking() {
  const navigation = useNavigation();
  const { currentUser } = useAuth();
  const { isDark } = useDarkMode();
  const styles = getStyles(isDark);
  
  const [practiceSessions, setPracticeSessions] = useState<PracticeSession[]>([]);
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  const [selectedSimulation, setSelectedSimulation] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser, selectedSimulation]);

  const loadData = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const sessions = selectedSimulation === 'all'
        ? await getUserPracticeSessions(currentUser.uid)
        : await getUserPracticeSessions(currentUser.uid, selectedSimulation);
      const scores = selectedSimulation === 'all'
        ? await getUserHighScores(currentUser.uid)
        : await getUserHighScores(currentUser.uid, selectedSimulation);
      
      setPracticeSessions(sessions);
      setHighScores(scores);
    } catch (error) {
      console.error('Error loading progress data:', error);
      Alert.alert('Error', 'Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const calculateStats = () => {
    if (practiceSessions.length === 0) return null;

    const accuracies = practiceSessions.map(s => s.accuracy);
    const avgAccuracy = accuracies.reduce((a, b) => a + b, 0) / accuracies.length;
    const bestAccuracy = Math.max(...accuracies);
    const worstAccuracy = Math.min(...accuracies);
    const totalHands = practiceSessions.reduce((sum, s) => sum + (s.handsPlayed || 0), 0);
    const totalDuration = practiceSessions.reduce((sum, s) => sum + (s.duration || 0), 0);

    const recentSessions = practiceSessions.slice(0, 10);
    const recentAccuracies = recentSessions.map(s => s.accuracy);
    const recentAvg = recentAccuracies.length > 0
      ? recentAccuracies.reduce((a, b) => a + b, 0) / recentAccuracies.length
      : avgAccuracy;

    const olderSessions = practiceSessions.slice(10);
    const olderAvg = olderSessions.length > 0
      ? olderSessions.map(s => s.accuracy).reduce((a, b) => a + b, 0) / olderSessions.length
      : avgAccuracy;

    return {
      avgAccuracy: Math.round(avgAccuracy),
      bestAccuracy,
      worstAccuracy,
      totalHands,
      totalDuration,
      improvement: recentAvg - olderAvg,
      recentAvg: Math.round(recentAvg),
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading progress data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Progress Tracking</Text>
        </View>

        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Filter by Simulation:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {simulationTypes.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.filterButton,
                  selectedSimulation === type.value && styles.filterButtonActive,
                ]}
                onPress={() => setSelectedSimulation(type.value)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    selectedSimulation === type.value && styles.filterButtonTextActive,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {stats && (
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Average Accuracy</Text>
              <Text style={styles.statValue}>{stats.avgAccuracy}%</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Best Accuracy</Text>
              <Text style={styles.statValue}>{stats.bestAccuracy}%</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Total Hands</Text>
              <Text style={styles.statValue}>{stats.totalHands.toLocaleString()}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Practice Time</Text>
              <Text style={styles.statValue}>
                {Math.floor(stats.totalDuration / 60)}m {stats.totalDuration % 60}s
              </Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Recent Average</Text>
              <Text style={styles.statValue}>{stats.recentAvg}%</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Improvement</Text>
              <Text style={[styles.statValue, stats.improvement >= 0 ? styles.positive : styles.negative]}>
                {stats.improvement >= 0 ? '+' : ''}{stats.improvement.toFixed(1)}%
              </Text>
            </View>
          </View>
        )}

        {highScores.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top Scores</Text>
            {highScores.slice(0, 10).map((score, index) => (
              <View key={score.id || index} style={styles.scoreRow}>
                <View style={styles.scoreInfo}>
                  <Text style={styles.scoreType}>{score.simulationType}</Text>
                  <Text style={styles.scoreDate}>{formatDate(score.timestamp)}</Text>
                </View>
                <View style={styles.scoreValues}>
                  <Text style={styles.scoreValue}>Score: {score.score}</Text>
                  <Text style={styles.scoreAccuracy}>Accuracy: {score.accuracy}%</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {practiceSessions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Sessions</Text>
            {practiceSessions.slice(0, 10).map((session, index) => (
              <View key={session.id || index} style={styles.sessionRow}>
                <View style={styles.sessionInfo}>
                  <Text style={styles.sessionType}>{session.simulationType}</Text>
                  <Text style={styles.sessionDate}>{formatDate(session.timestamp)}</Text>
                </View>
                <View style={styles.sessionValues}>
                  <Text style={styles.sessionAccuracy}>Accuracy: {session.accuracy}%</Text>
                  {session.handsPlayed && (
                    <Text style={styles.sessionHands}>Hands: {session.handsPlayed}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {practiceSessions.length === 0 && highScores.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No progress data yet</Text>
            <Text style={styles.emptySubtext}>Start practicing to track your progress!</Text>
          </View>
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
    marginBottom: 24,
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: isDark ? '#e0e0e0' : '#333',
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: isDark ? '#b0b0b0' : '#666',
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#e0e0e0' : '#333',
    marginBottom: 12,
  },
  filterScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: isDark ? '#2a2a2a' : '#fff',
    marginRight: 8,
    borderWidth: 1,
    borderColor: isDark ? '#444' : '#e0e0e0',
  },
  filterButtonActive: {
    backgroundColor: '#2196f3',
    borderColor: '#2196f3',
  },
  filterButtonText: {
    fontSize: 14,
    color: isDark ? '#b0b0b0' : '#666',
  },
  filterButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: isDark ? '#2a2a2a' : '#fff',
    padding: 16,
    borderRadius: 12,
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: isDark ? '#444' : '#e0e0e0',
  },
  statLabel: {
    fontSize: 12,
    color: isDark ? '#b0b0b0' : '#666',
    marginBottom: 8,
    textAlign: 'center',
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
  section: {
    backgroundColor: isDark ? '#2a2a2a' : '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: isDark ? '#e0e0e0' : '#333',
    marginBottom: 16,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#444' : '#e0e0e0',
  },
  scoreInfo: {
    flex: 1,
  },
  scoreType: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#e0e0e0' : '#333',
    marginBottom: 4,
  },
  scoreDate: {
    fontSize: 12,
    color: isDark ? '#b0b0b0' : '#666',
  },
  scoreValues: {
    alignItems: 'flex-end',
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196f3',
    marginBottom: 4,
  },
  scoreAccuracy: {
    fontSize: 14,
    color: isDark ? '#b0b0b0' : '#666',
  },
  sessionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#444' : '#e0e0e0',
  },
  sessionInfo: {
    flex: 1,
  },
  sessionType: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#e0e0e0' : '#333',
    marginBottom: 4,
  },
  sessionDate: {
    fontSize: 12,
    color: isDark ? '#b0b0b0' : '#666',
  },
  sessionValues: {
    alignItems: 'flex-end',
  },
  sessionAccuracy: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196f3',
    marginBottom: 4,
  },
  sessionHands: {
    fontSize: 14,
    color: isDark ? '#b0b0b0' : '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: isDark ? '#b0b0b0' : '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: isDark ? '#888' : '#999',
  },
});


