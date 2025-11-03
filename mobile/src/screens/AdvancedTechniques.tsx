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

export default function AdvancedTechniques() {
  const [cutCardPosition, setCutCardPosition] = useState('52');
  const [sequenceCards, setSequenceCards] = useState<string[]>([]);
  const [inputCard, setInputCard] = useState('');
  const [cardError, setCardError] = useState('');
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const calculatePenetration = () => {
    const totalCards = 312;
    const cardsDealt = totalCards - parseInt(cutCardPosition);
    return ((cardsDealt / totalCards) * 100).toFixed(1);
  };

  const isValidCard = (card: string): boolean => {
    const upper = card.toUpperCase();
    const validRanks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const validSuits = ['C', 'D', 'H', 'S'];
    
    if (upper.length < 2 || upper.length > 3) return false;
    
    const suit = upper[upper.length - 1];
    const rank = upper.substring(0, upper.length - 1);
    
    return validRanks.includes(rank) && validSuits.includes(suit);
  };

  const addCardToSequence = () => {
    if (inputCard && sequenceCards.length < 10) {
      const formattedCard = inputCard.toUpperCase().trim();
      if (isValidCard(formattedCard)) {
        setSequenceCards([...sequenceCards, formattedCard]);
        setInputCard('');
        setCardError('');
      } else {
        setCardError('Invalid card format. Use: AS, 10H, KD, etc.');
      }
    }
  };

  const clearSequence = () => {
    setSequenceCards([]);
    setCardError('');
  };

  const getRank = (card: string): string => {
    return card.substring(0, card.length - 1);
  };

  const countHighCards = () => {
    return sequenceCards.filter(card => {
      const rank = getRank(card);
      return ['10', 'J', 'Q', 'K', 'A'].includes(rank);
    }).length;
  };

  const isGoodSequence = () => {
    const highCount = countHighCards();
    return highCount >= 6;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Advanced Techniques</Text>
        <Text style={styles.subtitle}>
          Beyond basic card counting: Advanced techniques used by professional advantage players.
          These methods require extensive practice and are not for beginners.
        </Text>

        <CollapsibleSection
          title="Shuffle Tracking"
          expanded={expandedSections.shuffle}
          onToggle={() => toggleSection('shuffle')}
        >
          <Text style={styles.sectionTitle}>What is Shuffle Tracking?</Text>
          <Text style={styles.paragraph}>
            Shuffle tracking is an advanced technique where you track segments of cards (usually high-card rich or
            low-card rich "slugs") through the shuffle. If you can identify where these slugs end up after the shuffle,
            you can increase your bets when you know high-value cards are about to be dealt.
          </Text>

          <Text style={styles.sectionTitle}>How It Works</Text>
          <Text style={styles.paragraph}>
            During play, you track specific sections of the discard tray. When you notice a favorable slug
            (lots of high cards), you mentally note its position. During the shuffle, you follow where that
            slug moves. After the shuffle, you cut the cards to place your favorable slug at the top of the shoe.
          </Text>
        </CollapsibleSection>

        <CollapsibleSection
          title="Ace Sequencer"
          expanded={expandedSections.ace}
          onToggle={() => toggleSection('ace')}
        >
          <Text style={styles.paragraph}>
            Track the last 10 cards dealt to identify if the next round will have a high concentration of Aces.
            If 6 or more of the last 10 cards are high cards (10, J, Q, K, A), the next round is likely to have many Aces.
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Enter Card (e.g., AS, 10H, KD)</Text>
            <TextInput
              style={styles.input}
              value={inputCard}
              onChangeText={(text) => {
                setInputCard(text);
                if (cardError) setCardError('');
              }}
              placeholder="AS"
              maxLength={3}
              autoCapitalize="characters"
            />
            {cardError ? <Text style={styles.errorText}>{cardError}</Text> : null}
            <TouchableOpacity
              style={styles.addButton}
              onPress={addCardToSequence}
              disabled={sequenceCards.length >= 10}
            >
              <Text style={styles.buttonText}>Add Card</Text>
            </TouchableOpacity>
          </View>

          {sequenceCards.length > 0 && (
            <View style={styles.sequenceBox}>
              <View style={styles.sequenceHeader}>
                <Text style={styles.sequenceTitle}>Last {sequenceCards.length} Cards:</Text>
                <TouchableOpacity onPress={clearSequence}>
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.cardList}>
                {sequenceCards.map((card, index) => (
                  <View key={index} style={styles.cardTag}>
                    <Text style={styles.cardText}>{card}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.resultText}>
                High Cards: {countHighCards()} / {sequenceCards.length}
              </Text>
              <Text style={[styles.resultText, isGoodSequence() && styles.successText]}>
                {isGoodSequence() ? 'Good Sequence - High Ace Concentration Likely' : 'Not Enough High Cards'}
              </Text>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Cut Card Position (from back)</Text>
            <TextInput
              style={styles.input}
              value={cutCardPosition}
              onChangeText={setCutCardPosition}
              keyboardType="numeric"
              placeholder="52"
            />
            <Text style={styles.resultText}>
              Penetration: {calculatePenetration()}%
            </Text>
          </View>
        </CollapsibleSection>

        <CollapsibleSection
          title="Wonging"
          expanded={expandedSections.wonging}
          onToggle={() => toggleSection('wonging')}
        >
          <Text style={styles.sectionTitle}>What is Wonging?</Text>
          <Text style={styles.paragraph}>
            Wonging (named after Stanford Wong) is the practice of back-counting - watching the game without playing
            until the count becomes favorable, then joining the game.
          </Text>
          <Text style={styles.paragraph}>
            This technique reduces your hours of play while maintaining a high average edge, but it's obvious to casino
            surveillance and can result in being asked to leave.
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
    marginBottom: 8,
  },
  errorText: {
    color: '#f44336',
    fontSize: 14,
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: '#FF004D',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  sequenceBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sequenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sequenceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  clearText: {
    color: '#FF004D',
    fontSize: 14,
    fontWeight: '600',
  },
  cardList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  cardTag: {
    backgroundColor: '#e8f5e9',
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  resultText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  successText: {
    color: '#4caf50',
    fontWeight: '600',
  },
});

