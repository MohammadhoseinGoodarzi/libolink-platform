import type { SearchResult } from '@repo/types';
import { queryOptions } from '@tanstack/react-query';
import type { HttpClient } from '../client';

export const searchKeys = {
  all: ['search'] as const,
  query: (q: string) => [...searchKeys.all, q] as const,
};

export interface SearchApi {
  search(query: string): Promise<SearchResult[]>;
}

export function createSearchApi(client: HttpClient): SearchApi {
  return {
    search: (query) => client.get<SearchResult[]>('/search', { query: { q: query } }),
  };
}

export function searchQueryOptions(client: HttpClient, query: string) {
  return queryOptions({
    queryKey: searchKeys.query(query),
    queryFn: () => createSearchApi(client).search(query),
  });
}
