'use client';

import { useDictionary } from '@repo/i18n';
import { Moon, Sun } from 'lucide-react';
import { useCallback, useSyncExternalStore } from 'react';
import { Button } from '@/shared/components/ui/button';

function subscribe(callback: () => void): () => void {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });
  return () => observer.disconnect();
}

function getSnapshot(): boolean {
  return document.documentElement.classList.contains('dark');
}

function getServerSnapshot(): boolean {
  return false;
}

export function ThemeToggle() {
  const t = useDictionary('Common');
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback(() => {
    const next = !document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  }, []);

  return (
    <Button variant="ghost" size="icon" aria-label={t('toggleTheme')} onClick={toggle}>
      {isDark ? <Sun /> : <Moon />}
    </Button>
  );
}
