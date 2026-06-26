// Reader Network (handoff Friends) — a discovery hub that surfaces people by
// books, authors and reading habits rather than a generic follower list. Shared
// domain shapes; each app formats counts and renders the match rings in its UI.

// What a compatibility score is based on — drives the ring/chip accent colour.
export type ReaderMatchKind = 'reading' | 'literary' | 'author' | 'genre';

// A reader surfaced anywhere in the network — one rich shape consumed by the
// section cards and the preview sheet (fields are present per the surface).
export interface NetworkReader {
  id: string;
  name: string;
  initials: string;
  /** Avatar hue 0–360. */
  hue: number;
  online: boolean;
  /** Profession or role byline (e.g. "Literary translator"). */
  role: string;
  country?: string;
  /** University role line (e.g. "Student · Literature"). */
  university?: string;
  /** Compatibility score 0–100. */
  score?: number;
  kind?: ReaderMatchKind;
  /** A favourite/shared book shown as a cover thumbnail. */
  book?: { title: string; author: string; tone: number };
  /** The book a compatibility match shares with the reader ("You both love"). */
  sharedBook?: string;
  /** Why-you-match reasons, shown as chips. */
  basis?: string[];
  mutualFriends?: number;
  mutualClubs?: number;
  sharedBooks?: number;
  /** Already-connected reader (drives the sheet's friend-mode actions). */
  isFriend?: boolean;
}

// An incoming connection request.
export interface NetworkRequest {
  id: string;
  name: string;
  initials: string;
  hue: number;
  role: string;
  mutualFriends: number;
  mutualClubs: number;
}

// The reader's network surface (handoff Friends) — the sections the mobile screen
// renders, in scroll order.
export interface ReaderNetwork {
  requests: NetworkRequest[];
  friends: NetworkReader[];
  mayKnow: NetworkReader[];
  topMatches: NetworkReader[];
  university: NetworkReader[];
}
