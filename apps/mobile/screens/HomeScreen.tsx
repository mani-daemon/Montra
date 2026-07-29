import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { getInsight } from '../services/api';
import { useSummary, useTransactions } from '../services/queries';
import { formatMoney } from '../services/money';
import AddTransactionModal from '../components/AddTransactionModal';
import InsightModal from '../components/InsightModal';
import TransactionList from '../components/TransactionList';
import { COLORS, SIZES } from '../constants/theme';
import { useCurrency } from '../context/CurrencyContext';
import { Transaction } from '../types/transaction';

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [insightVisible, setInsightVisible] = useState(false);
  const [insightData, setInsightData] = useState<string>('Tap to analyze your spending habits.');
  const { currency } = useCurrency();
  
  const transactionsQuery = useTransactions();
  const summaryQuery = useSummary();
  const transactions = transactionsQuery.data ?? [];
  const summary = summaryQuery.data ?? {
    balance_minor: 0,
    total_income_minor: 0,
    total_expense_minor: 0,
  };
  const isLoading = transactionsQuery.isLoading || summaryQuery.isLoading;
  const error = transactionsQuery.error || summaryQuery.error;

  const onRefresh = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await Promise.all([transactionsQuery.refetch(), summaryQuery.refetch()]);
  }, [transactionsQuery, summaryQuery]);

  const handleAIAssistant = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setInsightVisible(true);
    try {
      const data = await getInsight();
      if (data && data.insight) {
        setInsightData(data.insight);
      }
    } catch (err) {
      console.log('Error fetching insight', err);
    }
  }, []);

  const openAddModal = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setModalVisible(true);
  }, []);
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
          <Text style={styles.aiBannerText} numberOfLines={1}>{insightData}</Text>
        </View>
        <Feather name="chevron-right" size={18} color={COLORS.textSecondary} />
      </TouchableOpacity>

      {/* Total Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balanceAmount}>{formatMoney(summary.balance_minor, currency.code)}</Text>
        
        <View style={styles.balanceStats}>
          <View style={styles.statItem}>
            <Feather name="arrow-down-left" size={20} color={COLORS.success} />
            <View style={{ marginLeft: 8 }}>
              <Text style={styles.statLabel}>Income</Text>
              <Text style={styles.statValue}>{formatMoney(summary.total_income_minor, currency.code)}</Text>
            </View>
          </View>
          <View style={styles.statItem}>
            <Feather name="arrow-up-right" size={20} color={COLORS.danger} />
            <View style={{ marginLeft: 8 }}>
              <Text style={styles.statLabel}>Expenses</Text>
              <Text style={styles.statValue}>{formatMoney(summary.total_expense_minor, currency.code)}</Text>
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

  return (
    <View style={styles.container}>
      <TransactionList 
        transactions={transactions}
        isLoading={isLoading}
        onRefresh={onRefresh}
        ListHeaderComponent={renderHeader()}
      />

      {error && (
        <View style={{ padding: 10, backgroundColor: COLORS.danger }}>
          <Text style={{ color: '#fff', textAlign: 'center' }}>Could not refresh your financial data. Pull to retry.</Text>
        </View>
      )}

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
        message={insightData}
        actions={undefined}
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
