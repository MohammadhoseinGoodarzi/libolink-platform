// Prop types for the shared mobile UI atoms (one organized folder, mirroring how
// @repo/types groups domain types). These reference RN/platform types, so they
// can't live in @repo/types. Component files import from here and never declare
// types inline (CLAUDE.md: no type declarations in component files).

import type { ComponentType, ReactNode } from 'react';
import type { PressableProps, ViewProps } from 'react-native';
import type { ButtonVariantProps } from '../button-variants';

export type SponsoredCardProps = {
  /** Monogram letter for the square mark. */
  letter: string;
  title: string;
  body: string;
  cta: string;
  /** Appended to the CTA as "{cta} · {brand}" when present. */
  brand?: string;
};

export type StarsProps = {
  /** Number of filled stars (0–5). */
  count: number;
  size?: number;
  /** Fill/stroke colour for filled stars; defaults to crimson (destructive). */
  color?: string;
};

export type AvatarProps = {
  /** Initials to render (1–2 chars). */
  initials: string;
  /** Stable hue 0–360. Omit to derive deterministically from `name`/initials. */
  hue?: number;
  name?: string | undefined;
  size?: number;
  online?: boolean;
  group?: boolean;
  /** People are round; clubs/communities use a rounded-square monogram (§5). */
  shape?: 'round' | 'square';
};

// A ringed avatar shared by the profile hero and the stories row (one component
// so both stay identical). `gradient` = crimson→navy story ring (unseen),
// `muted` = seen story ring, `frame` = the profile's thick card frame.
export type AvatarRingVariant = 'gradient' | 'muted' | 'frame';

export type AvatarRingProps = {
  variant: AvatarRingVariant;
  /** Inner avatar diameter; the ring/gap are added around it. */
  size: number;
  initials: string;
  name?: string | undefined;
  hue?: number;
  /** Overlay badges (story "+", verified tick) positioned over the outer ring. */
  children?: ReactNode;
};

export type BookCoverProps = {
  title: string;
  author?: string;
  /** Width in px; height is derived at the 1:1.4 hardcover ratio. */
  width?: number;
  /** Tone index; omit to derive deterministically from the title. */
  tone?: number;
  radius?: number;
};

export type BrandGradientProps = ViewProps & {
  children?: ReactNode;
};

export type ButtonProps = Omit<PressableProps, 'children'> &
  ButtonVariantProps & {
    asChild?: boolean;
    className?: string;
    textClassName?: string;
    children?: ReactNode;
  };

export type CardProps = ViewProps & {
  /** Soft shadow depth (handoff §7). `false` for flat surfaces (e.g. list rows). */
  shadow?: 'card' | 'lifted' | false;
};

export type FilterChipProps = {
  label: string;
  active?: boolean;
  count?: number;
  onPress?: () => void;
};

export type IconButtonProps = {
  children: ReactNode;
  accessibilityLabel: string;
  onPress?: (() => void) | undefined;
  size?: number;
  className?: string;
};

export type MessageBubbleProps = {
  mine: boolean;
  text?: string;
  time?: string;
  read?: boolean;
  children?: ReactNode;
};

export type ActionSheetAction = {
  label: string;
  icon?: ComponentType<{ size?: number; color?: string }>;
  danger?: boolean;
  bold?: boolean;
  onPress?: () => void;
};

export type ActionSheetProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  actions: ActionSheetAction[];
};

export type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Accessible label for the dialog. */
  label?: string;
  /** Fixed (non-scrolling) region rendered below the grabber, above children —
      e.g. a sheet title bar. Stays put while the body scrolls, and is counted
      against the sheet's height so the body never overflows the 90% box. */
  header?: ReactNode;
};

export type ToastContextValue = { show: (message: string) => void };
