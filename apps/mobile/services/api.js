import axios from 'axios';
import { getToken, clearToken } from './authClient';
import { globalEvents } from './eventEmitter';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.48:8005';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Token
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response Interceptor: Handle 401s
api.interceptors.response.use((response) => response, async (error) => {
  if (error.response && error.response.status === 401) {
    await clearToken();
    globalEvents.emit('logout');
  }
  return Promise.reject(error);
});

export const getTransactions = async () => {
  const response = await api.get('/transactions');
  return response.data;
};

export const getSummary = async () => {
  const response = await api.get('/summary');
  return response.data;
};

export const createTransaction = async (transactionData) => {
  const response = await api.post('/transactions', transactionData);
  return response.data;
};