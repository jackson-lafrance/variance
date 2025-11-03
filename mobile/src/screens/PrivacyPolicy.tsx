import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDarkMode } from '../contexts/DarkModeContext';

export default function PrivacyPolicy() {
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
          <Text style={styles.title}>Privacy Policy</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.lastUpdated}>Last Updated: {new Date().toLocaleDateString()}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>1. Introduction</Text>
          <Text style={styles.text}>
            Welcome to Variance ("we," "our," or "us"). We are committed to protecting your privacy. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
            when you use our mobile application and website.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>2. Information We Collect</Text>
          <Text style={styles.subHeading}>2.1 Information You Provide</Text>
          <Text style={styles.text}>We collect information that you provide directly to us, including:</Text>
          <Text style={styles.bullet}>• Account Information: Email address, password, and display name</Text>
          <Text style={styles.bullet}>• Session Data: Casino session details and practice records</Text>
          <Text style={styles.bullet}>• User Preferences: Settings and preferences you configure</Text>
          
          <Text style={styles.subHeading}>2.2 Automatically Collected Information</Text>
          <Text style={styles.text}>When you use our services, we automatically collect:</Text>
          <Text style={styles.bullet}>• Usage Data: How you interact with the app</Text>
          <Text style={styles.bullet}>• Device Information: Device type and operating system</Text>
          <Text style={styles.bullet}>• Analytics Data: Performance metrics and error reports</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>3. How We Use Your Information</Text>
          <Text style={styles.text}>We use the information we collect to:</Text>
          <Text style={styles.bullet}>• Provide, maintain, and improve our services</Text>
          <Text style={styles.bullet}>• Process your transactions and manage your account</Text>
          <Text style={styles.bullet}>• Send you technical notices and support messages</Text>
          <Text style={styles.bullet}>• Monitor and analyze usage patterns</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>4. Data Storage and Security</Text>
          <Text style={styles.text}>
            Your data is stored securely using Firebase, a service provided by Google. We implement 
            appropriate technical measures to protect your personal information. However, no method 
            of transmission over the internet is 100% secure.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>5. Third-Party Services</Text>
          <Text style={styles.text}>
            We use Firebase (Google) for authentication, database storage, and analytics. These services 
            have their own privacy policies. We encourage you to review their privacy policies.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>6. Your Rights</Text>
          <Text style={styles.text}>You have the right to:</Text>
          <Text style={styles.bullet}>• Access and receive a copy of your personal data</Text>
          <Text style={styles.bullet}>• Request deletion of your personal data</Text>
          <Text style={styles.bullet}>• Object to processing of your personal data</Text>
          <Text style={styles.text}>
            To exercise these rights, please contact us at privacy@variance.app
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>7. Contact Us</Text>
          <Text style={styles.text}>
            If you have any questions about this Privacy Policy, please contact us:
          </Text>
          <TouchableOpacity onPress={() => Linking.openURL('mailto:privacy@variance.app')}>
            <Text style={styles.link}>privacy@variance.app</Text>
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

