import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
// Import removed
import { globalEvents } from '../services/eventEmitter';
import { clearTokens } from '../services/storage';
import { COLORS, SIZES } from '../constants/theme';
import { useCurrency } from '../context/CurrencyContext';

export default function ProfileScreen() {
  const { currency, toggleCurrency } = useCurrency();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Logout', 
        style: 'destructive', 
        onPress: async () => {
          await clearTokens();
          globalEvents.emit('logout');
        } 
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Title */}
        <Text style={styles.headerTitle}>Profile & Settings</Text>

        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <Feather name="user" size={32} color={COLORS.text} />
          </View>
          <View>
            <Text style={styles.userName}>Montra User</Text>
            <Text style={styles.userEmail}>user@montra.app</Text>
          </View>
        </View>

        {/* Settings Group 1: Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={toggleCurrency}>
            <View style={styles.menuLeft}>
              <Feather name="dollar-sign" size={20} color={COLORS.primaryLight} />
              <Text style={styles.menuText}>Currency</Text>
            </View>
            <View style={styles.menuRight}>
              <Text style={styles.menuValue}>{currency.code} ({currency.symbol})</Text>
              <Feather name="refresh-cw" size={16} color={COLORS.primaryLight} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Feather name="bell" size={20} color={COLORS.primaryLight} />
              <Text style={styles.menuText}>Notifications</Text>
            </View>
            <Feather name="chevron-right" size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Feather name="shield" size={20} color={COLORS.primaryLight} />
              <Text style={styles.menuText}>Security & Privacy</Text>
            </View>
            <Feather name="chevron-right" size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Settings Group 2: Account Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <View style={styles.menuLeft}>
              <Feather name="log-out" size={20} color={COLORS.danger} />
              <Text style={[styles.menuText, { color: COLORS.danger }]}>Log Out</Text>
            </View>
          </TouchableOpacity>
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
  userCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: COLORS.cardAlt,
    marginBottom: 24,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  userEmail: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  menuItem: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.cardAlt,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '500',
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  menuValue: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
});