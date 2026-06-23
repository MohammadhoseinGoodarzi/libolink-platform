import type { AppNotification } from '@repo/types';

// Offline notifications fixture (handoff §6.2; mirrors social-data NOTIFS): social
// activity + a friend request + reading updates. `text` is server-style content.
export const NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    type: 'request',
    actor: { name: 'Sofia Reyes', handle: 'sofiareads', initials: 'SR', hue: 30 },
    text: 'wants to be your reading friend',
    time: '2m',
    unread: true,
  },
  {
    id: 'n2',
    type: 'like',
    actor: { name: 'Amara Collins', initials: 'AC', hue: 18 },
    text: 'liked your post about Prairie Winds',
    time: '8m',
    unread: true,
  },
  {
    id: 'n3',
    type: 'mention',
    actor: { name: 'Daniel Okafor', initials: 'DO', hue: 158 },
    text: 'mentioned you in a comment',
    time: '15m',
    unread: true,
  },
  {
    id: 'n4',
    type: 'reading',
    actor: { name: 'Priya Nair', initials: 'PN', hue: 295 },
    text: 'finished Klara and the Sun ⭐ 5/5',
    time: '1h',
    unread: false,
  },
  {
    id: 'n5',
    type: 'follow',
    actor: { name: 'Theo Park', initials: 'TP', hue: 210 },
    text: 'started following you',
    time: '2h',
    unread: false,
  },
  {
    id: 'n6',
    type: 'club',
    actor: { name: 'Literary Sci-Fi Club', initials: 'SF', hue: 250 },
    text: 'meets Thursday — 3 of your friends are going',
    time: '5h',
    unread: false,
  },
  {
    id: 'n7',
    type: 'reading',
    actor: { name: 'Marco Bianchi', initials: 'MB', hue: 235 },
    text: 'started reading Piranesi',
    time: '1d',
    unread: false,
  },
];
