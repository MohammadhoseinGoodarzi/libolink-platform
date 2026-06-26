import type { MessageKey } from '@repo/i18n';
import {
  Ban,
  Bell,
  Database,
  Download,
  Info,
  KeyRound,
  Languages,
  type LucideIcon,
  Palette,
  ShieldCheck,
  UserCog,
} from 'lucide-react-native';

// Shown in the index footer + the About row.
export const APP_VERSION = '3.2.0';

// Flat search catalog (handoff Settings) — the index search filters these by
// translated label. Each result deep-links to its category (phase-2 details
// acknowledge via toast for now).
export type SettingsSearchItem = {
  key: string;
  label: MessageKey<'Settings'>;
  icon: LucideIcon;
};

export const SETTINGS_SEARCH: SettingsSearchItem[] = [
  { key: 'account', label: 'account', icon: UserCog },
  { key: 'editProfile', label: 'editProfile', icon: UserCog },
  { key: 'changePassword', label: 'changePassword', icon: KeyRound },
  { key: 'notifications', label: 'notifications', icon: Bell },
  { key: 'appearance', label: 'appearance', icon: Palette },
  { key: 'privacy', label: 'privacy', icon: ShieldCheck },
  { key: 'twoFactor', label: 'twoFactor', icon: ShieldCheck },
  { key: 'blockedUsers', label: 'blockedUsers', icon: Ban },
  { key: 'language', label: 'language', icon: Languages },
  { key: 'storage', label: 'storage', icon: Database },
  { key: 'downloads', label: 'downloads', icon: Download },
  { key: 'about', label: 'about', icon: Info },
];
