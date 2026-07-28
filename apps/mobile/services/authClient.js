import * as SecureStore from 'expo-secure-store';

export async function saveToken(token) {
  await SecureStore.setItemAsync('access_token', token);
}

export async function getToken() {
  return SecureStore.getItemAsync('access_token');
}

export async function clearToken() {
  await SecureStore.deleteItemAsync('access_token');
}
