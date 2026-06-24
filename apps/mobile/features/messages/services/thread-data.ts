import type { ChatMessage } from '@repo/types';

// Offline chat thread (handoff §6.3 / §7) — the opened Amara conversation,
// seeded to show the message types we render now (text, book, image, voice,
// reply, emoji, reactions, read receipts). Other conversations start empty
// (the "say hello" state). Rich share-types land with the share-in-chat sheet.
const AMARA_THREAD: ChatMessage[] = [
  { id: 'd1', kind: 'day', label: 'Today' },
  {
    id: 'm1',
    kind: 'text',
    from: 'them',
    time: '10:24',
    text: 'Morning! Did you finish Brave New World? 📖',
  },
  {
    id: 'm2',
    kind: 'text',
    from: 'me',
    time: '10:26',
    read: true,
    reactions: [{ emoji: '🔥', mine: false }],
    text: 'Yes! Stayed up way too late — the conditioning chapters had me hooked.',
  },
  {
    id: 'm3',
    kind: 'text',
    from: 'them',
    time: '10:27',
    text: 'Right?? Okay you HAVE to read this next 👇',
  },
  {
    id: 'm4',
    kind: 'book',
    from: 'them',
    time: '10:27',
    book: {
      title: 'Klara and the Sun',
      author: 'Kazuo Ishiguro',
      rating: 4.6,
      note: 'Quiet, devastating, perfect follow-up.',
    },
  },
  {
    id: 'm5',
    kind: 'text',
    from: 'me',
    time: '10:30',
    read: true,
    text: "Adding it now. Here's the one I mentioned —",
  },
  {
    id: 'm6',
    kind: 'book',
    from: 'me',
    time: '10:30',
    read: true,
    book: {
      title: 'One If by Land',
      author: 'Carol R. Allen',
      rating: 4.2,
      note: 'Swap it for BNW on Saturday?',
    },
  },
  {
    id: 'm7',
    kind: 'image',
    from: 'them',
    time: '10:32',
    caption: 'My reading nook is ready for the weekend ☕',
  },
  {
    id: 'm8',
    kind: 'text',
    from: 'me',
    time: '10:33',
    read: true,
    reactions: [{ emoji: '❤️', mine: false }],
    text: 'That looks unreal 😍',
  },
  { id: 'm9', kind: 'voice', from: 'them', time: '10:35', duration: '0:18' },
  {
    id: 'm10',
    kind: 'reply',
    from: 'me',
    time: '10:38',
    read: true,
    replyTo: { name: 'Daniel', text: 'the best sci-fi is really about loneliness.' },
    text: 'Saving this for the club debate on Tuesday 👀',
  },
  {
    id: 'm11',
    kind: 'text',
    from: 'them',
    time: '10:41',
    text: 'You two would get along — he runs Sci-Fi Sundays.',
  },
  { id: 'm12', kind: 'emoji', from: 'them', time: '10:44', text: '📚✨😄' },
  {
    id: 'm13',
    kind: 'text',
    from: 'me',
    time: '10:45',
    read: false,
    text: 'See you Saturday at book club! 📚',
  },
];

export function getThread(conversationId: string): ChatMessage[] {
  return conversationId === 'amara' ? AMARA_THREAD : [];
}

// Canned peer replies for the simulated "they're typing → they reply" flow after
// you send a message (no backend yet). Content data, not i18n chrome.
export const REPLY_SNIPPETS: readonly string[] = [
  'Haha totally 😄',
  'Oh nice — tell me more!',
  'Adding that to my list 📚',
  'Let me check and get back to you 👀',
  'Same here honestly 🙌',
  'Ooh good call ✨',
];
