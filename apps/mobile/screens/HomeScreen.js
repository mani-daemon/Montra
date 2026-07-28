import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Alert, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSummary, useTransactions } from '../services/queries';
import AddTransactionModal from '../components/AddTransactionModal';
import { COLORS, SIZES } from '../constants/theme';

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  
  const { data: summaryData, isLoading: loadingSummary, refetch: refetchSummary, isRefetching: refetchingSummary } = useSummary();
  const { data: transactionsData, isLoading: loadingTransactions, refetch: refetchTransactions, isRefetching: refetchingTransactions } = useTransactions();

  const summary = summaryData || { balance: 0, total_income: 0, total_expense: 0 };
  const transactions = transactionsData || [];
  
  const refreshing = refetchingSummary || refetchingTransactions;

  const onRefresh = async () => {
    await Promise.all([refetchSummary(), refetchTransactions()]);
  };

  const handleAIAssistant = () => {
    Alert.alert(
      'AI Financial Assistant 🤖',
      'Based on your recent transactions, you spent $9.00 on Food (Coffee). Your budget is healthy!',
      [{ text: 'Got it!' }]
    );
  };

  if (loadingSummary || loadingTransactions) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: COLORS.textSecondary }}>Loading your finances...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
      >
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
            <Text style={styles.aiBannerText}>Tap to analyze your $9.00 coffee spending habit.</Text>
          </View>
          <Feather name="chevron-right" size={18} color={COLORS.textSecondary} />
        </TouchableOpacity>

        {/* Total Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>${summary.balance.toFixed(2)}</Text>
          
          <View style={styles.balanceStats}>
            <View style={styles.statItem}>
              <Feather name="arrow-down-left" size={20} color={COLORS.success} />
              <View style={{ marginLeft: 8 }}>
                <Text style={styles.statLabel}>Income</Text>
                <Text style={styles.statValue}>${summary.total_income.toFixed(2)}</Text>
              </View>
            </View>
            <View style={styles.statItem}>
              <Feather name="arrow-up-right" size={20} color={COLORS.danger} />
              <View style={{ marginLeft: 8 }}>
                <Text style={styles.statLabel}>Expenses</Text>
                <Text style={styles.statValue}>${summary.total_expense.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Recent Transactions Header */}
        <View style={styles.transactionsHeader}>
          <Text style={styles.transactionsTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.addBtnText}>+ Add New</Text>
          </TouchableOpacity>
        </View>
        
        {/* Transactions List */}
        {transactions.length === 0 ? (
          <Text style={styles.emptyText}>No transactions found</Text>
        ) : (
          transactions.map((item) => (
            <View key={item.id} style={styles.txItem}>
              <View style={styles.txLeft}>
                <View style={styles.txIconContainer}>
                  <Feather 
                    name={item.type === 'income' ? 'arrow-down-left' : 'arrow-up-right'} 
                    size={20} 
                    color={item.type === 'income' ? COLORS.success : COLORS.danger} 
                  />
                </View>
                <View>
                  <Text style={styles.txTitle}>{item.title}</Text>
                  <Text style={styles.txCategory}>{item.category}</Text>
                </View>
              </View>
              <Text style={[styles.txAmount, { color: item.type === 'income' ? COLORS.success : COLORS.text }]}>
                {item.type === 'income' ? '+' : '-'}${item.amount.toFixed(2)}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Feather name="plus" size={28} color={COLORS.text} />
      </TouchableOpacity>

      {/* Modal */}
      <AddTransactionModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
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
    padding: SIZES.padding,
    paddingTop: 60,
    paddingBottom: 100,
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