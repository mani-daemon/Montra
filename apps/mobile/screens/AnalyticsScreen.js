import React, { useState } from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BarChart, PieChart } from 'react-native-gifted-charts';
import { useSummary, useTransactions } from '../services/queries';
import { CATEGORIES, getCategoryColor } from '../constants/categories';
import { COLORS, SIZES } from '../constants/theme';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
  const { data: summaryData, isLoading: loadingSummary, refetch: refetchSummary, isRefetching: refetchingSummary } = useSummary();
  const { data: transactions, isLoading: loadingTransactions, refetch: refetchTransactions, isRefetching: refetchingTransactions } = useTransactions();

  const summary = summaryData || { balance: 0, total_income: 0, total_expense: 0 };
  const txs = transactions || [];
  
  const refreshing = refetchingSummary || refetchingTransactions;

  const onRefresh = async () => {
    await Promise.all([refetchSummary(), refetchTransactions()]);
  };

  // 1. Prepare Bar Chart Data
  const barData = [
    {
      value: summary.total_income,
      label: 'Income',
      frontColor: COLORS.success,
      topLabelComponent: () => (
        <Text style={{ color: COLORS.success, fontSize: 11, fontWeight: 'bold', marginBottom: 4 }}>
          ${summary.total_income}
        </Text>
      ),
    },
    {
      value: summary.total_expense,
      label: 'Expense',
      frontColor: COLORS.danger,
      topLabelComponent: () => (
        <Text style={{ color: COLORS.danger, fontSize: 11, fontWeight: 'bold', marginBottom: 4 }}>
          ${summary.total_expense}
        </Text>
      ),
    },
  ];

  // 2. Prepare Pie Chart Data
  const expenses = txs.filter((t) => t.type === 'expense');
  const totals = {};
  expenses.forEach((t) => {
    totals[t.category] = (totals[t.category] || 0) + t.amount;
  });

  const pieData = Object.keys(totals).map((cat) => ({
    value: totals[cat],
    color: getCategoryColor(cat),
    text: cat,
  }));

  if (loadingSummary || loadingTransactions) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: COLORS.textSecondary }}>Loading analytics...</Text>
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
        <Text style={styles.headerTitle}>Financial Analytics</Text>

        {/* Chart 1: Bar Chart (Income vs Expenses) */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Income vs Expense</Text>
          <View style={{ alignItems: 'center', marginTop: 10 }}>
            <BarChart
              data={barData}
              barWidth={45}
              initialSpacing={40}
              spacing={50}
              barBorderRadius={8}
              yAxisThickness={0}
              xAxisThickness={0}
              xAxisLabelTextStyle={{ color: COLORS.textSecondary, fontSize: 12, fontWeight: '600' }}
              noOfSections={3}
              maxValue={Math.max(summary.total_income, summary.total_expense, 100) * 1.2}
              isAnimated
            />
          </View>
        </View>

        {/* Chart 2: Donut/Pie Chart (Expense Breakdown) */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Expense Breakdown</Text>
          
          {pieData.length > 0 ? (
            <View style={{ alignItems: 'center', marginVertical: 15 }}>
              <PieChart
                data={pieData}
                donut
                showGradient
                sectionAutoFocus
                radius={90}
                innerRadius={60}
                innerCircleColor={COLORS.card}
                centerLabelComponent={() => {
                  return (
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={{ fontSize: 18, color: COLORS.text, fontWeight: 'bold' }}>
                        ${summary.total_expense.toFixed(0)}
                      </Text>
                      <Text style={{ fontSize: 11, color: COLORS.textSecondary }}>Spent</Text>
                    </View>
                  );
                }}
              />

              {/* Legend / راهنمای رنگ‌ها */}
              <View style={styles.legendContainer}>
                {pieData.map((item) => (
                  <View key={item.text} style={styles.legendItem}>
                    <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                    <Text style={styles.legendText}>{item.text}</Text>
                    <Text style={styles.legendValue}>${item.value.toFixed(2)}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <Text style={styles.emptyText}>No expense data available to build chart.</Text>
          )}
        </View>
      </ScrollView>
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
  headerTitle: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  chartCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.padding,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.cardAlt,
  },
  chartTitle: {
    color: COLORS.text,
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 20,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.cardAlt,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: SIZES.radius,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '500',
  },
  legendValue: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginLeft: 4,
  },
  emptyText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginVertical: 20,
  },
});