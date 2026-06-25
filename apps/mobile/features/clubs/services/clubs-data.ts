import type {
  ClubActivity,
  ClubDetail,
  ClubKind,
  ClubListing,
  ClubMember,
  ClubsDirectory,
} from '@repo/types';
import { categoryListings, isDirectoryCategory } from '../lib/directory-items';

// Offline Clubs directory (handoff §6.5). Counts are raw numbers; the UI formats
// them with @repo/utils formatCompactNumber. Swap the mock client for the real
// one and this file goes away.
export const CLUBS_DIRECTORY: ClubsDirectory = {
  myClubs: [
    {
      id: 'f1',
      name: 'The Midnight Library Club',
      logo: 'ML',
      members: 48200,
      tone: 2,
      icon: 'book',
      activity: 'buzzing',
    },
    {
      id: 'f2',
      name: 'Fantasy Realms',
      logo: 'FR',
      members: 126400,
      tone: 3,
      icon: 'wand',
      activity: 'high',
    },
    {
      id: 'f3',
      name: 'Mystery & Mayhem',
      logo: 'MM',
      members: 73900,
      tone: 1,
      icon: 'masks',
      activity: 'high',
    },
    {
      id: 'f4',
      name: 'Translated Fiction Society',
      logo: 'TF',
      members: 31500,
      tone: 4,
      icon: 'globe',
      activity: 'medium',
    },
  ],
  publishers: [
    {
      id: 'p1',
      name: 'Oxford University Press Readers',
      logo: 'OUP',
      followers: 64800,
      tone: 2,
      icon: 'gradCap',
    },
    {
      id: 'p2',
      name: 'Goethe Publishing Community',
      logo: 'GP',
      followers: 28300,
      tone: 5,
      icon: 'feather',
    },
    {
      id: 'p3',
      name: 'Penguin Books Community',
      logo: 'PB',
      followers: 218400,
      tone: 0,
      icon: 'book',
    },
    {
      id: 'p4',
      name: 'HarperCollins Readers',
      logo: 'HC',
      followers: 132900,
      tone: 1,
      icon: 'book',
    },
    {
      id: 'p5',
      name: 'Simon & Schuster Community',
      logo: 'S&S',
      followers: 97600,
      tone: 3,
      icon: 'book',
    },
    { id: 'p6', name: 'Macmillan Readers', logo: 'MR', followers: 71200, tone: 6, icon: 'book' },
  ],
  series: [
    {
      id: 's1',
      name: 'Harry Potter Fans',
      logo: 'HP',
      members: 312000,
      tone: 3,
      icon: 'wand',
      activity: 'buzzing',
    },
    {
      id: 's2',
      name: 'The Lord of the Rings Community',
      logo: 'LR',
      members: 184500,
      tone: 0,
      icon: 'globe',
      activity: 'high',
    },
    {
      id: 's3',
      name: 'A Song of Ice and Fire Readers',
      logo: 'IF',
      members: 142800,
      tone: 1,
      icon: 'book',
      activity: 'high',
    },
    {
      id: 's4',
      name: 'Percy Jackson Club',
      logo: 'PJ',
      members: 96300,
      tone: 4,
      icon: 'sparkles',
      activity: 'high',
    },
    {
      id: 's5',
      name: 'Sherlock Holmes Readers',
      logo: 'SH',
      members: 71200,
      tone: 6,
      icon: 'masks',
      activity: 'medium',
    },
    {
      id: 's6',
      name: 'Narnia Readers',
      logo: 'NR',
      members: 58400,
      tone: 5,
      icon: 'wand',
      activity: 'medium',
    },
  ],
  adaptations: [
    {
      id: 'a1',
      name: 'Dune Community',
      book: 'Dune',
      author: 'Frank Herbert',
      screen: 'Film · 2021',
      members: 88700,
      bookTone: 5,
    },
    {
      id: 'a2',
      name: 'The Hunger Games',
      book: 'The Hunger Games',
      author: 'Suzanne Collins',
      screen: 'Film series',
      members: 134200,
      bookTone: 1,
    },
    {
      id: 'a3',
      name: 'The Witcher Readers',
      book: 'The Last Wish',
      author: 'Andrzej Sapkowski',
      screen: 'TV · Netflix',
      members: 102600,
      bookTone: 0,
    },
    {
      id: 'a4',
      name: 'The Maze Runner',
      book: 'The Maze Runner',
      author: 'James Dashner',
      screen: 'Film series',
      members: 47300,
      bookTone: 4,
    },
    {
      id: 'a5',
      name: 'Shadow and Bone',
      book: 'Shadow and Bone',
      author: 'Leigh Bardugo',
      screen: 'TV · Netflix',
      members: 65100,
      bookTone: 3,
    },
    {
      id: 'a6',
      name: 'The Fault in Our Stars',
      book: 'The Fault in Our Stars',
      author: 'John Green',
      screen: 'Film · 2014',
      members: 53800,
      bookTone: 2,
    },
  ],
  authors: [
    {
      id: 'au1',
      name: 'J.K. Rowling Readers',
      initials: 'JR',
      hue: 300,
      members: 287000,
      books: 14,
    },
    { id: 'au2', name: 'J.R.R. Tolkien Fans', initials: 'JT', hue: 95, members: 173400, books: 18 },
    {
      id: 'au3',
      name: 'George R.R. Martin Community',
      initials: 'GM',
      hue: 18,
      members: 138900,
      books: 12,
    },
    {
      id: 'au4',
      name: 'Agatha Christie Readers',
      initials: 'AC',
      hue: 268,
      members: 112600,
      books: 66,
    },
    {
      id: 'au5',
      name: 'Stephen King Community',
      initials: 'SK',
      hue: 12,
      members: 204300,
      books: 64,
    },
    {
      id: 'au6',
      name: 'Haruki Murakami Readers',
      initials: 'HM',
      hue: 210,
      members: 96800,
      books: 22,
    },
  ],
};

