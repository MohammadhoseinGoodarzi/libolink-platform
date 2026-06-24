import type { SearchClub, SearchPerson, SearchTag } from '@repo/types';
import type { SearchScope } from '../types';

// Offline search corpus (handoff §6.2). People + trending tags the header search
// filters over; also seeds the empty-query "Trending / Suggested" state.
export const SEARCH_PEOPLE: SearchPerson[] = [
  {
    kind: 'person',
    id: 'sofiareads',
    name: 'Sofia Reyes',
    username: 'sofiareads',
    initials: 'SR',
    hue: 30,
    mutual: '12 mutual friends',
  },
  {
    kind: 'person',
    id: 'theop',
    name: 'Theo Park',
    username: 'theop',
    initials: 'TP',
    hue: 210,
    mutual: '5 mutual friends',
  },
  {
    kind: 'person',
    id: 'nadia.h',
    name: 'Nadia Hassan',
    username: 'nadia.h',
    initials: 'NH',
    hue: 320,
    mutual: '8 mutual friends',
  },
  {
    kind: 'person',
    id: 'amarac',
    name: 'Amara Collins',
    username: 'amarac',
    initials: 'AC',
    hue: 18,
    mutual: '3 mutual friends',
  },
  {
    kind: 'person',
    id: 'danielokafor',
    name: 'Daniel Okafor',
    username: 'danielokafor',
    initials: 'DO',
    hue: 158,
    mutual: '21 mutual friends',
  },
  {
    kind: 'person',
    id: 'priyanair',
    name: 'Priya Nair',
    username: 'priyanair',
    initials: 'PN',
    hue: 295,
    mutual: '2 mutual friends',
  },
  {
    kind: 'person',
    id: 'marcob',
    name: 'Marco Bianchi',
    username: 'marcob',
    initials: 'MB',
    hue: 235,
    mutual: '7 mutual friends',
  },
  {
    kind: 'person',
    id: 'leila.w',
    name: 'Leila Ward',
    username: 'leila.w',
    initials: 'LW',
    hue: 95,
    mutual: '1 mutual friend',
  },
];

export const SEARCH_TAGS: SearchTag[] = [
  { kind: 'tag', tag: '#FantasyFebruary', posts: '2.4k posts' },
  { kind: 'tag', tag: '#BookTokClassics', posts: '1.8k posts' },
  { kind: 'tag', tag: '#PoetryCorner', posts: '940 posts' },
  { kind: 'tag', tag: '#SciFiSundays', posts: '612 posts' },
  { kind: 'tag', tag: '#PrairieWinds', posts: '410 posts' },
  { kind: 'tag', tag: '#Piranesi', posts: '288 posts' },
];

export const SEARCH_CLUBS: SearchClub[] = [
  {
    kind: 'club',
    id: 'literary-scifi',
    name: 'Literary Sci-Fi Club',
    category: 'Reading Group',
    members: '1.2k members',
    initials: 'SF',
    hue: 250,
  },
  {
    kind: 'club',
    id: 'classics-circle',
    name: 'Classics Circle',
    category: 'Reading Group',
    members: '860 members',
    initials: 'CC',
    hue: 18,
  },
  {
    kind: 'club',
    id: 'poetry-society',
    name: 'Modern Poetry Society',
    category: 'Reading Group',
    members: '540 members',
    initials: 'PS',
    hue: 320,
  },
  {
    kind: 'club',
    id: 'penguin-classics',
    name: 'Penguin Classics',
    category: 'Publisher',
    members: '24k followers',
    initials: 'PC',
    hue: 158,
  },
  {
    kind: 'club',
    id: 'fantasy-guild',
    name: 'The Fantasy Guild',
    category: 'Author Community',
    members: '3.1k members',
    initials: 'FG',
    hue: 95,
  },
];

export const SEARCH_SCOPES: SearchScope[] = ['all', 'people', 'tags', 'clubs'];
