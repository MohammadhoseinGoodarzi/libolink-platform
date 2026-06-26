import type { Post, Story, User } from '@repo/types';
import type { FeedAd } from '../types';

// Offline feed content (handoff §7 — prototypes mock everything). Shapes match
// the shared @repo/types contract so swapping in the real backend is a one-line
// change in feed-service.ts. Persona content from the prototype ("Mehrab" + co).

const NOW = Date.now();
const HOUR = 60 * 60 * 1000;

function isoHoursAgo(hours: number): string {
  return new Date(NOW - hours * HOUR).toISOString();
}

let userSeq = 0;
function mkUser(
  displayName: string,
  username: string,
  options: { verified?: boolean; bio?: string; isPremium?: boolean } = {},
): User {
  userSeq += 1;
  const now = new Date(NOW).toISOString();
  return {
    id: `u_${userSeq}`,
    email: `${username}@example.com`,
    username,
    displayName,
    avatarUrl: null,
    bio: options.bio ?? null,
    verified: options.verified ?? false,
    isPremium: options.isPremium ?? false,
    createdAt: now,
    updatedAt: now,
  };
}

const amara = mkUser('Amara Collins', 'amara', { verified: true });
const daniel = mkUser('Daniel Okafor', 'danreads');
const marco = mkUser('Marco Bianchi', 'marco.b');
const priya = mkUser('Priya Nair', 'priya.reads');
const theo = mkUser('Theo Almeida', 'theoreads');
const noor = mkUser('Noor Haddad', 'noor.h', { verified: true });
const lina = mkUser('Lina Soltani', 'lina.reads');

// The signed-in reader — author of posts created from the composer. Premium so
// the two-mode header shows the PRO badge.
export const ME: User = mkUser('Mehrab Kargardoost', 'mehrab', { isPremium: true });

// Stories row — "You" is prepended in the component (handoff §6.2). Each story
// carries the full-screen segments shown in the viewer.
export const STORIES: Story[] = [
  {
    id: 's1',
    author: amara,
    seen: false,
    segments: [
      {
        id: 's1a',
        title: 'Currently reading',
        caption: 'Prairie Winds — 60 pages in and already wrecked.',
      },
      {
        id: 's1b',
        title: 'Coffee & chapters',
        caption: 'Sunday mornings are for slow reading. ☕',
      },
    ],
  },
  {
    id: 's2',
    author: daniel,
    seen: false,
    segments: [
      {
        id: 's2a',
        title: 'Quote of the day',
        caption: '“It does not do to dwell on dreams and forget to live.”',
      },
    ],
  },
  {
    id: 's3',
    author: priya,
    seen: false,
    segments: [
      {
        id: 's3a',
        title: 'Shelf reorg',
        caption: 'Sorted my shelves by the feeling each book left me with.',
      },
    ],
  },
  {
    id: 's4',
    author: marco,
    seen: true,
    segments: [
      { id: 's4a', title: 'Book swap Saturday', caption: 'Riverside library, 10am. Coffee on me.' },
    ],
  },
  {
    id: 's5',
    author: lina,
    seen: true,
    segments: [
      { id: 's5a', title: 'Margins > everything', caption: 'Annotating in pen, fight me.' },
    ],
  },
];

