import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  const [balance, setBalance] = useState(7650.20);
  const [transactions, setTransactions] = useState([
    { id: '1', title: 'Salary', amount: '+$3,000', type: 'income' },
    { id: '2', title: 'Grocery Store', amount: '-$120', type: 'expense' },
    { id: '3', title: 'Coffee Shop', amount: '-$5', type: 'expense' },
  ]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome back,</Text>
        <Text style={styles.headerTitle}>Montra Wallet</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Balance</Text>
        <Text style={styles.balanceAmount}>${balance.toFixed(2)}</Text>
        <TouchableOpacity style={styles.button} onPress={() => setBalance(balance + 100)}>
          <Text style={styles.buttonText}>+ Quick Income ($100)</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Recent Transactions</Text>

      {transactions.map((item) => (
        <View key={item.id} style={styles.transactionCard}>
          <Text style={styles.transTitle}>{item.title}</Text>
          <Text style={[
            styles.transAmount, 
            { color: item.type === 'income' ? '#00A86B' : '#FF4D4D' }
          ]}>
            {item.amount}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090E',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 20,
  },
  greeting: {
    color: '#8F90A6',
    fontSize: 14,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#1E1E2D',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#2D2D3D',
    marginBottom: 28,
  },
  cardTitle: {
    color: '#8F90A6',
    fontSize: 14,
    marginBottom: 8,
  },
  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#7F3DFF',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  sectionTitle: {
    color: '#8F90A6',
    fontSize: 16,
    marginBottom: 16,
  },
  transactionCard: {
    backgroundColor: '#1E1E2D',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2D2D3D',
  },
  transTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  transAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});