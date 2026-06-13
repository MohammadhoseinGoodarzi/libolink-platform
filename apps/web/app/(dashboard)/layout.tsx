import type { ReactNode } from 'react';
import { ThemeToggle } from '@/shared/components/theme-toggle';

export default function DashboardLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-2xl flex-col">
      <header className="flex items-center justify-between border-b py-3">
        <span className="font-semibold text-lg text-primary">Libolink</span>
        <ThemeToggle />
      </header>
      <main className="flex-1 py-6">{children}</main>
    </div>
  );
}
