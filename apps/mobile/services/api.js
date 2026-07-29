import axios from 'axios';
import { getToken, clearToken } from './authClient';
import { globalEvents } from './eventEmitter';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.48:8005';
const API_PREFIX = '/api/v1';

const api = axios.create({
  baseURL: `${BASE_URL}${API_PREFIX}`,
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
  const response = await api.get('/transactions/summary');
  return response.data;
};

export const getInsight = async () => {
  const response = await api.get('/ai/insights');
  return response.data;
};

export const createTransaction = async (transactionData) => {
  const response = await api.post('/transactions', transactionData);
  return response.data;
};

export const loginUser = async (email, password) => {
  // Use FormData because FastAPI OAuth2PasswordRequestForm expects form data
  const formData = new FormData();
  formData.append('username', email); // OAuth2 expects 'username'
  formData.append('password', password);
  
  const response = await api.post('/auth/login', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const registerUser = async (name, email, password) => {
  const response = await api.post('/auth/register', { name, email, password });
  return response.data;
};

export const uploadReceipt = async (imageUri) => {
  const formData = new FormData();
  
  // React Native fetch/axios requires this specific object structure for files
  const filename = imageUri.split('/').pop();
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : `image`;
  
  formData.append('file', {
    uri: imageUri,
    name: filename,
    type: type
  });

  const response = await api.post('/ai/receipts/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const sendChatMessage = async (message) => {
  const response = await api.post('/ai/assistant/chat', { message });
  return response.data;
};