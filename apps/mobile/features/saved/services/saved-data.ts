import type { SavedBook, SavedCollection, SavedPost } from '@repo/types';

// Offline Saved data (handoff Saved) — the same reader persona as the rest of the
// app. Everything bookmarked across Libolink (books, posts) in one collection.
// All imagery is offline-safe: generated book covers (tones) + initials avatars.

// ISO timestamp `days` before now — drives the recent/oldest sort + "Saved Nd" label.
const daysAgo = (days: number): string => new Date(Date.now() - days * 86_400_000).toISOString();

const SAVED_BOOKS: SavedBook[] = [
  {
    id: 'b1',
    title: 'One Hundred Years of Solitude',
    author: 'Gabriel García Márquez',
    tone: 2,
    savedAt: daysAgo(2),
    visits: 14,
  },
  {
    id: 'b2',
    title: 'The Brothers Karamazov',
    author: 'Fyodor Dostoevsky',
    tone: 5,
    savedAt: daysAgo(5),
    visits: 9,
  },
  {
    id: 'b3',
    title: 'Invisible Cities',
    author: 'Italo Calvino',
    tone: 4,
    savedAt: daysAgo(7),
    visits: 21,
  },
  {
    id: 'b4',
    title: 'Kafka on the Shore',
    author: 'Haruki Murakami',
    tone: 1,
    savedAt: daysAgo(14),
    visits: 6,
  },
  {
    id: 'b5',
    title: 'The Blind Owl',
    author: 'Sadegh Hedayat',
    tone: 0,
    savedAt: daysAgo(21),
    visits: 11,
  },
];

const SAVED_POSTS: SavedPost[] = [
  {
    id: 'p1',
    author: 'Amara Cohen',
    initials: 'AC',
    hue: 18,
    role: 'Literary translator',
    online: true,
    body: 'Re-reading Márquez in the original and the magic hits differently — every sentence is a small flood of time.',
    book: { title: 'One Hundred Years of Solitude', author: 'Gabriel García Márquez', tone: 2 },
    likes: 248,
    comments: 31,
    shares: 12,
    liked: false,
    savedAt: daysAgo(1),
    visits: 8,
  },
  {
    id: 'p2',
    author: 'Daniyar Iskakov',
    initials: 'DI',
    hue: 95,
    role: 'Philosophy lecturer',
    online: false,
    body: "Dostoevsky doesn't write characters, he writes arguments that breathe. Ivan's chapter still keeps me up at night.",
    book: { title: 'The Brothers Karamazov', author: 'Fyodor Dostoevsky', tone: 5 },
    likes: 512,
    comments: 88,
    shares: 34,
    liked: true,
    savedAt: daysAgo(4),
    visits: 17,
  },
  {
    id: 'p3',
    author: 'Lina Soltani',
    initials: 'LS',
    hue: 300,
    role: 'MFA candidate',
    online: true,
    body: 'A thread on why translated fiction is the quiet revolution of the decade. Twelve books that changed how I read.',
    book: null,
    likes: 173,
    comments: 24,
    shares: 9,
    liked: false,
    savedAt: daysAgo(8),
    visits: 4,
  },
];

export const SAVED_COLLECTION: SavedCollection = { books: SAVED_BOOKS, posts: SAVED_POSTS };
