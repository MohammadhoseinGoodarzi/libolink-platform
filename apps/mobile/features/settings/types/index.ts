// View-only types for the Settings index + push-detail screens (handoff Settings).
import type { LucideIcon } from 'lucide-react-native';
import type { ReactNode } from 'react';

// The push-detail section keys. Authoring call sites (openSection, the search
// catalog) use this so a typo'd section is a compile error; the [section] route
// param stays a plain string (a deep link can carry anything) and is validated by
// the section screen's coming-soon fallback.
export type SettingsSection =
  | 'account'
  | 'notifications'
  | 'appearance'
  | 'privacy'
  | 'content'
  | 'storage'
  | 'support'
  | 'about';

export type SettingsRowTrailing = 'chevron' | 'switch' | 'check' | 'none';

export type SettingsRowProps = {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  /** Trailing value text (e.g. the current theme, the app version). */
  value?: string;
  /** First row in a group — omit the top divider. */
  first?: boolean;
  /** Crimson tint for destructive rows. */
  danger?: boolean;
  /** Trailing affordance — chevron (default), a Switch, a check, or nothing. */
  trailing?: SettingsRowTrailing;
  /** Switch/check state. */
  on?: boolean;
  /** Switch toggle handler (rows with `trailing="switch"`). */
  onToggle?: () => void;
  /** Disable the switch (e.g. when the master notifications switch is off). */
  toggleDisabled?: boolean;
  onPress?: () => void;
};

export type GroupCardProps = {
  children: ReactNode;
};

export type AccountCardProps = {
  onEdit: () => void;
  onViewProfile: () => void;
};

export type SettingsGroupLabelProps = {
  children: ReactNode;
  icon?: LucideIcon;
};

export type SettingsNoteProps = {
  children: ReactNode;
};

export type SettingsScreenShellProps = {
  title: string;
  children: ReactNode;
};

export type SegmentOption<K extends string> = {
  key: K;
  label: string;
};

export type SegmentProps<K extends string> = {
  options: SegmentOption<K>[];
  value: K;
  onChange: (key: K) => void;
};

export type TileSegmentOption<K extends string> = {
  key: K;
  label: string;
  icon: LucideIcon;
};

export type TileSegmentProps<K extends string> = {
  options: TileSegmentOption<K>[];
  value: K;
  onChange: (key: K) => void;
};

export type SettingsSectionScreenProps = {
  section: string | undefined;
};
