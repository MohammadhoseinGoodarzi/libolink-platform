// Saved (handoff) — the reader's personal bookmarked collection, reached from the
// drawer. Everything kept across Libolink (books, posts) surfaced into one place.
// Shared domain shapes; each app formats counts/timestamps in its own UI.

// A bookmarked book.
export interface SavedBook {
  id: string;
  title: string;
  author: string;
  /** Book-cover tone index. */
  tone: number;
  /** ISO timestamp the reader saved it — drives the recent/oldest sort + label. */
  savedAt: string;
  /** How many times the reader has opened it — drives the "Most Visited" sort. */
  visits: number;
}

// A bookmarked post from the feed.
export interface SavedPost {
  id: string;
  author: string;
  /** Author initials for the avatar. */
  initials: string;
  /** Author avatar hue (0–360). */
  hue: number;
  /** Author byline (e.g. "Literary translator"). */
  role: string;
  online: boolean;
  body: string;
  /** A related book attached to the post, if any. */
  book: { title: string; author: string; tone: number } | null;
  likes: number;
  comments: number;
  shares: number;
  liked: boolean;
  /** ISO timestamp the reader saved it. */
  savedAt: string;
  visits: number;
}

// The reader's full saved collection (handoff Saved).
export interface SavedCollection {
  books: SavedBook[];
  posts: SavedPost[];
}
