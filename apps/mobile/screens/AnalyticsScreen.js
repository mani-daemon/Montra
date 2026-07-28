import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function AnalyticsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Spending Analytics</Text>
      <Text style={styles.subtitle}>Charts & insights coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#09090E', justifyContent: 'center', alignItems: 'center' },
  title: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
  subtitle: { color: '#8F90A6', marginTop: 8 },
});