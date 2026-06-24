import type {
  CurrentRead,
  NextRead,
  Nullable,
  ProfileBook,
  ProfileFavorites,
  ProfileIdentity,
  ProfileSocialProof,
  ProfileStat,
  ProfileWriter,
  ReadingLife,
  Shelf,
} from '@repo/types';
import type { LucideIcon } from 'lucide-react-native';
import type { ReactNode } from 'react';

// View-only prop types for the Profile feature (handoff §6.4). Domain shapes
// live in @repo/types and are consumed directly; these cover presentation
// concerns the API contract doesn't own. One organized folder, never inline in
// the component files (CLAUDE.md).

// Whether the screen renders the owner's own controls or the visitor view.
export type ProfileMode = 'owner' | 'visitor';

export type ProfileViewProps = {
  /** Load another reader's profile (visitor mode, pushed screen with a back
      button). Omit for the signed-in user's own profile on the Profile tab. */
  readerId?: string;
};

export type SectionProps = {
  title: string;
  sub?: string;
  icon?: LucideIcon;
  /** Trailing action label (e.g. "See all"); shown with a chevron. */
  action?: string;
  onAction?: () => void;
  /** Tightens the top padding for the first section under the hero. */
  first?: boolean;
  children: ReactNode;
};

export type ChipProps = {
  label: string;
  icon?: LucideIcon;
};

export type CoverCardProps = {
  title: string;
  author: string;
  tone: Nullable<number>;
  width?: number;
  children?: ReactNode;
};

export type ProgressBarProps = {
  /** Percent complete 0–100. */
  pct: number;
};

export type ProgressRingProps = {
  done: number;
  target: number;
  /** Small caption under the value (e.g. "of 50"). */
  caption: string;
  size?: number;
};

export type ProfileHeroProps = {
  identity: ProfileIdentity;
  mode: ProfileMode;
  following: boolean;
  onEdit: () => void;
  onShare: () => void;
  onPreview: () => void;
  onFollow: () => void;
  onMessage: () => void;
  onInvite: () => void;
};

export type FollowCountsProps = {
  stats: ProfileStat[];
  socialProof: ProfileSocialProof;
};

export type BioSectionProps = {
  identity: ProfileIdentity;
};

export type FavoritesSectionProps = {
  favorites: ProfileFavorites;
  genres: string[];
};

export type StatsSectionProps = {
  stats: ProfileStat[];
};

export type ReadingJourneyProps = {
  currentlyReading: CurrentRead[];
  upNext: NextRead;
  recentlyFinished: ProfileBook[];
};

export type LibrarySectionProps = {
  shelves: Shelf[];
};

export type WriterSectionProps = {
  writer: ProfileWriter;
};

export type ReadingLifeSectionProps = {
  readingLife: ReadingLife;
};
