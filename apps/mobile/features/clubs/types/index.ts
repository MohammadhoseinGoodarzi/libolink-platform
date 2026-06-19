import type {
  AdaptationCommunity,
  AuthorCommunity,
  ClubSummary,
  PublisherCommunity,
} from '@repo/types';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

// View-only prop types for the Clubs feature (handoff §6.5). Domain shapes live
// in @repo/types and are consumed directly. One organized folder, never inline
// in component files (CLAUDE.md).

export type TonedGradientProps = {
  tone: number;
  className?: string;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

export type ClubLogoProps = {
  /** Monogram shown when no icon is given. */
  label?: string;
  /** Icon key (see CLUB_ICONS); takes precedence over the monogram. */
  icon?: string;
  tone: number;
  size?: number;
  radius?: number;
};

export type ClubBannerProps = {
  tone: number;
  /** Ghosted watermark icon key (see CLUB_ICONS). */
  icon?: string;
  height: number;
  radius?: number;
  children?: ReactNode;
};

export type ClubsSectionProps = {
  title: string;
  sub?: string;
  /** Trailing action label (e.g. "See all"); shown with a chevron. */
  action?: string;
  onAction?: () => void;
  first?: boolean;
  children: ReactNode;
};

export type DirectoryIntroProps = {
  onSearch: () => void;
  onCreate: () => void;
};

export type ClubsSponsoredCardProps = {
  onPress: () => void;
};

export type MyClubsSectionProps = {
  clubs: ClubSummary[];
  onSeeAll: () => void;
};

export type PublisherSectionProps = {
  publishers: PublisherCommunity[];
  onSeeAll: () => void;
};

export type SeriesSectionProps = {
  series: ClubSummary[];
  onSeeAll: () => void;
};

export type AdaptationsSectionProps = {
  adaptations: AdaptationCommunity[];
  onSeeAll: () => void;
};

export type AuthorSectionProps = {
  authors: AuthorCommunity[];
  onSeeAll: () => void;
};
