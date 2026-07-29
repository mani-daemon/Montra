import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';
// Import removed

import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      // navigation or state update happens via Context in App.js
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(
        'Login Failed', 
        error.response?.data?.detail || error.message || 'Incorrect email or password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="you@example.com"
        placeholderTextColor={COLORS.textMuted}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="••••••••"
        placeholderTextColor={COLORS.textMuted}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color={COLORS.card} />
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.signupContainer} 
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.signupText}>
          Don't have an account? <Text style={styles.signupBold}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SIZES.padding,
    justifyContent: 'center',
  },
  title: {
    color: COLORS.text,
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: COLORS.cardAlt,
    color: COLORS.text,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: SIZES.md,
    marginBottom: 20,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: COLORS.text,
    fontSize: SIZES.md,
    fontWeight: 'bold',
  },
  signupContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  signupText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.md,
  },
  signupBold: {
    color: COLORS.primaryLight,
    fontWeight: 'bold',
  },
});
