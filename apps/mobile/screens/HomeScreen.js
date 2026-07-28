import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSummary, useTransactions } from '../services/queries';
import AddTransactionModal from '../components/AddTransactionModal';
import InsightModal from '../components/InsightModal';
import TransactionRow from '../components/TransactionRow';
import { COLORS, SIZES } from '../constants/theme';
import { useCurrency } from '../context/CurrencyContext';

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [insightVisible, setInsightVisible] = useState(false);
  const { currency } = useCurrency();
  
  const { data: summaryData, isLoading: loadingSummary, refetch: refetchSummary, isRefetching: refetchingSummary } = useSummary();
  const { data: transactionsData, isLoading: loadingTransactions, refetch: refetchTransactions, isRefetching: refetchingTransactions } = useTransactions();

  const summary = summaryData || { balance: 0, total_income: 0, total_expense: 0 };
  const transactions = transactionsData || [];
  
  const refreshing = refetchingSummary || refetchingTransactions;

  const onRefresh = useCallback(async () => {
    await Promise.all([refetchSummary(), refetchTransactions()]);
  }, [refetchSummary, refetchTransactions]);

  const handleAIAssistant = useCallback(() => {
    setInsightVisible(true);
  }, []);

  const openAddModal = useCallback(() => setModalVisible(true), []);
  const closeAddModal = useCallback(() => setModalVisible(false), []);

  const renderHeader = () => (
    <View style={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greetingText}>Welcome back,</Text>
          <Text style={styles.userName}>Montra User</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleAIAssistant} style={styles.iconButtonPrimary}>
            <Feather name="cpu" size={20} color={COLORS.primaryLight} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="bell" size={20} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* AI Insight Banner */}
      <TouchableOpacity onPress={handleAIAssistant} style={styles.aiBanner}>
        <View style={styles.aiIconContainer}>
          <Feather name="zap" size={18} color={COLORS.text} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.aiBannerTitle}>AI Smart Insight</Text>
          <Text style={styles.aiBannerText}>Tap to analyze your {currency.symbol}9.00 coffee spending habit.</Text>
        </View>
        <Feather name="chevron-right" size={18} color={COLORS.textSecondary} />
      </TouchableOpacity>

      {/* Total Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balanceAmount}>{currency.symbol}{summary.balance.toFixed(2)}</Text>
        
        <View style={styles.balanceStats}>
          <View style={styles.statItem}>
            <Feather name="arrow-down-left" size={20} color={COLORS.success} />
            <View style={{ marginLeft: 8 }}>
              <Text style={styles.statLabel}>Income</Text>
              <Text style={styles.statValue}>{currency.symbol}{summary.total_income.toFixed(2)}</Text>
            </View>
          </View>
          <View style={styles.statItem}>
            <Feather name="arrow-up-right" size={20} color={COLORS.danger} />
            <View style={{ marginLeft: 8 }}>
              <Text style={styles.statLabel}>Expenses</Text>
              <Text style={styles.statValue}>{currency.symbol}{summary.total_expense.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Recent Transactions Header */}
      <View style={styles.transactionsHeader}>
        <Text style={styles.transactionsTitle}>Recent Transactions</Text>
        <TouchableOpacity onPress={openAddModal}>
          <Text style={styles.addBtnText}>+ Add New</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loadingSummary || loadingTransactions) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: COLORS.textSecondary }}>Loading your finances...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList 
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <TransactionRow item={item} />}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingBottom: 100 }}
        style={{ paddingHorizontal: SIZES.padding }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
        initialNumToRender={15}
        maxToRenderPerBatch={10}
        windowSize={7}
        removeClippedSubviews
        ListEmptyComponent={<Text style={styles.emptyText}>No transactions found</Text>}
      />

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity style={styles.fab} onPress={openAddModal}>
        <Feather name="plus" size={28} color={COLORS.text} />
      </TouchableOpacity>

      {/* Modals */}
      <AddTransactionModal 
        visible={modalVisible} 
        onClose={closeAddModal} 
      />

      <InsightModal
        visible={insightVisible}
        onClose={() => setInsightVisible(false)}
        title="AI Financial Assistant"
        message={`Based on your recent transactions, you spent ${currency.symbol}9.00 on Food (Coffee). Your budget is healthy!`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greetingText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.sm,
  },
  userName: {
    color: COLORS.text,
    fontSize: SIZES.xl,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    backgroundColor: COLORS.card,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.cardAlt,
  },
  iconButtonPrimary: {
    backgroundColor: COLORS.primaryBg,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  aiBanner: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: 14,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  aiIconContainer: {
    backgroundColor: COLORS.primary,
    padding: 8,
    borderRadius: 10,
  },
  aiBannerTitle: {
    color: COLORS.text,
    fontWeight: '600',
    fontSize: SIZES.sm,
  },
  aiBannerText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.xs,
  },
  balanceCard: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.padding,
    marginBottom: 24,
  },
  balanceLabel: {
    color: COLORS.textInverse,
    fontSize: SIZES.sm,
    marginBottom: 8,
  },
  balanceAmount: {
    color: COLORS.text,
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  balanceStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: SIZES.radius,
    padding: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statLabel: {
    color: COLORS.textInverse,
    fontSize: SIZES.xs,
  },
  statValue: {
    color: COLORS.text,
    fontWeight: '600',
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  transactionsTitle: {
    color: COLORS.text,
    fontSize: SIZES.lg,
    fontWeight: 'bold',
  },
  addBtnText: {
    color: COLORS.primaryLight,
    fontWeight: '600',
    fontSize: SIZES.sm,
  },
  emptyText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: COLORS.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
});