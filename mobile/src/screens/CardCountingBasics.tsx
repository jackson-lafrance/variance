import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { CollapsibleSection } from '../components/CollapsibleSection';

export default function CardCountingBasics() {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Card Counting</Text>
        <Text style={styles.subtitle}>
          Learn the fundamentals of card counting and gain an edge over the casino. Master the Hi-Lo system and advanced techniques.
        </Text>

        <CollapsibleSection
          title="The Basics of Hi-Lo Counting"
          expanded={expandedSections.basics}
          onToggle={() => toggleSection('basics')}
        >
          <Text style={styles.sectionTitle}>What is Card Counting?</Text>
          <Text style={styles.paragraph}>
            Card counting is a strategy used in blackjack to determine whether the next hand is likely to give an advantage to the player or the dealer.
            By keeping track of which cards have been played, skilled players can adjust their bets and playing decisions to maximize their edge.
          </Text>

          <Text style={styles.sectionTitle}>The Hi-Lo System</Text>
          <Text style={styles.paragraph}>The Hi-Lo counting system is the most popular and widely used card counting method. It assigns point values to cards:</Text>
          <Text style={styles.paragraph}>Low cards (2-6): +1</Text>
          <Text style={styles.paragraph}>Neutral cards (7-9): 0</Text>
          <Text style={styles.paragraph}>High cards (10, J, Q, K, A): -1</Text>

          <Text style={styles.sectionTitle}>How It Works</Text>
          <Text style={styles.paragraph}>
            As cards are dealt, you keep a running count by adding and subtracting these values. A positive count means more low cards have been played,
            leaving more high cards in the deck, which favors the player. A negative count means more high cards have been played, favoring the dealer.
          </Text>

          <Text style={styles.sectionTitle}>Running Count vs True Count</Text>
          <Text style={styles.paragraph}>
            The running count is your cumulative total as cards are dealt. However, to account for multiple decks,
            you need to convert this to a true count by dividing the running count by the number of decks remaining.
          </Text>
          <Text style={styles.paragraph}>
            For example, if your running count is +6 and there are 3 decks left, your true count is +2.
            The true count gives you a more accurate picture of your advantage.
          </Text>

          <Text style={styles.noteText}>
            Note: Interactive simulations and drills are available in the web version or use the Start Card Counting screen.
          </Text>
        </CollapsibleSection>

        <CollapsibleSection
          title="Betting Strategy and Bankroll Management"
          expanded={expandedSections.betting}
          onToggle={() => toggleSection('betting')}
        >
          <Text style={styles.sectionTitle}>The Importance of Proper Betting</Text>
          <Text style={styles.paragraph}>
            Card counting only gives you an edge when you adjust your bet size based on the count.
            Betting the same amount regardless of the count defeats the entire purpose of counting cards.
            Your betting strategy is just as important as your counting accuracy.
          </Text>

          <Text style={styles.sectionTitle}>Basic Betting Spread</Text>
          <Text style={styles.paragraph}>A betting spread is the ratio between your minimum and maximum bets. Common spreads include:</Text>
          <Text style={styles.paragraph}>1-4 spread: Bet 1 unit at negative counts, 2-4 units at positive counts</Text>
          <Text style={styles.paragraph}>1-8 spread: More aggressive, better for experienced players</Text>
          <Text style={styles.paragraph}>1-12 spread: High risk, high reward, requires large bankroll</Text>

          <Text style={styles.sectionTitle}>Betting Based on True Count</Text>
          <Text style={styles.paragraph}>The most common approach is to bet your base unit multiplied by the true count minus 1:</Text>
          <Text style={styles.paragraph}>True Count ≤ 1: Bet minimum (1 unit)</Text>
          <Text style={styles.paragraph}>True Count = 2: Bet 2 units</Text>
          <Text style={styles.paragraph}>True Count = 3: Bet 4 units</Text>
          <Text style={styles.paragraph}>True Count = 4: Bet 6 units</Text>
          <Text style={styles.paragraph}>True Count ≥ 5: Bet maximum (8-12 units)</Text>
        </CollapsibleSection>

        <CollapsibleSection
          title="Illustrious 18"
          expanded={expandedSections.deviations}
          onToggle={() => toggleSection('deviations')}
        >
          <Text style={styles.paragraph}>
            The Illustrious 18 are the most important basic strategy deviations that card counters should memorize.
            These deviations tell you when to deviate from basic strategy based on the true count.
          </Text>
          <Text style={styles.noteText}>
            Note: Full deviation list and practice simulations are available in the web version.
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
    lineHeight: 24,
  },
  noteText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 16,
  },
});

