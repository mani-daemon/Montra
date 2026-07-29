import React from 'react';
import { FlatList, ListRenderItemInfo, RefreshControl, Text, StyleSheet } from 'react-native';
import { Transaction } from '../types/transaction';
import TransactionRow from './TransactionRow';
import { COLORS, SIZES } from '../constants/theme';

interface TransactionListProps {
  transactions: Transaction[];
  isLoading: boolean;
  onRefresh: () => void;
  ListHeaderComponent?: React.ReactElement;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  isLoading,
  onRefresh,
  ListHeaderComponent,
}) => {
  const renderItem = ({ item }: ListRenderItemInfo<Transaction>) => (
    <TransactionRow item={item as any} />
  );

  const keyExtractor = (item: Transaction) => item.id.toString();

  return (
    <FlatList
      data={transactions}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={{ paddingBottom: 100 }}
      style={{ paddingHorizontal: SIZES.padding }}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={onRefresh}
          tintColor={COLORS.primary}
        />
      }
      showsVerticalScrollIndicator={false}
      initialNumToRender={15}
      maxToRenderPerBatch={10}
      windowSize={7}
      removeClippedSubviews={true}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={<Text style={styles.emptyText}>No transactions found</Text>}
    />
  );
};

const styles = StyleSheet.create({
  emptyText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default TransactionList;
