import React, { createContext, useState, useEffect, useContext } from 'react';
import { getToken, clearToken, setToken } from '../services/authClient';
import { loginUser } from '../services/api';
import { globalEvents } from '../services/eventEmitter';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await getToken();
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
      await clearToken();
      setIsAuthenticated(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    if (data.access_token) {
      await setToken(data.access_token);
      setIsAuthenticated(true);
      return data;
    }
    throw new Error('No access token received');
  };

  const logout = async () => {
    await clearToken();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
