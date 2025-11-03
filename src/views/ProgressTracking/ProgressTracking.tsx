import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserPracticeSessions, PracticeSession } from '../../utils/practiceSessions';
import { getUserHighScores, HighScore } from '../../utils/highScores';
import Header from '../../components/Header';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import './ProgressTracking.css';

export default function ProgressTracking() {
  const { currentUser } = useAuth();
  const [practiceSessions, setPracticeSessions] = useState<PracticeSession[]>([]);
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  const [selectedSimulation, setSelectedSimulation] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser, selectedSimulation]);

  const loadData = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const sessions = selectedSimulation === 'all'
        ? await getUserPracticeSessions(currentUser.uid)
        : await getUserPracticeSessions(currentUser.uid, selectedSimulation);
      const scores = selectedSimulation === 'all'
        ? await getUserHighScores(currentUser.uid)
        : await getUserHighScores(currentUser.uid, selectedSimulation);
      
      setPracticeSessions(sessions);
      setHighScores(scores);
    } catch (error) {
      console.error('Error loading progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const prepareAccuracyData = () => {
    const sortedSessions = [...practiceSessions].sort((a, b) => a.timestamp - b.timestamp);
    return sortedSessions.map((session, index) => ({
      session: index + 1,
      date: formatDate(session.timestamp),
      accuracy: session.accuracy,
      handsPlayed: session.handsPlayed || 0,
    }));
  };

  const prepareScoreData = () => {
    const sortedScores = [...highScores].sort((a, b) => a.timestamp - b.timestamp);
    return sortedScores.map((score, index) => ({
      session: index + 1,
      date: formatDate(score.timestamp),
      score: score.score,
      accuracy: score.accuracy,
    }));
  };

  const calculateStats = () => {
    if (practiceSessions.length === 0) return null;

    const accuracies = practiceSessions.map(s => s.accuracy);
    const avgAccuracy = accuracies.reduce((a, b) => a + b, 0) / accuracies.length;
    const bestAccuracy = Math.max(...accuracies);
    const worstAccuracy = Math.min(...accuracies);
    const totalHands = practiceSessions.reduce((sum, s) => sum + (s.handsPlayed || 0), 0);
    const totalDuration = practiceSessions.reduce((sum, s) => sum + (s.duration || 0), 0);

    const recentSessions = practiceSessions.slice(0, 10);
    const recentAccuracies = recentSessions.map(s => s.accuracy);
    const recentAvg = recentAccuracies.reduce((a, b) => a + b, 0) / recentAccuracies.length;

    const olderSessions = practiceSessions.slice(10);
    const olderAvg = olderSessions.length > 0
      ? olderSessions.map(s => s.accuracy).reduce((a, b) => a + b, 0) / olderSessions.length
      : avgAccuracy;

    return {
      avgAccuracy: Math.round(avgAccuracy),
      bestAccuracy,
      worstAccuracy,
      totalHands,
      totalDuration,
      improvement: recentAvg - olderAvg,
      recentAvg: Math.round(recentAvg),
    };
  };

  const accuracyData = prepareAccuracyData();
  const scoreData = prepareScoreData();
  const stats = calculateStats();

  const simulationTypes = [
    { value: 'all', label: 'All Simulations' },
    { value: 'basic-strategy', label: 'Basic Strategy' },
    { value: 'counting', label: 'Card Counting' },
    { value: 'deviations', label: 'Deviations' },
    { value: 'unified', label: 'Unified' },
    { value: 'card-speed', label: 'Card Speed' },
  ];

  if (loading) {
    return (
      <div className="progress-tracking-page">
        <Header />
        <div className="progress-loading">Loading progress data...</div>
      </div>
    );
  }

  return (
    <div className="progress-tracking-page">
      <Header />
      
      <div className="progress-content">
        <div className="progress-header">
          <h1 className="progress-title">Progress Tracking</h1>
          <p className="progress-subtitle">Track your improvement over time</p>
        </div>

        <div className="progress-filter">
          <label htmlFor="simulation-filter">Filter by Simulation:</label>
          <select
            id="simulation-filter"
            value={selectedSimulation}
            onChange={(e) => setSelectedSimulation(e.target.value)}
            className="progress-select"
          >
            {simulationTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {stats && (
          <div className="progress-stats-grid">
            <div className="progress-stat-card">
              <div className="progress-stat-label">Average Accuracy</div>
              <div className="progress-stat-value">{stats.avgAccuracy}%</div>
            </div>
            <div className="progress-stat-card">
              <div className="progress-stat-label">Best Accuracy</div>
              <div className="progress-stat-value">{stats.bestAccuracy}%</div>
            </div>
            <div className="progress-stat-card">
              <div className="progress-stat-label">Total Hands Played</div>
              <div className="progress-stat-value">{stats.totalHands.toLocaleString()}</div>
            </div>
            <div className="progress-stat-card">
              <div className="progress-stat-label">Total Practice Time</div>
              <div className="progress-stat-value">
                {Math.floor(stats.totalDuration / 60)}m {stats.totalDuration % 60}s
              </div>
            </div>
            <div className="progress-stat-card">
              <div className="progress-stat-label">Recent Average</div>
              <div className="progress-stat-value">{stats.recentAvg}%</div>
            </div>
            <div className="progress-stat-card">
              <div className="progress-stat-label">Improvement</div>
              <div className={`progress-stat-value ${stats.improvement >= 0 ? 'positive' : 'negative'}`}>
                {stats.improvement >= 0 ? '+' : ''}{stats.improvement.toFixed(1)}%
              </div>
            </div>
          </div>
        )}

        {accuracyData.length > 0 && (
          <div className="progress-chart-section">
            <h2 className="progress-chart-title">Accuracy Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={accuracyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="session" 
                  label={{ value: 'Session Number', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  label={{ value: 'Accuracy (%)', angle: -90, position: 'insideLeft' }}
                  domain={[0, 100]}
                />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="#2196f3" 
                  strokeWidth={2}
                  name="Accuracy (%)"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {scoreData.length > 0 && (
          <div className="progress-chart-section">
            <h2 className="progress-chart-title">High Scores Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scoreData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="session" 
                  label={{ value: 'Session Number', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  label={{ value: 'Score', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" fill="#4caf50" name="Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {practiceSessions.length === 0 && (
          <div className="progress-empty">
            <p>No practice sessions found. Start practicing to track your progress!</p>
          </div>
        )}

        {practiceSessions.length > 0 && (
          <div className="progress-sessions-list">
            <h2 className="progress-chart-title">Recent Sessions</h2>
            <div className="progress-sessions-table">
              <div className="progress-table-header">
                <div className="progress-table-cell">Date</div>
                <div className="progress-table-cell">Simulation</div>
                <div className="progress-table-cell">Accuracy</div>
                <div className="progress-table-cell">Correct</div>
                <div className="progress-table-cell">Incorrect</div>
                <div className="progress-table-cell">Hands</div>
                <div className="progress-table-cell">Duration</div>
              </div>
              {practiceSessions.slice(0, 20).map((session) => (
                <div key={session.id} className="progress-table-row">
                  <div className="progress-table-cell">{formatDate(session.timestamp)}</div>
                  <div className="progress-table-cell">{session.simulationType}</div>
                  <div className="progress-table-cell">{session.accuracy}%</div>
                  <div className="progress-table-cell correct">{session.correctCount}</div>
                  <div className="progress-table-cell incorrect">{session.incorrectCount}</div>
                  <div className="progress-table-cell">{session.handsPlayed || '-'}</div>
                  <div className="progress-table-cell">
                    {session.duration ? `${Math.floor(session.duration / 60)}m ${session.duration % 60}s` : '-'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


