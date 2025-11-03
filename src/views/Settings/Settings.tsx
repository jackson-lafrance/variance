import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import Header from '../../components/Header';
import './Settings.css';

interface UserSettings {
  darkMode: boolean;
  defaultDeckCount: number;
  defaultPenetration: number;
  enableNotifications: boolean;
  practiceReminders: boolean;
  autoSaveScores: boolean;
}

export default function Settings() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<UserSettings>({
    darkMode: localStorage.getItem('darkMode') === 'true',
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
      navigate('/auth');
      return;
    }
    loadSettings();
  }, [currentUser]);

  const loadSettings = async () => {
    if (!currentUser) return;
    try {
      const settingsDoc = await getDoc(doc(db, 'userSettings', currentUser.uid));
      if (settingsDoc.exists()) {
        setSettings({ ...settings, ...settingsDoc.data() });
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
      
      // Apply dark mode immediately
      if (settings.darkMode) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'true');
      } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'false');
      }
      
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="settings-page">
        <Header />
        <div className="settings-loading">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <Header />
      <div className="settings-content">
        <h1>Settings</h1>

        <div className="settings-section">
          <h2>Appearance</h2>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={(e) => updateSetting('darkMode', e.target.checked)}
              />
              Dark Mode
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h2>Simulation Defaults</h2>
          <div className="setting-item">
            <label>
              Default Deck Count:
              <input
                type="number"
                min="1"
                max="8"
                value={settings.defaultDeckCount}
                onChange={(e) => updateSetting('defaultDeckCount', parseInt(e.target.value))}
              />
            </label>
          </div>
          <div className="setting-item">
            <label>
              Default Penetration (%):
              <input
                type="number"
                min="50"
                max="90"
                value={settings.defaultPenetration}
                onChange={(e) => updateSetting('defaultPenetration', parseInt(e.target.value))}
              />
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h2>Practice & Scores</h2>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={settings.autoSaveScores}
                onChange={(e) => updateSetting('autoSaveScores', e.target.checked)}
              />
              Automatically save high scores
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h2>Notifications</h2>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={settings.enableNotifications}
                onChange={(e) => updateSetting('enableNotifications', e.target.checked)}
              />
              Enable notifications
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={settings.practiceReminders}
                onChange={(e) => updateSetting('practiceReminders', e.target.checked)}
                disabled={!settings.enableNotifications}
              />
              Practice reminders
            </label>
          </div>
        </div>

        <div className="settings-actions">
          <button className="settings-save-button" onClick={saveSettings} disabled={saving}>
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

        <div className="settings-footer">
          <Link to="/privacy" className="footer-link">Privacy Policy</Link>
          <span className="footer-separator">•</span>
          <Link to="/terms" className="footer-link">Terms of Service</Link>
        </div>
      </div>
    </div>
  );
}


