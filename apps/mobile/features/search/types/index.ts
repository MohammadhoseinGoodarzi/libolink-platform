// View-only types for the global search feature (handoff §6.2). Domain shapes
// (SearchResult, …) live in @repo/types and are consumed directly.
import type { SearchResult } from '@repo/types';

// Scope filters the live results client-side.
export type SearchScope = 'all' | 'people' | 'tags' | 'clubs';

export type SearchOverlayProps = {
  open: boolean;
  onClose: () => void;
};

export type SearchResultRowProps = {
  result: SearchResult;
  onPress: () => void;
};
