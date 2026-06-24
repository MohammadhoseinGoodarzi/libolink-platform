import type { ContactProfile, Conversation } from '@repo/types';

// Mock contact embellishments (handoff §6.3 / §7) — bios keyed by conversation,
// with a sensible default. Mutual clubs / shared books are shared demo content.
// Swap for a real /contacts/{id} fetch when the backend exists.
const BIOS: Record<string, string> = {
  amara: 'Magical-realism devotee. Currently rereading everything by Ishiguro. ☕📚',
  james: 'Sci-fi and long weekend reads. Always up for a book swap.',
  theo: 'Magical realism vs surrealism — ask me which is which. 😄',
  sofia: 'Murakami completist. Slow reader, fast recommender.',
};

const GENERIC_BIO = 'Avid reader, always mid-book and happy to swap recommendations. 📚';

const MUTUAL_CLUBS = [
  { id: 'tuesday', name: 'Tuesday Readers', book: 'Prairie Winds' },
  { id: 'scifi', name: 'Sci-Fi Sundays', book: 'Project Hail Mary' },
];

const SHARED_BOOKS = [
  { title: 'Klara and the Sun', author: 'Kazuo Ishiguro' },
  { title: 'Pachinko', author: 'Min Jin Lee' },
  { title: 'Piranesi', author: 'Susanna Clarke' },
];

export function getContact(c: Conversation): ContactProfile {
  return {
    id: c.id,
    name: c.title,
    handle: c.handle,
    online: c.online,
    bio: BIOS[c.id] ?? GENERIC_BIO,
    mutualClubs: MUTUAL_CLUBS,
    sharedBooks: SHARED_BOOKS,
    sharedPhotos: 6,
  };
}
