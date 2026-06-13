import { QueryClientProvider } from '@tanstack/react-query';
import { Provider as JotaiProvider } from 'jotai';
import type { ReactNode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { jotaiStore } from '@/shared/store';
import { getQueryClient } from './query-client';

export function Providers({ children }: Readonly<{ children: ReactNode }>) {
  const queryClient = getQueryClient();
  return (
    <SafeAreaProvider>
      <JotaiProvider store={jotaiStore}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </JotaiProvider>
    </SafeAreaProvider>
  );
}
