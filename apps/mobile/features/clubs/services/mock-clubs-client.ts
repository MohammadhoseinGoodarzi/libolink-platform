import type { HttpClient } from '@repo/api';
import type { ClubsDirectory } from '@repo/types';
import { CLUBS_DIRECTORY } from './clubs-data';

// Offline clubs backend (handoff §7) — a minimal HttpClient fulfilling the route
// createClubsApi calls. Swap `clubsClient` in clubs-service.ts for the real
// httpClient when it exists; the api factories, hooks, and screens stay the same.
const NETWORK_DELAY = 450;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), NETWORK_DELAY));
}

export function createMockClubsClient(): HttpClient {
  function unsupported(): never {
    throw new Error('mock-clubs-client: route not implemented');
  }

  async function get<T>(path: string): Promise<T> {
    // Boundary cast (`as Promise<T>`): the mock returns the route's concrete
    // type; the generic T is owned by the @repo/api query factories.
    if (path === '/clubs/directory') {
      const directory: ClubsDirectory = CLUBS_DIRECTORY;
      return delay(directory) as Promise<T>;
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
