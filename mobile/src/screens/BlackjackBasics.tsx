import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { CollapsibleSection } from '../components/CollapsibleSection';

export default function BlackjackBasics() {
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
        <Text style={styles.title}>Blackjack Basics</Text>
        <Text style={styles.subtitle}>
          Master card counting and perfect your blackjack strategy. Start learning the basics with our interactive guide below.
        </Text>

        <CollapsibleSection
          title="Basic Blackjack Rules"
          expanded={expandedSections.rules}
          onToggle={() => toggleSection('rules')}
        >
          <Text style={styles.sectionTitle}>Objective</Text>
          <Text style={styles.paragraph}>
            The goal of blackjack is to beat the dealer by having a hand value closer to 21 without going over (busting).
          </Text>

          <Text style={styles.sectionTitle}>Card Values</Text>
          <Text style={styles.paragraph}>Number cards (2-10): Face value</Text>
          <Text style={styles.paragraph}>Face cards (J, Q, K): Worth 10 points</Text>
          <Text style={styles.paragraph}>Aces: Worth either 1 or 11 points (player's choice)</Text>

          <Text style={styles.sectionTitle}>Basic Gameplay</Text>
          <Text style={styles.paragraph}>Players are dealt two cards face up</Text>
          <Text style={styles.paragraph}>Dealer gets one card face up and one face down (hole card)</Text>
          <Text style={styles.paragraph}>Players decide to Hit (take another card) or Stand (keep current hand)</Text>
          <Text style={styles.paragraph}>Dealer must hit on 16 or less and stand on 17 or more</Text>
          <Text style={styles.paragraph}>If you exceed 21, you bust and lose immediately</Text>

          <Text style={styles.sectionTitle}>Winning Conditions</Text>
          <Text style={styles.paragraph}>Blackjack: Ace + 10 = 21 (pays 3:2)</Text>
          <Text style={styles.paragraph}>Win: Hand closer to 21 than dealer without busting</Text>
          <Text style={styles.paragraph}>Push: Same value as dealer (bet returned)</Text>
          <Text style={styles.paragraph}>Lose: Dealer closer to 21 or you bust</Text>
        </CollapsibleSection>

        <CollapsibleSection
          title="Doubling and Splitting"
          expanded={expandedSections.doubling}
          onToggle={() => toggleSection('doubling')}
        >
          <Text style={styles.sectionTitle}>Doubling Down</Text>
          <Text style={styles.paragraph}>Doubling down means to double your bet and take one more card.</Text>
          <Text style={styles.paragraph}>You then receive one extra card for the hand.</Text>
          <Text style={styles.paragraph}>You cannot take any other actions on the hand after doubling down.</Text>

          <Text style={styles.sectionTitle}>Splitting</Text>
          <Text style={styles.paragraph}>If you are dealt two cards of the same rank, you can split them into two separate hands.</Text>
          <Text style={styles.paragraph}>You then receive one extra card for each hand.</Text>
          <Text style={styles.paragraph}>Then you can hit, stand, split again, or double down on each hand as usual.</Text>
          <Text style={styles.paragraph}>Some casinos have extra rules where you cannot split aces, or can only split once.</Text>
        </CollapsibleSection>

        <CollapsibleSection
          title="Basic Strategy"
          expanded={expandedSections.strategy}
          onToggle={() => toggleSection('strategy')}
        >
          <Text style={styles.paragraph}>
            Basic strategy is a set of rules that tells you the best action to take in any given situation.
            It is based on the cards you are dealt and the dealer's upcard (the card face up).
          </Text>
          <Text style={styles.paragraph}>
            Basic strategy is a mathematical model that has been proven to be the optimal action for any given hand.
            It is not a guarantee of winning, but it will help you maximize your odds and minimize the house edge.
          </Text>
          <Text style={styles.paragraph}>
            Study the basic strategy tables and practice them using the simulation. Once you are comfortable
            with the basic strategy, you can navigate to other sections to start taking the advantage from the casino!
          </Text>

          <Text style={styles.noteText}>
            Note: Full strategy tables and practice simulations are available in the web version.
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

