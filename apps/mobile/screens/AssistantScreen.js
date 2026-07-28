import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function AssistantScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🤖 Montra AI Assistant</Text>
      <Text style={styles.subtitle}>Ask anything about your money</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#09090E', justifyContent: 'center', alignItems: 'center' },
  title: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
  subtitle: { color: '#8F90A6', marginTop: 8 },
});