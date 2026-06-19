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
