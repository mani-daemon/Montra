import * as SecureStore from 'expo-secure-store';

const TOKEN_KEYS = {
  ACCESS_TOKEN: 'montra_access_token',
  REFRESH_TOKEN: 'montra_refresh_token',
  USER: 'montra_user',
};

export const saveToken = async (accessToken: string, refreshToken?: string) => {
  await SecureStore.setItemAsync(TOKEN_KEYS.ACCESS_TOKEN, accessToken);
  if (refreshToken) {
    await SecureStore.setItemAsync(TOKEN_KEYS.REFRESH_TOKEN, refreshToken);
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync(TOKEN_KEYS.ACCESS_TOKEN);
};

export const getRefreshToken = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync(TOKEN_KEYS.REFRESH_TOKEN);
};

export const clearTokens = async () => {
  await SecureStore.deleteItemAsync(TOKEN_KEYS.ACCESS_TOKEN);
  await SecureStore.deleteItemAsync(TOKEN_KEYS.REFRESH_TOKEN);
  await SecureStore.deleteItemAsync(TOKEN_KEYS.USER);
};

export const saveUser = async (user: object) => {
  await SecureStore.setItemAsync(TOKEN_KEYS.USER, JSON.stringify(user));
};

export const getUser = async (): Promise<any | null> => {
  const user = await SecureStore.getItemAsync(TOKEN_KEYS.USER);
  return user ? JSON.parse(user) : null;
};
