import AsyncStorage from '@react-native-async-storage/async-storage';
import { themeAtom } from '@repo/stores';
import type { Theme } from '@repo/types';
import { useAtomValue, useSetAtom } from 'jotai';
import { useColorScheme } from 'nativewind';
import { useCallback, useEffect, useState } from 'react';

export * from './colors';
export * from './oklch';
export * from './shadows';

// Mirrors the web app's localStorage 'theme' key so the persisted preference is
// conceptually identical across platforms (§7). NativeWind owns the live color
// scheme; themeAtom mirrors the preference into the shared store.
const THEME_STORAGE_KEY = 'theme';

function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark' || value === 'system';
}

export async function getStoredTheme(): Promise<Theme | null> {
  const value = await AsyncStorage.getItem(THEME_STORAGE_KEY);
  return isTheme(value) ? value : null;
}

export async function setStoredTheme(theme: Theme): Promise<void> {
  await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
}

/**
 * Reads the persisted theme once on mount, applies it to NativeWind + themeAtom,
 * and reports readiness. The root gate keeps the splash screen up until this is
 * true so the correct theme is applied before first paint (no flash).
 */
export function useThemeBootstrap(): boolean {
  const { setColorScheme } = useColorScheme();
  const setTheme = useSetAtom(themeAtom);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    void (async () => {
      const stored = (await getStoredTheme()) ?? 'system';
      setColorScheme(stored);
      setTheme(stored);
      if (active) {
        setReady(true);
      }
    })();
    return () => {
      active = false;
    };
  }, [setColorScheme, setTheme]);

  return ready;
}

/**
 * Theme controller for UI (drawer toggle, Appearance settings). Writes flow to
 * NativeWind (live scheme), themeAtom (shared store), and AsyncStorage (persist).
 */
export function useAppTheme() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const preference = useAtomValue(themeAtom);
  const setThemeAtom = useSetAtom(themeAtom);

  const setTheme = useCallback(
    (next: Theme) => {
      setColorScheme(next);
      setThemeAtom(next);
      void setStoredTheme(next);
    },
    [setColorScheme, setThemeAtom],
  );

  const toggle = useCallback(() => {
    setTheme(colorScheme === 'dark' ? 'light' : 'dark');
  }, [colorScheme, setTheme]);

  return {
    preference,
    resolved: colorScheme ?? 'light',
    isDark: colorScheme === 'dark',
    setTheme,
    toggle,
  };
}
