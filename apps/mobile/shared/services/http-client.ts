import { createHttpClient } from '@repo/api';
import { getAccessToken, handleUnauthorized } from './interceptors';

export const httpClient = createHttpClient({
  baseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api',
  getAccessToken,
  onUnauthorized: handleUnauthorized,
});
