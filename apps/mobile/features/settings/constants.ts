import type { MessageKey } from '@repo/i18n';
import type { AccessibilitySettings, LanguageCode, NotificationSettings } from '@repo/types';
import {
  Activity,
  AtSign,
  Ban,
  Bell,
  Bold,
  Clock,
  Contrast,
  Database,
  Download,
  Heart,
  Info,
  KeyRound,
  Languages,
  Layers,
  LifeBuoy,
  type LucideIcon,
  Mail,
  MessageCircle,
  Palette,
  ShieldCheck,
  Smartphone,
  Star,
  Type,
  UserCog,
  UserPlus,
  Users,
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

// App / translate languages (handoff) — labels are endonyms (native names), not
// translated strings, so they live here as data.
export const LANGUAGES: { key: LanguageCode; label: string }[] = [
  { key: 'en', label: 'English' },
  { key: 'fa', label: 'فارسی' },
  { key: 'es', label: 'Español' },
  { key: 'fr', label: 'Français' },
  { key: 'ar', label: 'العربية' },
  { key: 'de', label: 'Deutsch' },
  { key: 'tr', label: 'Türkçe' },
  { key: 'zh', label: '中文' },
];

// `as`: Object.fromEntries widens keys to string; LANGUAGES covers every
// LanguageCode, so the map is total.
export const LANGUAGE_LABEL = Object.fromEntries(LANGUAGES.map((l) => [l.key, l.label])) as Record<
  LanguageCode,
  string
>;

// Accessibility toggles (handoff Appearance) — each maps to an AppSettings
// accessibility flag, an icon, and its title/description strings.
export type A11yItem = {
  key: keyof AccessibilitySettings;
  icon: LucideIcon;
  title: MessageKey<'Settings'>;
  desc: MessageKey<'Settings'>;
};

// Notification delivery channels (handoff Notifications) — each maps to a
// NotificationSettings boolean.
export type NotifToggleItem = {
  key: keyof NotificationSettings;
  icon: LucideIcon;
  title: MessageKey<'Settings'>;
  desc?: MessageKey<'Settings'>;
};

export const NOTIF_CHANNELS: NotifToggleItem[] = [
  { key: 'push', icon: Smartphone, title: 'notifPush' },
  { key: 'email', icon: Mail, title: 'notifEmail' },
  { key: 'inapp', icon: Bell, title: 'notifInApp' },
];

// What you're notified about (handoff Notifications) — the granular category matrix.
export const NOTIF_CATEGORIES: NotifToggleItem[] = [
  { key: 'messages', icon: MessageCircle, title: 'notifMessages' },
  { key: 'friends', icon: UserPlus, title: 'notifFriends' },
  { key: 'comments', icon: MessageCircle, title: 'notifComments' },
  { key: 'likes', icon: Heart, title: 'notifLikes' },
  { key: 'mentions', icon: AtSign, title: 'notifMentions' },
  { key: 'clubs', icon: Users, title: 'notifClubs' },
  { key: 'reminders', icon: Clock, title: 'notifReminders' },
  { key: 'followers', icon: UserPlus, title: 'notifFollowers' },
  { key: 'recs', icon: Star, title: 'notifRecs' },
];

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
