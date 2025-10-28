import React from 'react';
import './StrategyTable.css';

interface Legend {
  [key: string]: string;
}

interface TableRow {
  [key: string]: string | number;
}

interface StrategyTableProps {
  title: string;
  legend: Legend;
  table: TableRow[];
  rowLabel: string;
}

const getCellColor = (action: string): string => {
  if (action.includes('U')) return '#c8e6c9';
  if (action.includes('B')) return '#fff9c4';
  if (action === 'R') return '#ffcdd2';
  if (action === 'E') return '#e3f2fd';
  if (action === 'K') return '#f5f5f5';
  return '#ffffff';
};

export default function StrategyTable({ title, legend, table, rowLabel }: StrategyTableProps) {
  const dealerCards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A'];

  return (
    <div className="strategy-table">
      {title && <h3 className="strategy-table-title">{title}</h3>}
      
      <div className="strategy-legend">
        <h4>Legend:</h4>
        <div className="legend-items">
          {Object.entries(legend).map(([key, value]) => (
            <div key={key} className="legend-item">
              <span className="legend-key" style={{ backgroundColor: getCellColor(key) }}>
                {key}
              </span>
              <span className="legend-value">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="table-container">
        <table className="strategy-grid">
          <thead>
            <tr>
              <th className="corner-cell">Your Hand / Dealer's Card</th>
              {dealerCards.map(card => (
                <th key={card} className="dealer-card">{card}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.map((row, idx) => {
              const handValue = row[rowLabel];
              return (
                <tr key={idx}>
                  <td className="player-hand">{handValue}</td>
                  {dealerCards.map(card => {
                    const action = row[card] as string;
                    return (
                      <td 
                        key={card} 
                        className="action-cell"
                        style={{ backgroundColor: getCellColor(action) }}
                      >
                        {action}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
