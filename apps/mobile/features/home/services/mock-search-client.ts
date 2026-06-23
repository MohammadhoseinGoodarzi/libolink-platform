import type { HttpClient, RequestOptions } from '@repo/api';
import type { SearchResult } from '@repo/types';
import { SEARCH_CLUBS, SEARCH_PEOPLE, SEARCH_TAGS } from './search-data';

// Offline search backend (handoff §7): serves GET /search?q=, filtering the local
// corpus server-side. Swap `searchClient` in search-service.ts for the real
// httpClient later — the @repo/api factory, useSearch, and UI are untouched.
const NETWORK_DELAY = 320;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), NETWORK_DELAY));
}

export function createMockSearchClient(): HttpClient {
  function unsupported(): never {
    throw new Error('mock-search-client: route not implemented');
  }

  function runSearch(options: RequestOptions | undefined): SearchResult[] {
    const raw = options?.query?.q;
    const q = (typeof raw === 'string' ? raw : '').trim().toLowerCase();
    if (!q) {
      return [];
    }
    const people = SEARCH_PEOPLE.filter(
      (p) => p.name.toLowerCase().includes(q) || p.username.toLowerCase().includes(q),
    );
    const tags = SEARCH_TAGS.filter((t) => t.tag.toLowerCase().includes(q));
    const clubs = SEARCH_CLUBS.filter((c) => c.name.toLowerCase().includes(q));
    return [...people, ...clubs, ...tags];
  }

  async function get<T>(path: string, options?: RequestOptions): Promise<T> {
    if (path === '/search') {
      // Boundary cast (`as Promise<T>`): T is owned by the @repo/api factories.
      return delay(runSearch(options)) as Promise<T>;
    }
    return unsupported();
  }

  return {
    request: unsupported,
    get,
    post: unsupported,
    put: unsupported,
    patch: unsupported,
    delete: unsupported,
    addRequestInterceptor: () => undefined,
    addResponseInterceptor: () => undefined,
  };
}
