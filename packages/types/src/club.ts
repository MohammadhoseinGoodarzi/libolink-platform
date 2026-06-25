// Clubs & Communities directory (handoff §6.5) — domain shapes shared by both
// apps. Counts are raw numbers; the UI formats them with @repo/utils
// formatCompactNumber. Icon keys map to lucide icons in each app's UI.

export type ClubActivity = 'buzzing' | 'high' | 'medium' | 'steady' | 'new';

// A community shown as a gradient-monogram tile or banner (my clubs, series).
export interface ClubSummary {
  id: string;
  name: string;
  /** Monogram for the logo tile (e.g. "ML"). */
  logo: string;
  members: number;
  /** Gradient tone index. */
  tone: number;
  /** Icon key for the banner watermark. */
  icon: string;
  activity: ClubActivity;
}

export interface PublisherCommunity {
  id: string;
  name: string;
  logo: string;
  followers: number;
  tone: number;
  icon: string;
}

export interface AdaptationCommunity {
  id: string;
  name: string;
  book: string;
  author: string;
  /** Screen label, e.g. "Film · 2021", "TV · Netflix". */
  screen: string;
  members: number;
  /** Book-cover tone index. */
  bookTone: number;
}

export interface AuthorCommunity {
  id: string;
  name: string;
  initials: string;
  hue: number;
  members: number;
  books: number;
}

export interface ClubsDirectory {
  myClubs: ClubSummary[];
  publishers: PublisherCommunity[];
  series: ClubSummary[];
  adaptations: AdaptationCommunity[];
  authors: AuthorCommunity[];
}

// Which kind of community a detail page represents — drives the header label
// ("Book Club" / "Publisher" / …) and whether membership reads "Joined"/"Following".
export type ClubKind = 'club' | 'publisher' | 'series' | 'adaptation' | 'author';

// A single member shown in the detail page's stacked-avatar preview row.
export interface ClubMember {
  id: string;
  name: string;
  initials: string;
  /** Avatar hue (0–360), same allowance as people avatars. */
  hue: number;
}

// The book a club is currently reading together (detail page hero).
export interface ClubBook {
  title: string;
  author: string;
  /** Book-cover tone index. */
  tone: number;
}

// Topic/category a community belongs to — drives the "see all" genre filter.
export type ClubGenre =
  | 'fantasy'
  | 'mystery'
  | 'scifi'
  | 'romance'
  | 'literary'
  | 'classics'
  | 'nonfiction';

// A uniform community card for paginated lists (the "see all" screen) and the
// directory search — one shape across every kind. Authors carry an `avatar`
// (round); every other kind renders its square `logo`. `count` is members, except
// publishers where it's followers (derive from `kind`).
export interface ClubListing {
  id: string;
  name: string;
  kind: ClubKind;
  count: number;
  logo: string;
  tone: number;
  icon: string;
  avatar: { initials: string; hue: number } | null;
  activity: ClubActivity;
  genre: ClubGenre;
  /** Year the community was founded — drives the publish-year (decade) filter. */
  year: number;
}

// Full community detail (handoff §6.5 phase-2) — opened from any directory tile
// and from a club conversation's "View Club". Counts are raw numbers; the UI
// formats them with @repo/utils formatCompactNumber.
export interface ClubDetail {
  id: string;
  name: string;
  kind: ClubKind;
  /** Monogram for the logo tile (square communities). */
  logo: string;
  /** Gradient tone index. */
  tone: number;
  /** Icon key for the banner watermark / logo (see CLUB_ICONS). */
  icon: string;
  /** members (clubs/series/authors) or followers (publishers). */
  members: number;
  /** How many members are online right now. */
  online: number;
  activity: ClubActivity;
  about: string;
  /** Topical tags shown as chips. */
  tags: string[];
  /** The book the club is currently reading, if any. */
  currentBook: ClubBook | null;
  /** A few members previewed as a stacked-avatar row. */
  memberPreview: ClubMember[];
  /** Whether the signed-in reader has joined/followed. */
  joined: boolean;
}
