import type { MessageKey } from '@repo/i18n';
import type { AccessibilitySettings } from '@repo/types';
import {
  Activity,
  Ban,
  Bell,
  Bold,
  Contrast,
  Database,
  Download,
  Info,
  KeyRound,
  Languages,
  Layers,
  LifeBuoy,
  type LucideIcon,
  Palette,
  ShieldCheck,
  Type,
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
  { key: 'content', label: 'content', icon: Languages },
  { key: 'storage', label: 'storage', icon: Database },
  { key: 'downloads', label: 'downloads', icon: Download },
  { key: 'support', label: 'support', icon: LifeBuoy },
  { key: 'about', label: 'about', icon: Info },
];

// Push-detail section keys → their title string (the [section] route titles + the
// index rows push to these). Built screens live in the section registry; the rest
// render the coming-soon shell.
export const SETTINGS_SECTION_TITLES: Record<string, MessageKey<'Settings'>> = {
  account: 'account',
  notifications: 'notifications',
  appearance: 'appearance',
  privacy: 'privacy',
  content: 'content',
  storage: 'storage',
  support: 'support',
  about: 'about',
};

// Accessibility toggles (handoff Appearance) — each maps to an AppSettings
// accessibility flag, an icon, and its title/description strings.
export type A11yItem = {
  key: keyof AccessibilitySettings;
  icon: LucideIcon;
  title: MessageKey<'Settings'>;
  desc: MessageKey<'Settings'>;
};

export const A11Y_ITEMS: A11yItem[] = [
  { key: 'boldText', icon: Bold, title: 'a11yBoldText', desc: 'a11yBoldTextDesc' },
  { key: 'largerText', icon: Type, title: 'a11yLargerText', desc: 'a11yLargerTextDesc' },
  { key: 'reduceMotion', icon: Activity, title: 'a11yReduceMotion', desc: 'a11yReduceMotionDesc' },
  {
    key: 'increaseContrast',
    icon: Contrast,
    title: 'a11yIncreaseContrast',
    desc: 'a11yIncreaseContrastDesc',
  },
  {
    key: 'reduceTransparency',
    icon: Layers,
    title: 'a11yReduceTransparency',
    desc: 'a11yReduceTransparencyDesc',
  },
];
