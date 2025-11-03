import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView,  } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../services/AuthContext';
import { useDarkMode } from '../contexts/DarkModeContext';

export default function Home() {
  const navigation = useNavigation();
  const { currentUser, logout } = useAuth();
  const { isDark, toggleDarkMode } = useDarkMode();

  const styles = getStyles(isDark);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Variance</Text>
          <Text style={styles.subtitle}>Blackjack Trainer</Text>
          <TouchableOpacity style={styles.darkModeToggle} onPress={toggleDarkMode}>
            <Text style={styles.darkModeToggleText}>{isDark ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
        </View>

        {currentUser && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tools</Text>
            <View style={styles.menuGrid}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate('Dashboard' as never)}
              >
                <Text style={styles.menuItemTitle}>Dashboard</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate('ProgressTracking' as never)}
              >
                <Text style={styles.menuItemTitle}>Progress Tracking</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate('BettingCalculator' as never)}
              >
                <Text style={styles.menuItemTitle}>Betting Calculator</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate('RiskCalculator' as never)}
              >
                <Text style={styles.menuItemTitle}>Risk Calculator</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate('Settings' as never)}
              >
                <Text style={styles.menuItemTitle}>Settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Guides</Text>
          <View style={styles.menuGrid}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('BlackjackBasics' as never)}
            >
              <Text style={styles.menuItemTitle}>Blackjack Basics</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('CardCounting' as never)}
            >
              <Text style={styles.menuItemTitle}>Card Counting</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('BankrollManagement' as never)}
            >
              <Text style={styles.menuItemTitle}>Bankroll Management</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('AdvancedTechniques' as never)}
            >
              <Text style={styles.menuItemTitle}>Advanced Techniques</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Practice</Text>
          <View style={styles.menuGrid}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('StartCardCounting' as never)}
            >
              <Text style={styles.menuItemTitle}>Start Card Counting</Text>
              <Text style={styles.menuItemBadge}>NEW</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('Simulations' as never)}
            >
              <Text style={styles.menuItemTitle}>Simulations</Text>
            </TouchableOpacity>
          </View>
        </View>

        {currentUser && (
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={async () => {
              await logout();
            }}
          >
            <Text style={styles.logoutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#1a1a1a' : '#F2EFFF',
  },
  content: {
    padding: 20,
  },
  header: {
    position: 'relative',
    marginBottom: 32,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: isDark ? '#e0e0e0' : '#1A1A1A',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    color: isDark ? '#b0b0b0' : '#7A7A7A',
    textAlign: 'center',
    marginBottom: 8,
  },
  darkModeToggle: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 8,
  },
  darkModeToggleText: {
    fontSize: 24,
  },
  menuGrid: {
    gap: 12,
  },
  menuItem: {
    backgroundColor: isDark ? '#2a2a2a' : '#FFFFFF',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: isDark ? '#444' : 'rgba(255, 0, 77, 0.15)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  menuItemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: isDark ? '#e0e0e0' : '#1A1A1A',
  },
  menuItemBadge: {
    backgroundColor: '#2563EB',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
  },
  dashboardButton: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  dashboardButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: isDark ? '#e0e0e0' : '#1A1A1A',
    marginBottom: 12,
  },
  logoutButton: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
