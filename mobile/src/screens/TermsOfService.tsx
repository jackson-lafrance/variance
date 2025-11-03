import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDarkMode } from '../contexts/DarkModeContext';

export default function TermsOfService() {
  const navigation = useNavigation();
  const { isDark } = useDarkMode();
  const styles = getStyles(isDark);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Terms of Service</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.lastUpdated}>Last Updated: {new Date().toLocaleDateString()}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>1. Acceptance of Terms</Text>
          <Text style={styles.text}>
            By accessing and using Variance ("the Service"), you accept and agree to be bound by the 
            terms and provision of this agreement. If you do not agree, please do not use this service.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>2. Description of Service</Text>
          <Text style={styles.text}>
            Variance is a blackjack training application designed to help users learn and practice 
            card counting strategies. The Service provides educational content, simulations, and 
            tools for training purposes only.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>3. Disclaimer - Gambling and Legal</Text>
          <Text style={styles.subHeading}>3.1 Educational Purpose Only</Text>
          <Text style={styles.text}>
            Variance is provided for educational and training purposes only. The Service is designed 
            to help users understand blackjack strategy and card counting techniques. It is not 
            intended to be used as gambling advice or to guarantee winnings.
          </Text>
          
          <Text style={styles.subHeading}>3.2 No Gambling Guarantees</Text>
          <Text style={styles.text}>
            We make no representations or warranties regarding the effectiveness of any strategies. 
            Gambling involves risk, and past performance does not guarantee future results.
          </Text>

          <Text style={styles.subHeading}>3.3 Legal Compliance</Text>
          <Text style={styles.text}>
            Users are responsible for ensuring that their use of the Service complies with all 
            applicable laws and regulations in their jurisdiction.
          </Text>

          <Text style={styles.subHeading}>3.4 Age Restrictions</Text>
          <Text style={styles.text}>
            You must be at least 18 years old (or the legal age of majority in your jurisdiction) 
            to use this Service.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>4. User Accounts</Text>
          <Text style={styles.text}>
            When you create an account, you must provide accurate information. You are responsible 
            for safeguarding your password and for all activities that occur under your account.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>5. Limitation of Liability</Text>
          <Text style={styles.text}>
            In no event shall Variance be liable for any indirect, incidental, special, consequential, 
            or punitive damages resulting from your use of the Service. Variance is provided "as is" 
            without any warranties.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>6. Contact Information</Text>
          <Text style={styles.text}>
            If you have any questions about these Terms of Service, please contact us:
          </Text>
          <TouchableOpacity onPress={() => Linking.openURL('mailto:legal@variance.app')}>
            <Text style={styles.link}>legal@variance.app</Text>
          </TouchableOpacity>
        </View>
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
    marginBottom: 24,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: isDark ? '#e0e0e0' : '#1A1A1A',
    marginBottom: 8,
  },
  section: {
    marginBottom: 24,
  },
  lastUpdated: {
    fontSize: 14,
    color: isDark ? '#b0b0b0' : '#7A7A7A',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 12,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: '600',
    color: isDark ? '#e0e0e0' : '#1A1A1A',
    marginTop: 16,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: isDark ? '#b0b0b0' : '#7A7A7A',
    marginBottom: 12,
  },
  bullet: {
    fontSize: 16,
    lineHeight: 24,
    color: isDark ? '#b0b0b0' : '#7A7A7A',
    marginLeft: 16,
    marginBottom: 8,
  },
  link: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '600',
    marginTop: 8,
  },
});

