import type { Nullable } from './common';

// The rich reader profile (handoff §6.4) — a domain aggregate shared by both
// apps. Only stable data lives here: user-visible chrome (section titles, stat
// labels, button text) is keyed and resolved from @repo/i18n in the UI, never
// stored on the model. Display-formatted counts (e.g. "1.2k", "2.1M") arrive
// pre-formatted from the server.

// Identity / about block (hero + bio).
export interface ProfileIdentity {
  name: string;
  handle: string;
  /** 1–2 char monogram for the avatar fallback. */
  initials: string;
  /** Stable avatar hue 0–360. */
  hue: number;
  verified: boolean;
  /** Reader level label (e.g. "Bibliophile") — server-provided/localized. */
  readerLevel: string;
  profession: string;
  degree: string;
  university: string;
  city: string;
  country: string;
  /** Join date label (e.g. "March 2021") — server-provided/localized. */
  joined: string;
  bio: string;
  philosophy: string;
  interests: string[];
  genres: string[];
}

// Reading statistics — the UI maps each key to an icon + i18n label.
export type ProfileStatKey =
  | 'read'
  | 'year'
  | 'streak'
  | 'pages'
  | 'reviews'
  | 'clubs'
  | 'followers'
  | 'following';

export interface ProfileStat {
  key: ProfileStatKey;
  /** Pre-formatted for display (e.g. "247", "18.2k"). */
  value: string;
}

// A small person reference (social-proof avatars).
export interface ProfilePerson {
  initials: string;
  hue: number;
  name: Nullable<string>;
}

// "Followed by Amara, James +1.2k" social-proof row.
export interface ProfileSocialProof {
  people: ProfilePerson[];
  names: string[];
  /** Pre-formatted remainder count (e.g. "1.2k"). */
  othersLabel: string;
}

// A rated book reference (favourite, recently finished). `tone`/`rating` are
// optional; omit `tone` to derive a cover tone from the title.
export interface ProfileBook {
  title: string;
  author: string;
  tone: Nullable<number>;
  rating: Nullable<number>;
}

export interface FavoriteBook {
  title: string;
  series: Nullable<string>;
  author: string;
  tone: Nullable<number>;
  rating: number;
}

export interface FavoriteAuthor {
  name: string;
  initials: string;
  hue: number;
  note: string;
  books: number;
  /** Pre-formatted (e.g. "2.1M"). */
  followers: string;
}

export interface FavoriteQuote {
  text: string;
  speaker: string;
  source: string;
}

export interface ProfileFavorites {
  book: FavoriteBook;
  author: FavoriteAuthor;
  quote: FavoriteQuote;
}

export interface CurrentRead {
  title: string;
  author: string;
  tone: Nullable<number>;
  page: number;
  pages: number;
  /** Percent complete 0–100. */
  pct: number;
}

export interface NextRead {
  title: string;
  author: string;
  tone: Nullable<number>;
  note: string;
}

export interface ShelfBook {
  title: string;
  author: string;
  tone: Nullable<number>;
}

export type ShelfKey = 'read' | 'current' | 'want' | 'favorites' | 'recommended';

export interface Shelf {
  key: ShelfKey;
  count: number;
  books: ShelfBook[];
}

export type WriterWorkKind = 'book' | 'article' | 'blog' | 'publication';

export interface WriterWork {
  kind: WriterWorkKind;
  title: string;
  meta: string;
}

export interface ProfileWriter {
  website: string;
  works: WriterWork[];
}

export interface ReadingGoal {
  done: number;
  target: number;
}

export interface MonthProgress {
  done: number;
  target: number;
  /** Month label (e.g. "June") — server-provided/localized. */
  label: string;
}

export type ReadingFormatKey = 'physical' | 'ebook' | 'audiobook';

export interface ReadingFormat {
  key: ReadingFormatKey;
  active: boolean;
}

export interface ReadingLife {
  goal: ReadingGoal;
  month: MonthProgress;
  /** Favourite reading time label (e.g. "Late night") — server-provided. */
  favoriteTime: string;
  formats: ReadingFormat[];
  languages: string[];
}

export interface ReaderProfile {
  identity: ProfileIdentity;
  stats: ProfileStat[];
  socialProof: ProfileSocialProof;
  favorites: ProfileFavorites;
  currentlyReading: CurrentRead[];
  upNext: NextRead;
  recentlyFinished: ProfileBook[];
  shelves: Shelf[];
  writer: ProfileWriter;
  readingLife: ReadingLife;
}
