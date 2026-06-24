// Global search (handoff §6.2 social header search): people + trending tags.
// Shared by both apps; result rendering differs per app.

export interface SearchPerson {
  kind: 'person';
  id: string;
  name: string;
  username: string;
  initials: string;
  /** Stable avatar hue 0–360. */
  hue: number;
  /** e.g. "12 mutual friends". */
  mutual?: string;
}

export interface SearchTag {
  kind: 'tag';
  /** Hashtag including the leading #, e.g. "#FantasyFebruary". */
  tag: string;
  /** Count label, e.g. "2.4k posts". */
  posts: string;
}

export interface SearchClub {
  kind: 'club';
  id: string;
  name: string;
  /** e.g. "Reading Group", "Publisher", "Author Community". */
  category: string;
  /** Count label, e.g. "1.2k members". */
  members: string;
  initials: string;
  /** Stable monogram hue 0–360. */
  hue: number;
}

export type SearchResult = SearchPerson | SearchTag | SearchClub;
