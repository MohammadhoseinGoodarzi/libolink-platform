// View-only types for the Saved screen (handoff Saved). The domain shapes
// (SavedBook, SavedPost, SavedCollection) live in @repo/types and are consumed
// directly — these cover presentation concerns the API contract doesn't own.
import type { SavedBook, SavedPost } from '@repo/types';

// Segmented category filter across the collection.
export type SavedTabKey = 'all' | 'books' | 'posts';

// Sort applied to each category client-side.
export type SavedSortKey = 'recent' | 'oldest' | 'visited';

// The item a per-card ⋯ action sheet is open for.
export type SavedMenuTarget = { kind: 'book'; item: SavedBook } | { kind: 'post'; item: SavedPost };

export type SavedSegmentedProps = {
  value: SavedTabKey;
  onChange: (tab: SavedTabKey) => void;
};

export type SavedBookCardProps = {
  book: SavedBook;
  onOpen: () => void;
  onMenu: () => void;
};

export type SavedPostCardProps = {
  post: SavedPost;
  onOpen: () => void;
  onMenu: () => void;
};
