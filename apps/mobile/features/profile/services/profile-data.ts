import type { ReaderProfile } from '@repo/types';

// Offline persona for the Profile screen (handoff §6.4) — Mehrab Kargardoost
// (@mehrab, MK, hue 158), consistent with the rest of the app. Display-formatted
// counts ("1.2k", "2.1M", "18.2k") are pre-baked the way the server would send
// them. Swap the mock client for the real one and this file goes away.
export const MEHRAB_PROFILE: ReaderProfile = {
  identity: {
    name: 'Mehrab Kargardoost',
    handle: '@mehrab',
    initials: 'MK',
    hue: 158,
    verified: true,
    readerLevel: 'Bibliophile',
    profession: 'Literature Researcher',
    degree: 'M.A. in English Literature',
    university: 'University of Tehran',
    city: 'Tehran',
    country: 'Iran',
    joined: 'March 2021',
    bio: 'Marketer by day, slow reader by night. I collect first sentences, underline far too much, and believe every good book is a conversation waiting to be continued. 📚',
    philosophy: 'Read slowly. Reread often. Lend generously.',
    interests: [
      'Magical realism',
      'Translated fiction',
      'Marginalia',
      'Used bookshops',
      'Letters & diaries',
    ],
    genres: ['Fiction', 'Fantasy', 'Philosophy', 'History', 'Psychology', 'Poetry'],
  },
  stats: [
    { key: 'read', value: '247' },
    { key: 'year', value: '38' },
    { key: 'streak', value: '64' },
    { key: 'pages', value: '18.2k' },
    { key: 'reviews', value: '92' },
    { key: 'clubs', value: '5' },
    { key: 'followers', value: '1.2k' },
    { key: 'following', value: '318' },
  ],
  socialProof: {
    people: [
      { initials: 'AC', hue: 18, name: 'Amara' },
      { initials: 'JP', hue: 214, name: 'James' },
      { initials: 'SR', hue: 32, name: null },
    ],
    names: ['Amara', 'James'],
    othersLabel: '1.2k',
  },
  favorites: {
    book: {
      title: 'Harry Potter',
      series: "and the Philosopher's Stone",
      author: 'J.K. Rowling',
      tone: 5,
      rating: 5,
    },
    author: {
      name: 'Gabriel García Márquez',
      initials: 'GM',
      hue: 28,
      note: 'Colombian novelist · Nobel Laureate',
      books: 14,
      followers: '2.1M',
    },
    quote: {
      text: 'It does not do to dwell on dreams and forget to live.',
      speaker: 'Albus Dumbledore',
      source: "Harry Potter and the Philosopher's Stone",
    },
  },
  currentlyReading: [
    {
      title: 'One Hundred Years of Solitude',
      author: 'Gabriel García Márquez',
      tone: 3,
      page: 248,
      pages: 417,
      pct: 59,
    },
    {
      title: 'Klara and the Sun',
      author: 'Kazuo Ishiguro',
      tone: 2,
      page: 74,
      pages: 303,
      pct: 24,
    },
  ],
  upNext: {
    title: 'The Master and Margarita',
    author: 'Mikhail Bulgakov',
    tone: 1,
    note: 'Starting this weekend',
  },
  recentlyFinished: [
    { title: 'Pachinko', author: 'Min Jin Lee', tone: 0, rating: 5 },
    { title: 'Educated', author: 'Tara Westover', tone: 4, rating: 4 },
    { title: 'The Name of the Wind', author: 'Patrick Rothfuss', tone: 3, rating: 5 },
    { title: 'Norwegian Wood', author: 'Haruki Murakami', tone: 5, rating: 4 },
    { title: 'Crime and Punishment', author: 'Fyodor Dostoevsky', tone: 2, rating: 5 },
    { title: 'Beloved', author: 'Toni Morrison', tone: 1, rating: 4 },
  ],
  shelves: [
    {
      key: 'read',
      count: 247,
      books: [
        { title: 'Pachinko', author: 'Min Jin Lee', tone: 0 },
        { title: 'Crime and Punishment', author: 'Dostoevsky', tone: 2 },
        { title: 'The Blind Owl', author: 'Sadegh Hedayat', tone: 4 },
        { title: 'Beloved', author: 'Toni Morrison', tone: 1 },
        { title: 'Brave New World', author: 'Aldous Huxley', tone: 3 },
        { title: 'The Stranger', author: 'Albert Camus', tone: 5 },
        { title: 'The Kite Runner', author: 'Khaled Hosseini', tone: 2 },
      ],
    },
  ],
  writer: {
    website: 'mehrab.ink',
    works: [
      { kind: 'book', title: 'Margins & Marginalia', meta: 'Essays on rereading · 2024' },
      { kind: 'article', title: 'The Slow-Reading Manifesto', meta: 'The Reader · 14k reads' },
      { kind: 'blog', title: 'Letters to a Young Underliner', meta: '12 posts · weekly' },
      { kind: 'publication', title: 'On Translating Silence', meta: 'Journal of Letters · 2023' },
    ],
  },
  readingLife: {
    goal: { done: 38, target: 50 },
    month: { done: 4, target: 5, label: 'June' },
    favoriteTime: 'Late night',
    formats: [
      { key: 'physical', active: true },
      { key: 'ebook', active: true },
      { key: 'audiobook', active: false },
    ],
    languages: ['Persian', 'English', 'Spanish'],
  },
};
