import { settingsAtom } from '@repo/stores';
import { useAtom } from 'jotai';

// Feature binding over the shared app-settings atom. The detail screens read
// `settings` and update via `setSettings(p => ...)`. Persistence (AsyncStorage)
// is phase-2 — mirrors the theme bootstrap once the backend / device sync lands.
export function useSettings() {
  const [settings, setSettings] = useAtom(settingsAtom);
  return { settings, setSettings };
}
