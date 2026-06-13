import type { ReactNode } from 'react';
import { ThemeToggle } from '@/shared/components/theme-toggle';

export default function LandingLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-5xl flex-col px-6">
      <header className="flex items-center justify-between py-4">
        <span className="font-semibold text-lg text-primary">Libolink</span>
        <ThemeToggle />
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
