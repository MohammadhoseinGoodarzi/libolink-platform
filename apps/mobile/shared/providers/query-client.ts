import { makeQueryClient } from '@repo/api';
import type { QueryClient } from '@tanstack/react-query';

// Mobile is always client-side, so a single long-lived QueryClient is correct.
let queryClient: QueryClient | undefined;

export function getQueryClient(): QueryClient {
  queryClient ??= makeQueryClient();
  return queryClient;
}