export const FEED_POSTS: Post[] = [
  {
    id: 'm1',
    author: amara,
    content:
      "Just finished The Legacy of Prairie Winds — a German immigrant's saga across " +
      "Nebraska's frontier. Tornadoes, prairie fires, brutal winters, and a boy who refuses " +
      'to break. Could not put it down. ⭐️ 4.5/5',
    imageUrl: null,
    book: { title: 'Prairie Winds', author: 'Glenda K. Clare' },
    likeCount: 128,
    commentCount: 24,
    shareCount: 6,
    likedByMe: false,
    savedByMe: false,
    createdAt: isoHoursAgo(1),
    updatedAt: isoHoursAgo(1),
  },
  {
    id: 'm2',
    author: daniel,
    content:
      '"It does not do to dwell on dreams and forget to live."\n\nThe one line I keep ' +
      'coming back to. What sentence lives rent-free in your head?',
    imageUrl: null,
    book: null,
    likeCount: 342,
    commentCount: 57,
    shareCount: 31,
    likedByMe: true,
    savedByMe: true,
    createdAt: isoHoursAgo(3),
    updatedAt: isoHoursAgo(3),
  },
  {
    id: 'm3',
    author: marco,
    content:
      'Hosting a small book swap this Saturday at the riverside library. Bring one novel you ' +
      "loved, leave with one you haven't met. Coffee on me ☕",
    imageUrl: null,
    book: { title: 'Book Swap', author: 'Riverside Library · Sat 10am' },
    likeCount: 210,
    commentCount: 18,
    shareCount: 47,
    likedByMe: false,
    savedByMe: false,
    createdAt: isoHoursAgo(5),
    updatedAt: isoHoursAgo(5),
  },
  {
    id: 'm4',
    author: priya,
    content:
      'Reorganised my entire shelf by the emotion each book left me with instead of author. ' +
      '"Quietly devastating" is somehow my biggest section.',
    imageUrl: null,
    book: null,
    likeCount: 176,
    commentCount: 29,
    shareCount: 8,
    likedByMe: false,
    savedByMe: false,
    createdAt: isoHoursAgo(7),
    updatedAt: isoHoursAgo(7),
  },
  {
    id: 'm5',
    author: theo,
    content:
      'Started a buddy-read of The Brothers Karamazov. Forty pages in and Dostoevsky is already ' +
      'asking me questions I am not ready to answer. 📖',
    imageUrl: null,
    book: { title: 'The Brothers Karamazov', author: 'Fyodor Dostoevsky' },
    likeCount: 264,
    commentCount: 41,
    shareCount: 15,
    likedByMe: true,
    savedByMe: false,
    createdAt: isoHoursAgo(9),
    updatedAt: isoHoursAgo(9),
  },
  {
    id: 'm6',
    author: noor,
    content:
      'Reminder that a library card is the most powerful thing in your wallet and it is free. ' +
      'Picked up six holds today and regret nothing.',
    imageUrl: null,
    book: null,
    likeCount: 398,
    commentCount: 52,
    shareCount: 73,
    likedByMe: false,
    savedByMe: true,
    createdAt: isoHoursAgo(11),
    updatedAt: isoHoursAgo(11),
  },
  {
    id: 'm7',
    author: lina,
    content:
      'Annotating in pen, fight me. The margins are where I actually fall in love with a book — ' +
      'future-me deserves to find past-me arguing in the gutters.',
    imageUrl: null,
    book: null,
    likeCount: 221,
    commentCount: 36,
    shareCount: 11,
    likedByMe: false,
    savedByMe: false,
    createdAt: isoHoursAgo(13),
    updatedAt: isoHoursAgo(13),
  },
];

// Sponsored cards, cycled after every 6 posts (handoff §6.2). Copy is generic
// placeholder ad inventory; "Remove ads" routes to Subscription.
export const FEED_ADS: FeedAd[] = [
  {
    brand: 'Kobo Plus',
    title: 'Unlimited eBooks & audiobooks',
    body: 'Read as much as you want — start a 30-day free trial today.',
    cta: 'Try free',
    letter: 'K',
  },
  {
    brand: 'Libro.fm',
    title: 'Audiobooks that back local shops',
    body: 'Every credit supports an independent bookstore near you.',
    cta: 'Get 2 free',
    letter: 'L',
  },
  {
    brand: 'Blinkist',
    title: 'Big nonfiction ideas in 15 minutes',
    body: 'Key takeaways from 6,500+ books, to read or listen.',
    cta: 'Start free',
    letter: 'B',
  },
];
