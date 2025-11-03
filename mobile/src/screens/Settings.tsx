import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../services/AuthContext';
import { useDarkMode } from '../contexts/DarkModeContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

interface UserSettings {
  darkMode: boolean;
  defaultDeckCount: number;
  defaultPenetration: number;
  enableNotifications: boolean;
  practiceReminders: boolean;
  autoSaveScores: boolean;
}

export default function Settings() {
  const navigation = useNavigation();
  const { currentUser } = useAuth();
  const { isDark, toggleDarkMode } = useDarkMode();
  const styles = getStyles(isDark);
  
  const [settings, setSettings] = useState<UserSettings>({
    darkMode: isDark,
    defaultDeckCount: 6,
    defaultPenetration: 75,
    enableNotifications: false,
    practiceReminders: false,
    autoSaveScores: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      Alert.alert('Error', 'Please sign in to access settings');
      navigation.goBack();
      return;
    }
    loadSettings();
  }, [currentUser]);

  const loadSettings = async () => {
    if (!currentUser) return;
    try {
      const settingsDoc = await getDoc(doc(db, 'userSettings', currentUser.uid));
      if (settingsDoc.exists()) {
        setSettings(prev => ({ ...prev, ...settingsDoc.data() }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!currentUser) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'userSettings', currentUser.uid), settings);
      Alert.alert('Success', 'Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    if (key === 'darkMode') {
      toggleDarkMode();
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading settings...</Text>
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
          <Text style={styles.title}>Settings</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <Switch
              value={settings.darkMode}
              onValueChange={(value) => updateSetting('darkMode', value)}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Simulation Defaults</Text>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Default Deck Count:</Text>
            <TextInput
              style={styles.numberInput}
              value={settings.defaultDeckCount.toString()}
              onChangeText={(text) => {
                const num = parseInt(text) || 6;
                if (num >= 1 && num <= 8) {
                  updateSetting('defaultDeckCount', num);
                }
              }}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Default Penetration (%):</Text>
            <TextInput
              style={styles.numberInput}
              value={settings.defaultPenetration.toString()}
              onChangeText={(text) => {
                const num = parseInt(text) || 75;
                if (num >= 50 && num <= 90) {
                  updateSetting('defaultPenetration', num);
                }
              }}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Practice & Scores</Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Auto-save Scores</Text>
            <Switch
              value={settings.autoSaveScores}
              onValueChange={(value) => updateSetting('autoSaveScores', value)}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Enable Notifications</Text>
            <Switch
              value={settings.enableNotifications}
              onValueChange={(value) => updateSetting('enableNotifications', value)}
            />
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Practice Reminders</Text>
            <Switch
              value={settings.practiceReminders}
              onValueChange={(value) => updateSetting('practiceReminders', value)}
              disabled={!settings.enableNotifications}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={saveSettings}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? 'Saving...' : 'Save Settings'}
          </Text>
        </TouchableOpacity>
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
    color: '#2196f3',
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
  section: {
    backgroundColor: isDark ? '#2a2a2a' : '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: isDark ? '#e0e0e0' : '#333',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#444' : '#e0e0e0',
  },
  settingLabel: {
    fontSize: 16,
    color: isDark ? '#e0e0e0' : '#333',
    flex: 1,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#444' : '#e0e0e0',
  },
  inputLabel: {
    fontSize: 16,
    color: isDark ? '#e0e0e0' : '#333',
    flex: 1,
  },
  numberInput: {
    backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5',
    borderWidth: 1,
    borderColor: isDark ? '#444' : '#ddd',
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    color: isDark ? '#e0e0e0' : '#333',
    width: 80,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#2196f3',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});


