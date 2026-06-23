import { type HttpClient, searchQueryOptions } from '@repo/api';
import type { SearchResult } from '@repo/types';
import { useQuery } from '@tanstack/react-query';

export interface SearchController {
  results: SearchResult[];
  isFetching: boolean;
  isError: boolean;
}

// Shared search controller (handoff §6.2). Runs only for a non-empty query; the
// caller is expected to debounce the term it passes in. Rendering differs per app.
export function useSearch(client: HttpClient, query: string): SearchController {
  const trimmed = query.trim();
  const result = useQuery({
    ...searchQueryOptions(client, trimmed),
    enabled: trimmed.length > 0,
  });

  return {
    results: result.data ?? [],
    isFetching: result.isFetching,
    isError: result.isError,
  };
}
