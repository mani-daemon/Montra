import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAccessToken, clearTokens, saveToken } from '../services/storage';
import { loginUser } from '../services/api';
import { globalEvents } from '../services/eventEmitter';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await getAccessToken();
        if (token) {
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.error('Failed to get token on boot:', e);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    const unsubscribe = globalEvents.on('logout', async () => {
      await clearTokens();
      setIsAuthenticated(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    if (data.access_token) {
      await saveToken(data.access_token, data.refresh_token);
      setIsAuthenticated(true);
      return data;
    }
    throw new Error('No access token received');
  };

  const logout = async () => {
    await clearTokens();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
