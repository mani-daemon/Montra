import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';
import { useCurrency } from '../context/CurrencyContext';

const TransactionRow = ({ item }) => {
  const { currency } = useCurrency();
  const isIncome = item.type === 'income';

  return (
    <View style={styles.txItem}>
      <View style={styles.txLeft}>
        <View style={styles.txIconContainer}>
          <Feather 
            name={isIncome ? 'arrow-down-left' : 'arrow-up-right'} 
            size={20} 
            color={isIncome ? COLORS.success : COLORS.danger} 
          />
        </View>
        <View>
          <Text style={styles.txTitle}>{item.title}</Text>
          <Text style={styles.txCategory}>{item.category}</Text>
        </View>
      </View>
      <Text style={[styles.txAmount, { color: isIncome ? COLORS.success : COLORS.text }]}>
        {isIncome ? '+' : '-'}{currency.symbol}{item.amount.toFixed(2)}
      </Text>
    </View>
  );
};

export default React.memo(TransactionRow);

const styles = StyleSheet.create({
  txItem: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  txLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txIconContainer: {
    backgroundColor: COLORS.cardAlt,
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
  },
  txTitle: {
    color: COLORS.text,
    fontWeight: '600',
    fontSize: SIZES.md,
  },
  txCategory: {
    color: COLORS.textSecondary,
    fontSize: SIZES.xs,
  },
  txAmount: {
    fontWeight: 'bold',
    fontSize: SIZES.md,
  },
});
