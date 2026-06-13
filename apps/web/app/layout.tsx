import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Providers } from '@/shared/providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Libolink',
  description: 'Where readers connect.',
};

// Runs synchronously before React mounts so the correct theme class is on
// <html> before first paint. Never replace this with a useEffect.
const noFlashScript = `(function () {
  try {
    var theme = localStorage.getItem('theme');
    var dark =
      theme === 'dark' ||
      (theme !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', dark);
  } catch (_) {}
})();`;

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
