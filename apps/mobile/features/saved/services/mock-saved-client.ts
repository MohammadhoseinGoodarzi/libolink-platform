import type { HttpClient } from '@repo/api';
import type { SavedCollection } from '@repo/types';
import { SAVED_COLLECTION } from './saved-data';

// Offline Saved backend (handoff §7) — a minimal HttpClient fulfilling the routes
// createSavedApi calls. Swap `savedClient` in saved-service.ts for the real
// httpClient when it exists; the api factory, hook, and screen stay the same.
const NETWORK_DELAY = 350;

const SAVED_ITEM = /^\/saved\/([^/]+)\/([^/]+)$/;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), NETWORK_DELAY));
}

export function createMockSavedClient(): HttpClient {
  function unsupported(): never {
    throw new Error('mock-saved-client: route not implemented');
  }

  async function get<T>(path: string): Promise<T> {
    // Boundary cast (`as Promise<T>`): the mock returns the route's concrete type;
    // the generic T is owned by the @repo/api saved query factory.
    if (path === '/saved') {
      // Return a fresh copy each read (a real backend would) so a consumer that
      // sorts/mutates the arrays in place can't leak into the next fetch.
      const collection: SavedCollection = {
        books: SAVED_COLLECTION.books.map((book) => ({ ...book })),
        posts: SAVED_COLLECTION.posts.map((post) => ({ ...post })),
      };
      return delay(collection) as Promise<T>;
    }
    return unsupported();
  }

  // Removal is owned by the screen's local state; the mock just acknowledges with
  // the removed kind + id (the real backend would drop the row). Matches the
  // /saved/{kind}/{id} route createSavedApi.remove() now calls.
  async function del<T>(path: string): Promise<T> {
    const match = SAVED_ITEM.exec(path);
    if (match?.[1] && match[2]) {
      return delay({ kind: match[1], id: decodeURIComponent(match[2]) }) as Promise<T>;
    }
    return unsupported();
  }

  return {
    request: unsupported,
    get,
    post: unsupported,
    put: unsupported,
    patch: unsupported,
    delete: del,
    addRequestInterceptor: () => undefined,
    addResponseInterceptor: () => undefined,
  };
}
