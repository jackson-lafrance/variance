import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';

export default function SimulationPractice() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Simulations</Text>
        <Text style={styles.subtitle}>
          Master blackjack with our comprehensive practice simulator. Customize your training to focus on specific skills
          and track your progress in real-time.
        </Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Full simulation practice with customizable settings, multiple practice modes, and advanced features
            are available in the web version.
          </Text>
          <Text style={styles.infoText}>
            Use the Start Card Counting screen for real-time counting practice, or access the web app for
            complete simulation training.
          </Text>
        </View>

        <View style={styles.featureList}>
          <Text style={styles.featureTitle}>Available in Web Version:</Text>
          <Text style={styles.featureItem}>• Full game simulation</Text>
          <Text style={styles.featureItem}>• Basic strategy practice</Text>
          <Text style={styles.featureItem}>• Deviations practice</Text>
          <Text style={styles.featureItem}>• Customizable deck count and penetration</Text>
          <Text style={styles.featureItem}>• Count accuracy tracking</Text>
          <Text style={styles.featureItem}>• Multiple practice modes</Text>
        </View>
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
  infoBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
    lineHeight: 24,
  },
  featureList: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  featureItem: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    lineHeight: 24,
  },
});

