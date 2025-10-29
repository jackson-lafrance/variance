import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  setDoc,
  getDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Header from '../../components/Header';
import './Dashboard.css';

interface CasinoSession {
  id?: string;
  date: string;
  casino: string;
  hoursPlayed: number;
  startingBankroll: number;
  endingBankroll: number;
  profit: number;
  handsPlayed?: number;
  notes?: string;
  userId: string;
  timestamp: number;
}

interface UserStats {
  totalBankroll: number;
  totalProfit: number;
  totalSessions: number;
  totalHours: number;
}

export default function Dashboard() {
  const { currentUser, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<CasinoSession[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalBankroll: 0,
    totalProfit: 0,
    totalSessions: 0,
    totalHours: 0
  });
  const [loading, setLoading] = useState(true);
  const [showAddSession, setShowAddSession] = useState(false);
  const [showAddBankroll, setShowAddBankroll] = useState(false);

  // Form states
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
  const [casino, setCasino] = useState('');
  const [hoursPlayed, setHoursPlayed] = useState('');
  const [startingBankroll, setStartingBankroll] = useState('');
  const [endingBankroll, setEndingBankroll] = useState('');
  const [handsPlayed, setHandsPlayed] = useState('');
  const [notes, setNotes] = useState('');
  const [bankrollToAdd, setBankrollToAdd] = useState('');

  useEffect(() => {
    if (authLoading) return;
    
    if (!currentUser) {
      navigate('/');
      return;
    }

    loadData();
  }, [currentUser, authLoading]);

  const loadData = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      
      // Load user stats
      const statsDoc = await getDoc(doc(db, 'userStats', currentUser.uid));
      if (statsDoc.exists()) {
        setStats(statsDoc.data() as UserStats);
      } else {
        // Initialize stats if they don't exist
        await setDoc(doc(db, 'userStats', currentUser.uid), {
          totalBankroll: 0,
          totalProfit: 0,
          totalSessions: 0,
          totalHours: 0
        });
        setStats({ totalBankroll: 0, totalProfit: 0, totalSessions: 0, totalHours: 0 });
      }

      // Load sessions
      const sessionsQuery = query(
        collection(db, 'casinoSessions'),
        where('userId', '==', currentUser.uid),
        orderBy('timestamp', 'desc')
      );
      const sessionsSnapshot = await getDocs(sessionsQuery);
      const loadedSessions: CasinoSession[] = [];
      sessionsSnapshot.forEach((doc) => {
        loadedSessions.push({ id: doc.id, ...doc.data() } as CasinoSession);
      });
      setSessions(loadedSessions);
    } catch (error: any) {
      // Only show error if it's not a missing index error (which is expected initially)
      if (error.code === 'failed-precondition') {
        // This is expected - Firestore needs an index for the query
        // User can create it via the error link, or we can continue without it
        console.log('Firestore index needed - this is normal');
        setSessions([]);
      } else if (error.code !== 'permission-denied') {
        console.error('Dashboard load error:', error);
        // Don't show alert for expected errors
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const starting = parseFloat(startingBankroll);
    const ending = parseFloat(endingBankroll);
    const hours = parseFloat(hoursPlayed);

    // Validation
    if (isNaN(starting) || isNaN(ending) || isNaN(hours)) {
      alert('Please enter valid numbers for all required fields');
      return;
    }

    if (starting <= 0 || ending < 0) {
      alert('Bankroll amounts must be positive numbers');
      return;
    }

    if (hours <= 0 || hours > 24) {
      alert('Hours played must be between 0 and 24');
      return;
    }

    const sessionDateObj = new Date(sessionDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (sessionDateObj > today) {
      alert('Session date cannot be in the future');
      return;
    }

    if (handsPlayed && (isNaN(parseInt(handsPlayed)) || parseInt(handsPlayed) < 0)) {
      alert('Hands played must be a valid positive number');
      return;
    }

    const profit = ending - starting;

    const newSession: Omit<CasinoSession, 'id'> = {
      date: sessionDate,
      casino: casino.trim(),
      hoursPlayed: hours,
      startingBankroll: starting,
      endingBankroll: ending,
      profit,
      handsPlayed: handsPlayed ? parseInt(handsPlayed) : undefined,
      notes: notes.trim() || undefined,
      userId: currentUser.uid,
      timestamp: sessionDateObj.getTime()
    };

    try {
      await addDoc(collection(db, 'casinoSessions'), newSession);

      // Update user stats
      const newStats = {
        totalBankroll: stats.totalBankroll + profit,
        totalProfit: stats.totalProfit + profit,
        totalSessions: stats.totalSessions + 1,
        totalHours: stats.totalHours + hours
      };

      await setDoc(doc(db, 'userStats', currentUser.uid), newStats);
      
      // Reset form
      setCasino('');
      setHoursPlayed('');
      setStartingBankroll('');
      setEndingBankroll('');
      setHandsPlayed('');
      setNotes('');
      setShowAddSession(false);

      // Reload data
      await loadData();
    } catch (error) {
      alert('Failed to add session. Please check your connection and try again.');
    }
  };

  const handleAddBankroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !bankrollToAdd) return;

    const amount = parseFloat(bankrollToAdd);

    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid positive amount');
      return;
    }

    try {
      const newStats = {
        ...stats,
        totalBankroll: stats.totalBankroll + amount
      };

      await setDoc(doc(db, 'userStats', currentUser.uid), newStats);
      setStats(newStats);
      setBankrollToAdd('');
      setShowAddBankroll(false);
    } catch (error) {
      alert('Failed to add bankroll. Please check your connection and try again.');
    }
  };

  const handleDeleteSession = async (sessionId: string, sessionProfit: number, sessionHours: number) => {
    if (!currentUser) return;
    
    if (!confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'casinoSessions', sessionId));

      // Update user stats
      const newStats = {
        totalBankroll: stats.totalBankroll - sessionProfit,
        totalProfit: stats.totalProfit - sessionProfit,
        totalSessions: stats.totalSessions - 1,
        totalHours: Math.max(0, stats.totalHours - sessionHours)
      };

      await setDoc(doc(db, 'userStats', currentUser.uid), newStats);
      
      // Reload data
      await loadData();
    } catch (error) {
      alert('Failed to delete session. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      alert('Failed to log out. Please try again.');
    }
  };

  // Prepare chart data
  const chartData = sessions
    .slice()
    .reverse()
    .reduce((acc, session, index) => {
      const prevTotal = index > 0 ? acc[index - 1].total : (stats.totalBankroll - stats.totalProfit);
      acc.push({
        date: new Date(session.timestamp).toLocaleDateString(),
        total: prevTotal + session.profit,
        profit: session.profit
      });
      return acc;
    }, [] as any[]);

  if (loading || authLoading) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header-section">
        <Header />
        <div className="dashboard-user-info">
          <span className="dashboard-welcome">Welcome, {currentUser?.displayName}!</span>
          <button onClick={handleLogout} className="dashboard-logout-button">
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Bankroll</div>
            <div className="stat-value">${stats.totalBankroll.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Profit/Loss</div>
            <div className={`stat-value ${stats.totalProfit >= 0 ? 'profit' : 'loss'}`}>
              {stats.totalProfit >= 0 ? '+' : ''}${stats.totalProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Sessions</div>
            <div className="stat-value">{stats.totalSessions}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Hours</div>
            <div className="stat-value">{stats.totalHours.toFixed(1)}</div>
          </div>
        </div>

        <div className="dashboard-actions">
          <button onClick={() => setShowAddSession(true)} className="dashboard-action-button primary">
            + Add Casino Session
          </button>
          <button onClick={() => setShowAddBankroll(true)} className="dashboard-action-button secondary">
            💰 Add to Bankroll
          </button>
        </div>

        {sessions.length > 0 && (
          <div className="dashboard-chart-section">
            <h2>Bankroll Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#2196f3" strokeWidth={2} name="Total Bankroll" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="dashboard-sessions-section">
          <h2>Session History</h2>
          {sessions.length === 0 ? (
            <p className="no-sessions">No sessions yet. Add your first casino session above!</p>
          ) : (
            <div className="sessions-list">
              {sessions.map((session) => (
                <div key={session.id} className="session-card">
                  <div className="session-header">
                    <div className="session-date">{new Date(session.timestamp).toLocaleDateString()}</div>
                    <div className={`session-profit ${session.profit >= 0 ? 'profit' : 'loss'}`}>
                      {session.profit >= 0 ? '+' : ''}${session.profit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div className="session-details">
                    <div className="session-detail">
                      <span className="detail-label">Casino:</span>
                      <span className="detail-value">{session.casino}</span>
                    </div>
                    <div className="session-detail">
                      <span className="detail-label">Hours Played:</span>
                      <span className="detail-value">{session.hoursPlayed.toFixed(1)}</span>
                    </div>
                    <div className="session-detail">
                      <span className="detail-label">Starting:</span>
                      <span className="detail-value">${session.startingBankroll.toFixed(2)}</span>
                    </div>
                    <div className="session-detail">
                      <span className="detail-label">Ending:</span>
                      <span className="detail-value">${session.endingBankroll.toFixed(2)}</span>
                    </div>
                    {session.handsPlayed && (
                      <div className="session-detail">
                        <span className="detail-label">Hands Played:</span>
                        <span className="detail-value">{session.handsPlayed}</span>
                      </div>
                    )}
                  </div>
                  {session.notes && (
                    <div className="session-notes">
                      <strong>Notes:</strong> {session.notes}
                    </div>
                  )}
                  <button 
                    className="session-delete-button"
                    onClick={() => handleDeleteSession(session.id!, session.profit, session.hoursPlayed)}
                    title="Delete this session"
                  >
                    Delete Session
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showAddSession && (
        <div className="modal-overlay" onClick={() => setShowAddSession(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add Casino Session</h2>
            <form onSubmit={handleAddSession}>
              <div className="form-row">
                <div className="form-field">
                  <label>Date</label>
                  <input
                    type="date"
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    required
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="form-field">
                  <label>Casino Name</label>
                  <input
                    type="text"
                    value={casino}
                    onChange={(e) => setCasino(e.target.value)}
                    placeholder="MGM Grand"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Hours Played</label>
                  <input
                    type="number"
                    step="0.5"
                    value={hoursPlayed}
                    onChange={(e) => setHoursPlayed(e.target.value)}
                    placeholder="3.5"
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Hands Played (optional)</label>
                  <input
                    type="number"
                    value={handsPlayed}
                    onChange={(e) => setHandsPlayed(e.target.value)}
                    placeholder="250"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Starting Bankroll ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={startingBankroll}
                    onChange={(e) => setStartingBankroll(e.target.value)}
                    placeholder="1000.00"
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Ending Bankroll ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={endingBankroll}
                    onChange={(e) => setEndingBankroll(e.target.value)}
                    placeholder="1250.00"
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Good penetration, friendly dealer..."
                  rows={3}
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddSession(false)} className="modal-cancel">
                  Cancel
                </button>
                <button type="submit" className="modal-submit">
                  Add Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddBankroll && (
        <div className="modal-overlay" onClick={() => setShowAddBankroll(false)}>
          <div className="modal-content small" onClick={(e) => e.stopPropagation()}>
            <h2>Add to Bankroll</h2>
            <form onSubmit={handleAddBankroll}>
              <div className="form-field">
                <label>Amount to Add ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={bankrollToAdd}
                  onChange={(e) => setBankrollToAdd(e.target.value)}
                  placeholder="500.00"
                  required
                />
              </div>
              <p className="modal-help-text">
                This increases your total bankroll investment. Use this when you add more money to your card counting fund.
              </p>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddBankroll(false)} className="modal-cancel">
                  Cancel
                </button>
                <button type="submit" className="modal-submit">
                  Add Bankroll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


