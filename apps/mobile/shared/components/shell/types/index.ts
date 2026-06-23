// Prop/data-shape types for the shared app shell (header, drawer, tab bar, Lio).
// These reference RN/i18n/icon types, so they live here rather than @repo/types;
// shell component files import from here and never declare types inline
// (CLAUDE.md: no type declarations in component files).

import type { MessageKey } from '@repo/i18n';
import type { LucideIcon } from 'lucide-react-native';
import type { ReactNode } from 'react';

export type HeaderProps = {
  /** Right-side contextual actions (search, compose, gear, Premium pill, …). */
  right?: ReactNode;
  /** Centered title instead of the brand lockup (e.g. "Saved"). */
  title?: string;
  /** Small PRO chip after the logo (handoff §5 social header). */
  showProChip?: boolean;
  /** Back chevron instead of the hamburger. */
  showBack?: boolean;
  onBack?: (() => void) | undefined;
};

export type DrawerItem = {
  key: string;
  labelKey: MessageKey<'Shell'>;
  icon: LucideIcon;
  badge?: number | 'PRO';
  route?: string;
};

export type Tab = {
  key: string;
  labelKey: MessageKey<'Shell'>;
  route: string;
  icon?: LucideIcon;
  avatar?: boolean;
};

export type LioMessage = { id: number; role: 'lio' | 'user'; text: string };
