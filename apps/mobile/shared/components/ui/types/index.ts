// Prop types for the shared mobile UI atoms (one organized folder, mirroring how
// @repo/types groups domain types). These reference RN/platform types, so they
// can't live in @repo/types. Component files import from here and never declare
// types inline (CLAUDE.md: no type declarations in component files).

import type { ComponentType, ReactNode } from 'react';
import type {
  PressableProps,
  ScrollViewProps,
  StyleProp,
  TextInputProps,
  ViewProps,
  ViewStyle,
} from 'react-native';
import type { ButtonVariantProps } from '../button-variants';

// A full-screen page ScrollView that always reserves the device's bottom
// safe-area inset at the end of its content (home indicator / gesture bar).
// Use this for every stacked/full-screen scrollable page instead of a raw
// <ScrollView> + hand-rolled `pb-*` — that's how a page can forget the inset.
export type ScreenScrollViewProps = ScrollViewProps & {
  /** Breathing room ON TOP of the safe-area inset (default 24). */
  bottomSpacing?: number;
  /** Gap kept between a focused input and the keyboard top (default 24). */
  bottomOffset?: number;
};

// iOS-style toggle (handoff Settings kit) — the ONE switch. Settings rows and any
// boolean control toggle through this, never a hand-rolled track + knob.
export type SwitchProps = {
  on: boolean;
  onToggle: () => void;
  disabled?: boolean;
  accessibilityLabel?: string;
};

// The single shared TextInput primitive. Renders bare (just the styled TextInput)
// unless a box affordance is supplied (`left`/`right`/`containerClassName`/
// `containerStyle`), in which case it lays out as
// `‹View flex-row items-center› {left} ‹TextInput flex-1› {right}`.
export type InputBaseProps = TextInputProps & {
  /** Leading element inside the box (icon, prefix). Presence switches to boxed mode. */
  left?: ReactNode;
  /** Trailing element inside the box (toggle, check). Presence switches to boxed mode. */
  right?: ReactNode;
  /** Box-wrapper className (boxed mode). Presence switches to boxed mode. */
  containerClassName?: string;
  /** Box-wrapper style for props NativeWind can't read (e.g. a dynamic border). */
  containerStyle?: StyleProp<ViewStyle>;
};

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
  /** `elevated` = soft shadow (default); `flat` = bordered + shadowless. */
  variant?: 'elevated' | 'flat';
  /** Add the common 16px inset (p-4) instead of hand-rolling it. */
  padded?: boolean;
  /** Soft shadow depth (elevated only, handoff §7). `false` for flat surfaces (e.g. list rows). */
  shadow?: 'card' | 'lifted' | false;
};

export type FilterChipProps = {
  label: string;
  active?: boolean;
  count?: number | undefined;
  onPress?: (() => void) | undefined;
};

// Static colour schemes for a non-selectable Chip (interactive chips derive their
// scheme from the active state instead).
export type ChipTone = 'neutral' | 'muted' | 'primary' | 'accent';
export type ChipSize = 'sm' | 'default';

export type ChipProps = {
  label: string;
  icon?: ComponentType<{ size?: number; color?: string }>;
  iconSize?: number;
  /** Static colour scheme; ignored while a selectable chip is active. */
  tone?: ChipTone;
  size?: ChipSize;
  /** Interactive, toggleable filter chip (Pressable + selected a11y state). */
  selectable?: boolean;
  active?: boolean;
  /** Trailing crimson count badge (e.g. Unread · 2). */
  count?: number | undefined;
  onPress?: (() => void) | undefined;
  className?: string;
  textClassName?: string;
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

// Where a ModalShell panel sits and how it animates in: `bottom` slides up
// (sheets), `left` slides in from the left edge (the drawer), `full` fades a
// full-screen panel (story viewer, search overlay).
export type ModalShellPlacement = 'bottom' | 'left' | 'full';

// The one Modal + scrim + slide/fade + mount/unmount lifecycle primitive. Every
// overlay (BottomSheet, ActionSheet, the drawer, and the full-screen screens)
// builds on this instead of re-writing the Modal/Animated plumbing. Built on RN
// Modal + Animated only (no gesture-handler) — drag-to-dismiss is intentionally
// absent (see docs/ENGINEERING_LOG.md 2026-06-22).
export type ModalShellProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Panel placement + entry animation. Defaults to `bottom`. */
  placement?: ModalShellPlacement;
  /** Render the dimming scrim with tap-to-dismiss. Defaults true except `full`. */
  scrim?: boolean;
  /** Accessible label for the scrim's close control. */
  closeLabel?: string;
  /** Fade the panel opacity with the transition. Defaults true except `left`. */
  fadePanel?: boolean;
  /** Distance (px) a `left` panel slides in by — also its width. Ignored otherwise. */
  slideDistance?: number;
  /** Panel surface className. */
  panelClassName?: string;
  /** Panel style for props NativeWind can't read (radius, maxHeight, dynamic padding). */
  panelStyle?: StyleProp<ViewStyle>;
  /** Accessible label on the panel (dialog). */
  label?: string | undefined;
  /** Enter/exit durations (ms) + easing curve. Defaults to the soft sheet curve. */
  enterDuration?: number;
  exitDuration?: number;
  easing?: (value: number) => number;
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
