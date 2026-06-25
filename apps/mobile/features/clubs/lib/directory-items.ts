import type { ClubGenre, ClubListing, ClubsDirectory } from '@repo/types';
import type { DirectoryCategory } from '../types';

// Normalise the directory's per-kind shapes into one uniform ClubListing list —
// shared by the in-page search, the "see all" screen, and the mock's paginated
// listing generator, so every surface renders identical rows.

export const DIRECTORY_CATEGORIES: readonly DirectoryCategory[] = [
  'my-clubs',
  'publishers',
  'series',
  'adaptations',
  'authors',
];

export function isDirectoryCategory(value: string): value is DirectoryCategory {
  // Widen to readonly string[] so `.includes` accepts an arbitrary string —
  // ReadonlyArray<DirectoryCategory>.includes would reject a non-category value.
  return (DIRECTORY_CATEGORIES as readonly string[]).includes(value);
}

// ── Genre + year derivation (mock) ───────────────────────────────────────────
// The directory's domain shapes carry no genre/year, so we derive stable values:
// genre from the banner icon where it's telling (wand → fantasy, masks → mystery,
// …), else a hash of the id; year hashed into a 2007–2022 founding window. Real
// data would supply these directly.
const GENRES: readonly ClubGenre[] = [
  'fantasy',
  'mystery',
  'scifi',
  'romance',
  'literary',
  'classics',
  'nonfiction',
];
const GENRE_BY_ICON: Partial<Record<string, ClubGenre>> = {
  wand: 'fantasy',
  sparkles: 'fantasy',
  masks: 'mystery',
  globe: 'literary',
  gradCap: 'nonfiction',
  feather: 'literary',
};

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

// Pass an empty icon to force the hashed genre (e.g. authors, where every icon is
// the same so the icon map would collapse them all to one genre).
function genreFor(id: string, icon: string): ClubGenre {
  return GENRE_BY_ICON[icon] ?? GENRES[hash(id) % GENRES.length] ?? 'literary';
}

function yearFor(id: string): number {
  return 2007 + (hash(`y${id}`) % 16);
}

export function categoryListings(
  directory: ClubsDirectory,
  category: DirectoryCategory,
): ClubListing[] {
  switch (category) {
    case 'my-clubs':
      return directory.myClubs.map((c) => ({
        id: c.id,
        name: c.name,
        kind: 'club',
        count: c.members,
        logo: c.logo,
        tone: c.tone,
        icon: c.icon,
        avatar: null,
        activity: c.activity,
        genre: genreFor(c.id, c.icon),
        year: yearFor(c.id),
      }));
    case 'series':
      return directory.series.map((c) => ({
        id: c.id,
        name: c.name,
        kind: 'series',
        count: c.members,
        logo: c.logo,
        tone: c.tone,
        icon: c.icon,
        avatar: null,
        activity: c.activity,
        genre: genreFor(c.id, c.icon),
        year: yearFor(c.id),
      }));
    case 'publishers':
      return directory.publishers.map((p) => ({
        id: p.id,
        name: p.name,
        kind: 'publisher',
        count: p.followers,
        logo: p.logo,
        tone: p.tone,
        icon: p.icon,
        avatar: null,
        activity: 'high',
        genre: genreFor(p.id, p.icon),
        year: yearFor(p.id),
      }));
    case 'adaptations':
      return directory.adaptations.map((a) => ({
        id: a.id,
        name: a.name,
        kind: 'adaptation',
        count: a.members,
        logo: a.book.slice(0, 2).toUpperCase(),
        tone: a.bookTone,
        icon: 'film',
        avatar: null,
        activity: 'high',
        genre: genreFor(a.id, ''),
        year: yearFor(a.id),
      }));
    case 'authors':
      return directory.authors.map((a) => ({
        id: a.id,
        name: a.name,
        kind: 'author',
        count: a.members,
        logo: a.initials,
        tone: a.hue % 8,
        icon: 'feather',
        avatar: { initials: a.initials, hue: a.hue },
        activity: 'medium',
        genre: genreFor(a.id, ''),
        year: yearFor(a.id),
      }));
  }
}

export function allListings(directory: ClubsDirectory): ClubListing[] {
  return DIRECTORY_CATEGORIES.flatMap((category) => categoryListings(directory, category));
}
