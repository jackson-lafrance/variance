import React, { useState } from 'react';
import Header from '../../components/Header';
import UnifiedSimulation from '../../components/UnifiedSimulation';
import './SimulationPractice.css';

type PracticeMode = 'full' | 'deviations' | 'soft' | 'hard' | 'pairs' | 'doubling' | 'basic';

interface SimulationSettings {
  practiceMode: PracticeMode;
  countingEnabled: boolean;
  countCheckFrequency: number;
  deviationsEnabled: boolean;
  animationSpeed: number;
  deckCount: number;
  penetration: number;
}

export default function SimulationPractice() {
  const [settings, setSettings] = useState<SimulationSettings>({
    practiceMode: 'full',
    countingEnabled: true,
    countCheckFrequency: 5,
    deviationsEnabled: true,
    animationSpeed: 1,
    deckCount: 6,
    penetration: 75,
  });

  const handleModeChange = (mode: PracticeMode) => {
    setSettings({ ...settings, practiceMode: mode });
  };

  const handleCountingToggle = () => {
    setSettings({ 
      ...settings, 
      countingEnabled: !settings.countingEnabled,
      deviationsEnabled: !settings.countingEnabled ? settings.deviationsEnabled : false
    });
  };

  const handleDeviationsToggle = () => {
    setSettings({ ...settings, deviationsEnabled: !settings.deviationsEnabled });
  };

  const handleFrequencyChange = (freq: number) => {
    setSettings({ ...settings, countCheckFrequency: freq });
  };

  const handleSpeedChange = (speed: number) => {
    setSettings({ ...settings, animationSpeed: speed });
  };

  const handleDeckCountChange = (count: number) => {
    setSettings({ ...settings, deckCount: count });
  };

  const handlePenetrationChange = (penetration: number) => {
    setSettings({ ...settings, penetration });
  };

  return (
    <div className="simulation-practice-page">
      <div className="simulation-practice-header">
        <Header />
        <p className="simulation-practice-subtitle">
          Master blackjack with our comprehensive practice simulator. Customize your training to focus on specific skills
          and track your progress in real-time.
        </p>
      </div>

      <div className="simulation-practice-content">
        <div className="settings-panel">
          <h3 className="settings-title">Practice Settings</h3>
          
          <div className="settings-section">
            <h4>Practice Mode</h4>
            <div className="settings-options">
              <button 
                className={`settings-button ${settings.practiceMode === 'full' ? 'active' : ''}`}
                onClick={() => handleModeChange('full')}
              >
                Full Game
              </button>
              <button 
                className={`settings-button ${settings.practiceMode === 'basic' ? 'active' : ''}`}
                onClick={() => handleModeChange('basic')}
              >
                Basic Strategy Only
              </button>
              <button 
                className={`settings-button ${settings.practiceMode === 'deviations' ? 'active' : ''}`}
                onClick={() => handleModeChange('deviations')}
              >
                Deviations Only
              </button>
              <button 
                className={`settings-button ${settings.practiceMode === 'soft' ? 'active' : ''}`}
                onClick={() => handleModeChange('soft')}
              >
                Soft Hands Only
              </button>
              <button 
                className={`settings-button ${settings.practiceMode === 'hard' ? 'active' : ''}`}
                onClick={() => handleModeChange('hard')}
              >
                Hard Hands Only
              </button>
              <button 
                className={`settings-button ${settings.practiceMode === 'pairs' ? 'active' : ''}`}
                onClick={() => handleModeChange('pairs')}
              >
                Pair Splitting
              </button>
              <button 
                className={`settings-button ${settings.practiceMode === 'doubling' ? 'active' : ''}`}
                onClick={() => handleModeChange('doubling')}
              >
                Doubling Situations
              </button>
            </div>
          </div>

          <div className="settings-section">
            <h4>Counting Features</h4>
            <div className="settings-toggle">
              <label className="toggle-label">
                <input 
                  type="checkbox" 
                  checked={settings.countingEnabled}
                  onChange={handleCountingToggle}
                  className="toggle-checkbox"
                />
                <span className="toggle-slider"></span>
                <span className="toggle-text">Enable Card Counting</span>
              </label>
            </div>
            {settings.countingEnabled && (
              <>
                <div className="settings-toggle">
                  <label className="toggle-label">
                    <input 
                      type="checkbox" 
                      checked={settings.deviationsEnabled}
                      onChange={handleDeviationsToggle}
                      className="toggle-checkbox"
                      disabled={!settings.countingEnabled}
                    />
                    <span className="toggle-slider"></span>
                    <span className="toggle-text">Apply Deviation Plays</span>
                  </label>
                </div>
                <div className="settings-frequency">
                  <label>
                    <span className="frequency-label">Count Check Frequency:</span>
                    <select 
                      value={settings.countCheckFrequency}
                      onChange={(e) => handleFrequencyChange(Number(e.target.value))}
                      className="frequency-select"
                    >
                      <option value={0}>Never</option>
                      <option value={5}>Every 5 hands</option>
                      <option value={10}>Every 10 hands</option>
                      <option value={20}>Every 20 hands</option>
                    </select>
                  </label>
                </div>
              </>
            )}
          </div>

          <div className="settings-section">
            <h4>Animation Speed</h4>
            <div className="settings-frequency">
              <label>
                <span className="frequency-label">Hand Speed:</span>
                <select 
                  value={settings.animationSpeed}
                  onChange={(e) => handleSpeedChange(Number(e.target.value))}
                  className="frequency-select"
                >
                  <option value={0.25}>Very Fast (0.25x)</option>
                  <option value={0.5}>Fast (0.5x)</option>
                  <option value={1}>Normal (1x)</option>
                  <option value={1.5}>Slow (1.5x)</option>
                  <option value={2}>Very Slow (2x)</option>
                </select>
              </label>
            </div>
          </div>

          <div className="settings-section">
            <h4>Shoe Configuration</h4>
            <div className="settings-frequency">
              <label>
                <span className="frequency-label">Number of Decks:</span>
                <select 
                  value={settings.deckCount}
                  onChange={(e) => handleDeckCountChange(Number(e.target.value))}
                  className="frequency-select"
                >
                  <option value={1}>1 Deck</option>
                  <option value={2}>2 Decks</option>
                  <option value={4}>4 Decks</option>
                  <option value={6}>6 Decks</option>
                  <option value={8}>8 Decks</option>
                </select>
              </label>
            </div>
            <div className="settings-frequency">
              <label>
                <span className="frequency-label">Penetration:</span>
                <select 
                  value={settings.penetration}
                  onChange={(e) => handlePenetrationChange(Number(e.target.value))}
                  className="frequency-select"
                >
                  <option value={50}>50%</option>
                  <option value={60}>60%</option>
                  <option value={70}>70%</option>
                  <option value={75}>75%</option>
                  <option value={80}>80%</option>
                  <option value={85}>85%</option>
                  <option value={90}>90%</option>
                </select>
              </label>
            </div>
          </div>

          <div className="settings-info">
            <h4>Current Mode:</h4>
            <p className="mode-description">
              {settings.practiceMode === 'full' && 'Practice complete blackjack gameplay with all possible hands.'}
              {settings.practiceMode === 'basic' && 'Practice basic strategy without counting or deviations.'}
              {settings.practiceMode === 'deviations' && 'Practice hands from the Illustrious 18 deviations.'}
              {settings.practiceMode === 'soft' && 'Practice hands with Aces counted as 11.'}
              {settings.practiceMode === 'hard' && 'Practice hard total hands without Aces.'}
              {settings.practiceMode === 'pairs' && 'Practice pair splitting decisions.'}
              {settings.practiceMode === 'doubling' && 'Practice doubling down situations.'}
            </p>
            {settings.countingEnabled && (
              <p className="counting-note">
                <strong>Card counting enabled:</strong> Running count will be tracked.
                {settings.deviationsEnabled && ' Correct plays will adjust based on the count.'}
              </p>
            )}
          </div>
        </div>

        <UnifiedSimulation settings={settings} />
      </div>
    </div>
  );
}