// ─── Club detail (handoff §6.5 phase-2) ──────────────────────────────────────
// The detail page is opened from any directory tile and from a club
// conversation's "View Club". The mock derives a ClubDetail from the directory
// (so names/tones match the tile that was tapped) and falls back to a generic
// community for ids it doesn't recognise — e.g. a conversation id coming from
// Messages. Swap the mock client for the real one and this derivation goes away.

const SAMPLE_MEMBERS: ClubMember[] = [
  { id: 'm1', name: 'Amara Okafor', initials: 'AO', hue: 280 },
  { id: 'm2', name: 'James Whitfield', initials: 'JW', hue: 210 },
  { id: 'm3', name: 'Sofia Marquez', initials: 'SM', hue: 12 },
  { id: 'm4', name: 'Theo Almeida', initials: 'TA', hue: 150 },
  { id: 'm5', name: 'Lena Vogel', initials: 'LV', hue: 330 },
];

const SAMPLE_TAGS: Record<ClubKind, string[]> = {
  club: ['Discussion', 'Monthly read', 'Spoiler-free'],
  series: ['Lore', 'Re-reads', 'Theories'],
  publisher: ['New releases', 'ARCs', 'Author Q&As'],
  adaptation: ['Book vs screen', 'Watch-along', 'Casting'],
  author: ['Backlist', 'Interviews', 'Read-alikes'],
};

const ABOUT: Record<ClubKind, string> = {
  club: 'A warm corner for readers who love to talk about what they read. We pick a book each month, share notes as we go, and meet for a live chat at the end.',
  series:
    'Everything inside one literary universe — timelines, theories, re-reads and the occasional friendly argument about the ending.',
  publisher:
    'Follow the house behind the books: new releases, early reading copies, and conversations with the editors and authors who make them.',
  adaptation:
    'For readers who love the book and the screen version. We compare, watch along, and debate every casting choice.',
  author:
    'Gather around a favourite voice — backlist deep-dives, interviews, and recommendations for what to read next.',
};

interface DirectoryHit {
  name: string;
  kind: ClubKind;
  logo: string;
  tone: number;
  icon: string;
  members: number;
  activity: ClubDetail['activity'];
  book?: { title: string; author: string; tone: number };
}

