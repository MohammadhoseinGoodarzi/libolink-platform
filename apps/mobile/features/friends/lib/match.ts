import type { MessageKey } from '@repo/i18n';
import type { ReaderMatchKind } from '@repo/types';

// A match's accent: the palette colour that carries its ring + chip (handoff
// Friends MATCH map). reading/genre → brand green, literary → navy, author →
// crimson.
export type MatchTone = 'green' | 'navy' | 'crimson';

export function matchTone(kind: ReaderMatchKind): MatchTone {
  if (kind === 'literary') {
    return 'navy';
  }
  if (kind === 'author') {
    return 'crimson';
  }
  return 'green';
}

// Theme colour for a match tone — green=primary, navy=link, crimson=destructive.
export function matchColor(
  kind: ReaderMatchKind,
  colors: { primary: string; link: string; destructive: string },
): string {
  const tone = matchTone(kind);
  return tone === 'navy' ? colors.link : tone === 'crimson' ? colors.destructive : colors.primary;
}

export function matchLabelKey(kind: ReaderMatchKind): MessageKey<'Friends'> {
  if (kind === 'literary') {
    return 'matchLiterary';
  }
  if (kind === 'author') {
    return 'matchAuthor';
  }
  if (kind === 'genre') {
    return 'matchGenre';
  }
  return 'matchReading';
}
