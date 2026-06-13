import { makeQueryClient } from '@repo/api';
import { isServer, type QueryClient } from '@tanstack/react-query';

let browserQueryClient: QueryClient | undefined;

export function getQueryClient(): QueryClient {
  if (isServer) {
    // Always make a fresh client on the server so requests never share state.
    return makeQueryClient();
  }
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
