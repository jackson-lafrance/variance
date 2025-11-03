// Enhanced Dashboard utilities
export interface AdvancedStats {
  winRate: number;
  avgProfitPerSession: number;
  avgHourlyRate: number;
  roi: number;
  bestSession: number;
  worstSession: number;
  avgHoursPerSession: number;
  winningSessions: number;
  losingSessions: number;
}

export function calculateAdvancedStats(sessions: any[], totalHours: number): AdvancedStats {
  if (sessions.length === 0) {
    return {
      winRate: 0,
      avgProfitPerSession: 0,
      avgHourlyRate: 0,
      roi: 0,
      bestSession: 0,
      worstSession: 0,
      avgHoursPerSession: 0,
      winningSessions: 0,
      losingSessions: 0,
    };
  }

  const winningSessions = sessions.filter(s => s.profit > 0).length;
  const losingSessions = sessions.filter(s => s.profit < 0).length;
  const totalProfit = sessions.reduce((sum, s) => sum + s.profit, 0);
  const totalStartingBankroll = sessions.reduce((sum, s) => sum + s.startingBankroll, 0);
  const profits = sessions.map(s => s.profit);
  const bestSession = Math.max(...profits);
  const worstSession = Math.min(...profits);

  return {
    winRate: (winningSessions / sessions.length) * 100,
    avgProfitPerSession: totalProfit / sessions.length,
    avgHourlyRate: totalHours > 0 ? totalProfit / totalHours : 0,
    roi: totalStartingBankroll > 0 ? (totalProfit / totalStartingBankroll) * 100 : 0,
    bestSession,
    worstSession,
    avgHoursPerSession: sessions.reduce((sum, s) => sum + s.hoursPlayed, 0) / sessions.length,
    winningSessions,
    losingSessions,
  };
}

export function exportToCSV(sessions: any[]): void {
  const headers = ['Date', 'Casino', 'Hours Played', 'Starting Bankroll', 'Ending Bankroll', 'Profit', 'Hands Played', 'Notes'];
  const rows = sessions.map(session => [
    session.date,
    session.casino,
    session.hoursPlayed,
    session.startingBankroll,
    session.endingBankroll,
    session.profit,
    session.handsPlayed || '',
    session.notes || '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `casino-sessions-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToJSON(sessions: any[]): void {
  const jsonContent = JSON.stringify(sessions, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `casino-sessions-${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


