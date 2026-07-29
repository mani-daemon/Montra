import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors } from '../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemTheme = useColorScheme();
  const [themeMode, setThemeMode] = useState('system'); // 'light', 'dark', 'system'

  useEffect(() => {
    // Load saved theme preference
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('@theme_mode');
        if (savedTheme) {
          setThemeMode(savedTheme);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    loadTheme();
  }, []);

  const changeTheme = async (mode) => {
    setThemeMode(mode);
    try {
      await AsyncStorage.setItem('@theme_mode', mode);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const isDark = themeMode === 'dark' || (themeMode === 'system' && systemTheme === 'dark');
  const themeColors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ themeMode, isDark, themeColors, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
