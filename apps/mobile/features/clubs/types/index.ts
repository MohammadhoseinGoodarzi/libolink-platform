import type {
  AdaptationCommunity,
  AuthorCommunity,
  ClubListing,
  ClubSummary,
  ClubsDirectory,
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
  query: string;
  onQueryChange: (value: string) => void;
  onCreate: () => void;
};

// The directory's five carousels, addressable for the "see all" screen.
export type DirectoryCategory = 'my-clubs' | 'publishers' | 'series' | 'adaptations' | 'authors';

// "See all" sort options (top ranks / trending / newest / A–Z).
export type ClubSort = 'top' | 'trending' | 'new' | 'az';

// Publish-year (decade) buckets for the "see all" year filter.
export type ClubYear = 'all' | '2020s' | '2010s' | '2000s' | 'classic';

export type ClubListRowProps = {
  item: ClubListing;
  onOpen: (id: string) => void;
};

export type ClubSearchResultsProps = {
  directory: ClubsDirectory;
  query: string;
  onOpen: (id: string) => void;
};

export type ClubCategoryViewProps = {
  section: string;
};

export type ClubsSponsoredCardProps = {
  onPress: () => void;
};

export type MyClubsSectionProps = {
  clubs: ClubSummary[];
  onSeeAll: () => void;
  onOpen: (id: string) => void;
};

export type PublisherSectionProps = {
  publishers: PublisherCommunity[];
  onSeeAll: () => void;
  onOpen: (id: string) => void;
};

export type SeriesSectionProps = {
  series: ClubSummary[];
  onSeeAll: () => void;
  onOpen: (id: string) => void;
};

export type AdaptationsSectionProps = {
  adaptations: AdaptationCommunity[];
  onSeeAll: () => void;
  onOpen: (id: string) => void;
};

export type AuthorSectionProps = {
  authors: AuthorCommunity[];
  onSeeAll: () => void;
  onOpen: (id: string) => void;
};

export type ClubDetailViewProps = {
  id: string;
};
