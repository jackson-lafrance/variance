import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useAuth } from '../services/AuthContext';
import { db } from '../services/firebase';
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';

interface CasinoSession {
  id?: string;
  date: string;
  casino: string;
  hoursPlayed: number;
  startingBankroll: number;
  endingBankroll: number;
  profit: number;
  handsPlayed?: number;
  notes?: string;
  userId: string;
  timestamp: number;
}

interface UserStats {
  totalBankroll: number;
  totalProfit: number;
  totalSessions: number;
  totalHours: number;
}

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const [sessions, setSessions] = useState<CasinoSession[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalBankroll: 0,
    totalProfit: 0,
    totalSessions: 0,
    totalHours: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showAddSession, setShowAddSession] = useState(false);

  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
  const [casino, setCasino] = useState('');
  const [hoursPlayed, setHoursPlayed] = useState('');
  const [startingBankroll, setStartingBankroll] = useState('');
  const [endingBankroll, setEndingBankroll] = useState('');
  const [handsPlayed, setHandsPlayed] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!currentUser) return;
    loadData();
  }, [currentUser]);

  const loadData = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      
      const statsDoc = await getDoc(doc(db, 'userStats', currentUser.uid));
      if (statsDoc.exists()) {
        setStats(statsDoc.data() as UserStats);
      } else {
        await setDoc(doc(db, 'userStats', currentUser.uid), {
          totalBankroll: 0,
          totalProfit: 0,
          totalSessions: 0,
          totalHours: 0,
        });
        setStats({ totalBankroll: 0, totalProfit: 0, totalSessions: 0, totalHours: 0 });
      }

      const sessionsQuery = query(
        collection(db, 'casinoSessions'),
        where('userId', '==', currentUser.uid),
        orderBy('timestamp', 'desc')
      );
      const sessionsSnapshot = await getDocs(sessionsQuery);
      const loadedSessions: CasinoSession[] = [];
      sessionsSnapshot.forEach((doc) => {
        loadedSessions.push({ id: doc.id, ...doc.data() } as CasinoSession);
      });
      setSessions(loadedSessions);
    } catch (error: any) {
      if (error.code !== 'failed-precondition' && error.code !== 'permission-denied') {
        console.error('Dashboard load error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddSession = async () => {
    if (!currentUser) return;

    const starting = parseFloat(startingBankroll);
    const ending = parseFloat(endingBankroll);
    const hours = parseFloat(hoursPlayed);

    if (isNaN(starting) || isNaN(ending) || isNaN(hours)) {
      Alert.alert('Error', 'Please enter valid numbers for all required fields');
      return;
    }

    if (starting <= 0 || ending < 0) {
      Alert.alert('Error', 'Bankroll amounts must be positive numbers');
      return;
    }

    if (hours <= 0 || hours > 24) {
      Alert.alert('Error', 'Hours played must be between 0 and 24');
      return;
    }

    const sessionDateObj = new Date(sessionDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (sessionDateObj > today) {
      Alert.alert('Error', 'Session date cannot be in the future');
      return;
    }

    if (handsPlayed && (isNaN(parseInt(handsPlayed)) || parseInt(handsPlayed) < 0)) {
      Alert.alert('Error', 'Hands played must be a valid positive number');
      return;
    }

    const profit = ending - starting;

    const newSession: Omit<CasinoSession, 'id'> = {
      date: sessionDate,
      casino: casino.trim(),
      hoursPlayed: hours,
      startingBankroll: starting,
      endingBankroll: ending,
      profit,
      handsPlayed: handsPlayed ? parseInt(handsPlayed) : undefined,
      notes: notes.trim() || undefined,
      userId: currentUser.uid,
      timestamp: sessionDateObj.getTime(),
    };

    try {
      await addDoc(collection(db, 'casinoSessions'), newSession);

      const newStats = {
        totalBankroll: stats.totalBankroll + profit,
        totalProfit: stats.totalProfit + profit,
        totalSessions: stats.totalSessions + 1,
        totalHours: stats.totalHours + hours,
      };

      await setDoc(doc(db, 'userStats', currentUser.uid), newStats);

      setCasino('');
      setHoursPlayed('');
      setStartingBankroll('');
      setEndingBankroll('');
      setHandsPlayed('');
      setNotes('');
      setShowAddSession(false);

      await loadData();
    } catch (error) {
      Alert.alert('Error', 'Failed to add session. Please check your connection and try again.');
    }
  };

  const handleDeleteSession = async (sessionId: string, sessionProfit: number, sessionHours: number) => {
    if (!currentUser) return;

    Alert.alert(
      'Delete Session',
      'Are you sure you want to delete this session? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'casinoSessions', sessionId));

              const newStats = {
                totalBankroll: stats.totalBankroll - sessionProfit,
                totalProfit: stats.totalProfit - sessionProfit,
                totalSessions: stats.totalSessions - 1,
                totalHours: Math.max(0, stats.totalHours - sessionHours),
              };

              await setDoc(doc(db, 'userStats', currentUser.uid), newStats);
              await loadData();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete session. Please try again.');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentUser) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.loadingText}>Please sign in to view your dashboard.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Welcome, {currentUser.displayName || currentUser.email}</Text>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Bankroll</Text>
            <Text style={styles.statValue}>
              ${stats.totalBankroll.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Profit/Loss</Text>
            <Text style={[styles.statValue, stats.totalProfit >= 0 ? styles.profit : styles.loss]}>
              {stats.totalProfit >= 0 ? '+' : ''}${stats.totalProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Sessions</Text>
            <Text style={styles.statValue}>{stats.totalSessions}</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Hours</Text>
            <Text style={styles.statValue}>{stats.totalHours.toFixed(1)}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddSession(true)}
        >
          <Text style={styles.addButtonText}>+ Add Casino Session</Text>
        </TouchableOpacity>

        {showAddSession && (
          <View style={styles.form}>
            <Text style={styles.formTitle}>Add Casino Session</Text>

            <Text style={styles.label}>Date</Text>
            <TextInput
              style={styles.input}
              value={sessionDate}
              onChangeText={setSessionDate}
              placeholder="YYYY-MM-DD"
            />

            <Text style={styles.label}>Casino Name</Text>
            <TextInput
              style={styles.input}
              value={casino}
              onChangeText={setCasino}
              placeholder="e.g., Bellagio"
            />

            <Text style={styles.label}>Hours Played</Text>
            <TextInput
              style={styles.input}
              value={hoursPlayed}
              onChangeText={setHoursPlayed}
              keyboardType="numeric"
              placeholder="e.g., 4.5"
            />

            <Text style={styles.label}>Starting Bankroll ($)</Text>
            <TextInput
              style={styles.input}
              value={startingBankroll}
              onChangeText={setStartingBankroll}
              keyboardType="numeric"
              placeholder="e.g., 1000"
            />

            <Text style={styles.label}>Ending Bankroll ($)</Text>
            <TextInput
              style={styles.input}
              value={endingBankroll}
              onChangeText={setEndingBankroll}
              keyboardType="numeric"
              placeholder="e.g., 1250"
            />

            <Text style={styles.label}>Hands Played (Optional)</Text>
            <TextInput
              style={styles.input}
              value={handsPlayed}
              onChangeText={setHandsPlayed}
              keyboardType="numeric"
              placeholder="e.g., 200"
            />

            <Text style={styles.label}>Notes (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Good penetration, friendly dealer..."
              multiline
              numberOfLines={3}
            />

            <View style={styles.formButtons}>
              <TouchableOpacity
                style={[styles.formButton, styles.cancelButton]}
                onPress={() => setShowAddSession(false)}
              >
                <Text style={styles.formButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.formButton, styles.submitButton]}
                onPress={handleAddSession}
              >
                <Text style={styles.formButtonText}>Add Session</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <Text style={styles.sectionTitle}>Session History</Text>
        {sessions.length === 0 ? (
          <Text style={styles.noSessions}>No sessions yet. Add your first casino session above!</Text>
        ) : (
          sessions.map((session) => (
            <View key={session.id} style={styles.sessionCard}>
              <View style={styles.sessionHeader}>
                <Text style={styles.sessionDate}>
                  {new Date(session.timestamp).toLocaleDateString()}
                </Text>
                <Text style={[styles.sessionProfit, session.profit >= 0 ? styles.profit : styles.loss]}>
                  {session.profit >= 0 ? '+' : ''}${session.profit.toFixed(2)}
                </Text>
              </View>
              <Text style={styles.sessionDetail}>Casino: {session.casino}</Text>
              <Text style={styles.sessionDetail}>Hours: {session.hoursPlayed.toFixed(1)}</Text>
              <Text style={styles.sessionDetail}>
                Bankroll: ${session.startingBankroll.toFixed(2)} → ${session.endingBankroll.toFixed(2)}
              </Text>
              {session.handsPlayed && (
                <Text style={styles.sessionDetail}>Hands: {session.handsPlayed}</Text>
              )}
              {session.notes && (
                <Text style={styles.sessionNotes}>Notes: {session.notes}</Text>
              )}
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteSession(session.id!, session.profit, session.hoursPlayed)}
              >
                <Text style={styles.deleteButtonText}>Delete Session</Text>
              </TouchableOpacity>
            </View>
          ))
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
  content: {
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  statsGrid: {
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
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  profit: {
    color: '#4caf50',
  },
  loss: {
    color: '#f44336',
  },
  addButton: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  form: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  formButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#757575',
  },
  submitButton: {
    backgroundColor: '#2563EB',
  },
  formButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  noSessions: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    padding: 20,
  },
  sessionCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sessionDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  sessionProfit: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sessionDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  sessionNotes: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 12,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

