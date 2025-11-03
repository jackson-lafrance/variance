import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

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
  if (action === 'Br') return '#fff9c4';
  return '#ffffff';
};

export function StrategyTable({ title, legend, table, rowLabel }: StrategyTableProps) {
  const dealerCards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A'];

  return (
    <View style={styles.container}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      
      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>Legend:</Text>
        <View style={styles.legendItems}>
          {Object.entries(legend).map(([key, value]) => (
            <View key={key} style={styles.legendItem}>
              <View style={[styles.legendKey, { backgroundColor: getCellColor(key) }]}>
                <Text style={styles.legendKeyText}>{key}</Text>
              </View>
              <Text style={styles.legendValue}>{value}</Text>
            </View>
          ))}
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.tableScroll}>
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <View style={styles.cornerCell}>
              <Text style={styles.headerText}>Your Hand / Dealer's Card</Text>
            </View>
            {dealerCards.map(card => (
              <View key={card} style={styles.headerCell}>
                <Text style={styles.headerText}>{card}</Text>
              </View>
            ))}
          </View>
          
          {table.map((row, idx) => {
            const handValue = row[rowLabel];
            return (
              <View key={idx} style={styles.tableRow}>
                <View style={styles.rowLabelCell}>
                  <Text style={styles.rowLabelText}>{handValue}</Text>
                </View>
                {dealerCards.map(card => {
                  const action = row[card] as string;
                  return (
                    <View 
                      key={card} 
                      style={[styles.actionCell, { backgroundColor: getCellColor(action) }]}
                    >
                      <Text style={styles.actionText}>{action}</Text>
                    </View>
                  );
                })}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  legendContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendKey: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  legendKeyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  legendValue: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  tableScroll: {
    marginHorizontal: -16,
  },
  tableContainer: {
    paddingHorizontal: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#333',
  },
  cornerCell: {
    width: 120,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
    justifyContent: 'center',
  },
  headerCell: {
    width: 50,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  rowLabelCell: {
    width: 120,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
    justifyContent: 'center',
  },
  rowLabelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  actionCell: {
    width: 50,
    padding: 12,
    borderRightWidth: 1,
    borderRightColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});


