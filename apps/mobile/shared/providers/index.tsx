import { QueryClientProvider } from '@tanstack/react-query';
import { Provider as JotaiProvider } from 'jotai';
import type { ReactNode } from 'react';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { jotaiStore } from '@/shared/store';
import { getQueryClient } from './query-client';

export function Providers({ children }: Readonly<{ children: ReactNode }>) {
  const queryClient = getQueryClient();
  return (
    // KeyboardProvider drives the app's keyboard-aware scrolling (the shared
    // ScreenScrollView + AuthScreen). Kept as high as possible in the tree.
    <KeyboardProvider>
      <SafeAreaProvider>
        <JotaiProvider store={jotaiStore}>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </JotaiProvider>
      </SafeAreaProvider>
    </KeyboardProvider>
  );
}
