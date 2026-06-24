import type { Comment, User } from '@repo/types';
import { ME } from './feed-data';

// Offline comment thread (handoff §6.2). One level of nested replies; "mine"
// marks the reader's own comments. Times are real ISO offsets so the UI formats
// them with formatShortRelativeTime, like the feed.
const NOW = Date.now();
const MIN = 60 * 1000;
const ago = (minutes: number): string => new Date(NOW - minutes * MIN).toISOString();

let seq = 0;
function commenter(displayName: string, username: string): User {
  seq += 1;
  const iso = new Date(NOW).toISOString();
  return {
    id: `cu_${seq}`,
    email: `${username}@example.com`,
    username,
    displayName,
    avatarUrl: null,
    bio: null,
    verified: false,
    createdAt: iso,
    updatedAt: iso,
  };
}

const daniel = commenter('Daniel Okafor', 'danreads');
const amara = commenter('Amara Collins', 'amara');
const priya = commenter('Priya Nair', 'priya.reads');
const marco = commenter('Marco Bianchi', 'marco.b');
const lina = commenter('Lina Køhler', 'lina');
const sofia = commenter('Sofia Reyes', 'sofiareads');
const theo = commenter('Theo Park', 'theop');
const nadia = commenter('Nadia Hassan', 'nadia.h');

// Mention autocomplete source — and the DM friend grid for the Share sheet
// (handoff: MENTION_USERS === DM_FRIENDS, the same eight people).
export const MENTION_USERS: User[] = [daniel, amara, priya, marco, lina, sofia, theo, nadia];

export const COMMENTS: Comment[] = [
  {
    id: 'c1',
    postId: '',
    author: daniel,
    content: 'This has been on my shelf for months. Does it start slow or pull you in right away?',
    likeCount: 12,
    likedByMe: false,
    mine: false,
    createdAt: ago(42),
    replies: [
      {
        id: 'c1r1',
        postId: '',
        author: amara,
        content: '@amara it pulls you in by chapter two — the prairie-fire scene is unreal.',
        likeCount: 6,
        likedByMe: true,
        mine: false,
        createdAt: ago(30),
        replies: [],
      },
      {
        id: 'c1r2',
        postId: '',
        author: ME,
        content: '@amara agreed, that scene wrecked me 😭',
        likeCount: 2,
        likedByMe: false,
        mine: true,
        createdAt: ago(12),
        replies: [],
      },
    ],
  },
  {
    id: 'c2',
    postId: '',
    author: priya,
    content: 'Adding to my Winter Reads list. Thanks for the rec! 📚',
    likeCount: 28,
    likedByMe: false,
    mine: false,
    createdAt: ago(60),
    replies: [],
  },
  {
    id: 'c3',
    postId: '',
    author: marco,
    content: 'The audiobook narrator is fantastic too if anyone prefers listening.',
    likeCount: 9,
    likedByMe: false,
    mine: false,
    createdAt: ago(120),
    replies: [
      {
        id: 'c3r1',
        postId: '',
        author: lina,
        content: 'Who narrates it?',
        likeCount: 1,
        likedByMe: false,
        mine: false,
        createdAt: ago(60),
        replies: [],
      },
    ],
  },
  {
    id: 'c4',
    postId: '',
    author: ME,
    content: 'Starting this tonight — will report back!',
    likeCount: 4,
    likedByMe: false,
    mine: true,
    createdAt: ago(180),
    replies: [],
  },
];
