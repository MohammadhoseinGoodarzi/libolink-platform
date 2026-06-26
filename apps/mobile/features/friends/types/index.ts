// View-only types for the Reader Network screen (handoff Friends). Domain shapes
// (NetworkReader, NetworkRequest, ReaderMatchKind) live in @repo/types.
import type { NetworkReader, NetworkRequest, ReaderMatchKind } from '@repo/types';
import type { ReactNode } from 'react';

export type FriendsSectionProps = {
  title: string;
  sub?: string;
  /** Trailing "See all" affordance; omit for no action. */
  action?: string;
  onAction?: () => void;
  /** Tighter top padding for the first section under the intro. */
  first?: boolean;
  children: ReactNode;
};

export type MatchRingProps = {
  score: number;
  kind: ReaderMatchKind;
  size?: number;
};

export type MatchChipProps = {
  score: number;
  kind: ReaderMatchKind;
};

export type AddButtonProps = {
  name: string;
  /** Larger 38px pill for the compatibility cards. */
  size?: 'sm' | 'md';
  /** Show the leading user-plus glyph. */
  icon?: boolean;
};

export type MyFriendsSectionProps = {
  friends: NetworkReader[];
  onOpen: (reader: NetworkReader) => void;
};

export type CompatibilitySectionProps = {
  matches: NetworkReader[];
  onOpen: (reader: NetworkReader) => void;
};

export type MayKnowSectionProps = {
  readers: NetworkReader[];
  onOpen: (reader: NetworkReader) => void;
};

export type UniversitySectionProps = {
  readers: NetworkReader[];
  onOpen: (reader: NetworkReader) => void;
};

export type RequestsSectionProps = {
  requests: NetworkRequest[];
};

export type ReaderSheetProps = {
  reader: NetworkReader | null;
  open: boolean;
  onClose: () => void;
};
