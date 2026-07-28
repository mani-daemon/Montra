import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ActivityIndicator, View } from 'react-native';

import AppNavigator from './navigation/AppNavigator';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import { getToken } from './services/authClient';
import { globalEvents } from './services/eventEmitter';
import { COLORS } from './constants/theme';

const queryClient = new QueryClient();
const Stack = createNativeStackNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // 1. Check for existing token on boot
    const checkToken = async () => {
      try {
        const token = await getToken();
        if (token) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Failed to read token:', error);
      } finally {
        setIsReady(true);
      }
    };
    checkToken();

    // 2. Listen for global logout event (e.g. from 401 interceptor or Profile screen)
    const unsubscribe = globalEvents.on('logout', () => {
      setIsAuthenticated(false);
    });

    return unsubscribe;
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isAuthenticated ? (
            <Stack.Screen name="MainApp" component={AppNavigator} />
          ) : (
            <>
              <Stack.Screen name="Welcome" component={WelcomeScreen} />
              <Stack.Screen name="Login">
                {props => <LoginScreen {...props} signIn={() => setIsAuthenticated(true)} />}
              </Stack.Screen>
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}