'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider as JotaiProvider } from 'jotai';
import type { ReactNode } from 'react';
import { jotaiStore } from '@/shared/store';
import { getQueryClient } from './query-client';

export function Providers({ children }: Readonly<{ children: ReactNode }>) {
  const queryClient = getQueryClient();
  return (
    <JotaiProvider store={jotaiStore}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </JotaiProvider>
  );
}
