// A chat contact's profile (handoff §6.3 — Telegram-style contact page). Opened
// from the chat header; the backend will populate this, mocked for now.

export interface MutualClub {
  id: string;
  name: string;
  book: string | null;
}

export interface SharedBook {
  title: string;
  author: string;
}

export interface ContactProfile {
  id: string;
  name: string;
  handle: string;
  online: boolean;
  bio: string;
  mutualClubs: MutualClub[];
  sharedBooks: SharedBook[];
  /** Count of shared photos (rendered as placeholders until media exists). */
  sharedPhotos: number;
}