// Flatten every directory entry into one id→summary lookup the detail builder
// can resolve, normalising the per-kind shapes (followers→members, etc.).
function findInDirectory(id: string): DirectoryHit | undefined {
  for (const c of CLUBS_DIRECTORY.myClubs) {
    if (c.id === id) {
      return {
        name: c.name,
        kind: 'club',
        logo: c.logo,
        tone: c.tone,
        icon: c.icon,
        members: c.members,
        activity: c.activity,
      };
    }
  }
  for (const c of CLUBS_DIRECTORY.series) {
    if (c.id === id) {
      return {
        name: c.name,
        kind: 'series',
        logo: c.logo,
        tone: c.tone,
        icon: c.icon,
        members: c.members,
        activity: c.activity,
      };
    }
  }
  for (const p of CLUBS_DIRECTORY.publishers) {
    if (p.id === id) {
      return {
        name: p.name,
        kind: 'publisher',
        logo: p.logo,
        tone: p.tone,
        icon: p.icon,
        members: p.followers,
        activity: 'high',
      };
    }
  }
  for (const a of CLUBS_DIRECTORY.adaptations) {
    if (a.id === id) {
      return {
        name: a.name,
        kind: 'adaptation',
        logo: a.book.slice(0, 2).toUpperCase(),
        tone: a.bookTone,
        icon: 'film',
        members: a.members,
        activity: 'high',
        book: { title: a.book, author: a.author, tone: a.bookTone },
      };
    }
  }
  for (const a of CLUBS_DIRECTORY.authors) {
    if (a.id === id) {
      return {
        name: a.name,
        kind: 'author',
        logo: a.initials,
        tone: a.hue % 8,
        icon: 'feather',
        members: a.members,
        activity: 'medium',
      };
    }
  }
  return undefined;
}

export function getClubDetail(id: string): ClubDetail {
  const hit = findInDirectory(id);
  const kind: ClubKind = hit?.kind ?? 'club';
  const members = hit?.members ?? 12400;
  return {
    id,
    name: hit?.name ?? 'Reading Circle',
    kind,
    logo: hit?.logo ?? 'RC',
    tone: hit?.tone ?? 2,
    icon: hit?.icon ?? 'book',
    members,
    online: Math.max(1, Math.round(members * 0.012)),
    activity: hit?.activity ?? 'medium',
    about: ABOUT[kind],
    tags: SAMPLE_TAGS[kind],
    currentBook:
      hit?.book ??
      (kind === 'author' || kind === 'publisher'
        ? null
        : { title: 'Klara and the Sun', author: 'Kazuo Ishiguro', tone: 4 }),
    memberPreview: SAMPLE_MEMBERS,
    // Tiles in "My Clubs" are already joined; everything else starts un-joined.
    joined: CLUBS_DIRECTORY.myClubs.some((c) => c.id === id),
  };
}

// ─── Paginated category listing (handoff §6.5 phase-2, "see all") ─────────────
// The directory carousels only hold a handful of items each; to give the "see
// all" screen a real infinite-scroll catalogue, we expand each real community
// into regional chapters with varied counts/tones/activity. Swap the mock client
// for the real one and this generator goes away (the backend paginates instead).

const CHAPTERS = [
  'London',
  'Berlin',
  'Tokyo',
  'New York',
  'Toronto',
  'Sydney',
  'Lagos',
  'Mumbai',
  'Paris',
  'São Paulo',
  'Cairo',
  'Seoul',
];
const ACTIVITY_CYCLE: ClubActivity[] = ['buzzing', 'high', 'medium', 'steady', 'new'];
const VARIANTS_PER_BASE = 9;

function expand(base: ClubListing[]): ClubListing[] {
  const out: ClubListing[] = [...base];
  base.forEach((b, bi) => {
    for (let i = 0; i < VARIANTS_PER_BASE; i++) {
      const n = bi * VARIANTS_PER_BASE + i;
      const chapter = CHAPTERS[n % CHAPTERS.length] ?? 'Global';
      const activity = ACTIVITY_CYCLE[n % ACTIVITY_CYCLE.length] ?? 'medium';
      out.push({
        ...b,
        id: `${b.id}-c${i}`,
        name: `${b.name} · ${chapter}`,
        count: Math.max(140, Math.round(b.count * (0.12 + ((n * 37) % 70) / 100))),
        tone: (b.tone + i + 1) % 8,
        activity,
        // Spread chapters across founding years so the year filter has range.
        year: 2006 + ((n * 53) % 18),
        avatar: b.avatar ? { ...b.avatar } : null,
      });
    }
  });
  return out;
}

// The full (unfiltered, unpaginated) listing for a category. The mock client
// applies name/activity filters and pagination on top of this.
export function getClubListings(category: string): ClubListing[] {
  if (!isDirectoryCategory(category)) {
    return [];
  }
  return expand(categoryListings(CLUBS_DIRECTORY, category));
}
