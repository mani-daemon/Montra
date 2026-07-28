import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { getTransactions, getSummary } from '../services/api';

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [summary, setSummary] = useState({ balance: 0, total_income: 0, total_expense: 0 });
  const [transactions, setTransactions] = useState([]);

  const fetchData = async () => {
    const summaryData = await getSummary();
    const transactionsData = await getTransactions();
    
    setSummary(summaryData);
    setTransactions(transactionsData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#09090B' }}>
      <ScrollView 
        contentContainerStyle={{ padding: 20, paddingTop: 60 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366F1" />
        }
      >
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <View>
            <Text style={{ color: '#A1A1AA', fontSize: 14 }}>Welcome back,</Text>
            <Text style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 'bold' }}>Montra User</Text>
          </View>
          <TouchableOpacity style={{ backgroundColor: '#18181B', padding: 10, borderRadius: 12 }}>
            <Feather name="bell" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Total Balance Card */}
        <View style={{ backgroundColor: '#6366F1', borderRadius: 24, padding: 20, marginBottom: 24 }}>
          <Text style={{ color: '#C7D2FE', fontSize: 14, marginBottom: 8 }}>Total Balance</Text>
          <Text style={{ color: '#FFFFFF', fontSize: 32, fontWeight: 'bold', marginBottom: 20 }}>
            ${summary.balance.toFixed(2)}
          </Text>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'rgba(255, 255, 255, 0.15)', borderRadius: 16, padding: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Feather name="arrow-down-left" size={20} color="#4ADE80" />
              <View style={{ marginLeft: 8 }}>
                <Text style={{ color: '#E0E7FF', fontSize: 12 }}>Income</Text>
                <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>${summary.total_income.toFixed(2)}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Feather name="arrow-up-right" size={20} color="#F87171" />
              <View style={{ marginLeft: 8 }}>
                <Text style={{ color: '#E0E7FF', fontSize: 12 }}>Expenses</Text>
                <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>${summary.total_expense.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Recent Transactions List */}
        <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>Recent Transactions</Text>
        
        {transactions.length === 0 ? (
          <Text style={{ color: '#A1A1AA', textAlign: 'center', marginTop: 20 }}>No transactions found</Text>
        ) : (
          transactions.map((item) => (
            <View key={item.id} style={{ backgroundColor: '#18181B', borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ backgroundColor: '#27272A', padding: 12, borderRadius: 12, marginRight: 12 }}>
                  <Feather name={item.type === 'income' ? 'arrow-down-left' : 'arrow-up-right'} size={20} color={item.type === 'income' ? '#4ADE80' : '#F87171'} />
                </View>
                <View>
                  <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 16 }}>{item.title}</Text>
                  <Text style={{ color: '#A1A1AA', fontSize: 12 }}>{item.category}</Text>
                </View>
              </View>
              <Text style={{ color: item.type === 'income' ? '#4ADE80' : '#FFFFFF', fontWeight: 'bold', fontSize: 16 }}>
                {item.type === 'income' ? '+' : '-'}${item.amount.toFixed(2)}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}