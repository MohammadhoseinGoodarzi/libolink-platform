import type { ReactNode } from 'react';
import { ThemeToggle } from '@/shared/components/theme-toggle';

export default function AuthLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center bg-background p-6">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <main className="w-full max-w-sm">{children}</main>
    </div>
  );
}
