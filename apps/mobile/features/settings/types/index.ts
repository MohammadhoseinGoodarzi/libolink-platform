// View-only types for the Settings index (handoff Settings). The detail screens
// (account, notifications, privacy, …) are phase-2.
import type { LucideIcon } from 'lucide-react-native';
import type { ReactNode } from 'react';

export type SettingsRowProps = {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  /** Trailing value text (e.g. the current theme, the app version). */
  value?: string;
  /** First row in a group — omit the top divider. */
  first?: boolean;
  /** Crimson tint for destructive rows. */
  danger?: boolean;
  onPress: () => void;
};

export type GroupCardProps = {
  children: ReactNode;
};

export type AccountCardProps = {
  onEdit: () => void;
  onViewProfile: () => void;
};
