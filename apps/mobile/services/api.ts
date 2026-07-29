import axios, { AxiosInstance, AxiosError } from 'axios';
import { getAccessToken, clearTokens } from './storage';
import { globalEvents } from './eventEmitter';
import { Transaction, TransactionCreate, TransactionSummary } from '../types/transaction';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.48:8005';
const API_PREFIX = '/api/v1';

const api: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}${API_PREFIX}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      await clearTokens();
      globalEvents.emit('logout');
    }
    return Promise.reject(error);
  }
);

export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    const response = await api.get<Transaction[]>('/transactions/');
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

export const getSummary = async (): Promise<TransactionSummary> => {
  try {
    const response = await api.get<TransactionSummary>('/transactions/summary');
    return response.data;
  } catch (error) {
    console.error('Error fetching summary:', error);
    return { balance: 0, total_income: 0, total_expense: 0 };
  }
};

export const createTransaction = async (transaction: TransactionCreate): Promise<Transaction> => {
  try {
    const response = await api.post<Transaction>('/transactions/', transaction);
    return response.data;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};

export const getInsight = async (): Promise<any> => {
  const response = await api.get('/ai/insights');
  return response.data;
};

export const loginUser = async (email: string, password: string): Promise<any> => {
  const formData = new FormData();
  formData.append('username', email);
  formData.append('password', password);
  
  const response = await api.post('/auth/login', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const registerUser = async (name: string, email: string, password: string): Promise<any> => {
  const response = await api.post('/auth/register', { full_name: name, email, password });
  return response.data;
};

export const uploadReceipt = async (imageUri: string): Promise<any> => {
  const formData = new FormData();
  
  const filename = imageUri.split('/').pop() || 'receipt.jpg';
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : `image`;
  
  formData.append('file', {
    uri: imageUri,
    name: filename,
    type: type
  } as any);

  const response = await api.post('/ai/receipts/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const sendChatMessage = async (message: string): Promise<any> => {
  const response = await api.post('/ai/assistant/chat', { message });
  return response.data;
};
