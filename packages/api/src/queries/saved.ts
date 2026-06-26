import type { SavedCollection } from '@repo/types';
import { queryOptions } from '@tanstack/react-query';
import type { HttpClient } from '../client';

// The reader's saved collection (handoff Saved) — books + posts bookmarked across
// Libolink, surfaced into one personal list reached from the drawer.
export const savedKeys = {
  all: ['saved'] as const,
  collection: () => [...savedKeys.all, 'collection'] as const,
};

// The collection is split into books and posts, so a raw id is ambiguous —
// removal is addressed by kind + id.
export type SavedItemKind = 'book' | 'post';

export interface SavedApi {
  collection(): Promise<SavedCollection>;
  /** Remove an item from the collection; resolves to the removed kind + id. */
  remove(kind: SavedItemKind, id: string): Promise<{ kind: SavedItemKind; id: string }>;
}

export function createSavedApi(client: HttpClient): SavedApi {
  return {
    collection: () => client.get<SavedCollection>('/saved'),
    remove: (kind, id) =>
      client.delete<{ kind: SavedItemKind; id: string }>(
        `/saved/${kind}/${encodeURIComponent(id)}`,
      ),
  };
}

export function savedCollectionQueryOptions(client: HttpClient) {
  return queryOptions({
    queryKey: savedKeys.collection(),
    queryFn: () => createSavedApi(client).collection(),
  });
}
