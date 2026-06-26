import type { SavedCollection } from '@repo/types';
import { queryOptions } from '@tanstack/react-query';
import type { HttpClient } from '../client';

// The reader's saved collection (handoff Saved) — books + posts bookmarked across
// Libolink, surfaced into one personal list reached from the drawer.
export const savedKeys = {
  all: ['saved'] as const,
  collection: () => [...savedKeys.all, 'collection'] as const,
};

export interface SavedApi {
  collection(): Promise<SavedCollection>;
  /** Remove an item from the collection; resolves to the removed id. */
  remove(id: string): Promise<{ id: string }>;
}

export function createSavedApi(client: HttpClient): SavedApi {
  return {
    collection: () => client.get<SavedCollection>('/saved'),
    remove: (id) => client.delete<{ id: string }>(`/saved/${encodeURIComponent(id)}`),
  };
}

export function savedCollectionQueryOptions(client: HttpClient) {
  return queryOptions({
    queryKey: savedKeys.collection(),
    queryFn: () => createSavedApi(client).collection(),
  });
}
