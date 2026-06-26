import type { HttpClient } from '@repo/api';
import type { ReaderNetwork } from '@repo/types';
import { READER_NETWORK } from './friends-data';

// Offline Reader Network backend (handoff §7) — a minimal HttpClient fulfilling
// the routes createNetworkApi calls. Swap `friendsClient` in friends-service.ts
// for the real httpClient when it exists; the factory, hook and screen are
// untouched. Connect/respond are owned by the screen's local state; the mock
// just acknowledges.
const NETWORK_DELAY = 400;

const CONNECT = /^\/network\/([^/]+)\/connect$/;
const RESPOND = /^\/network\/([^/]+)\/respond$/;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), NETWORK_DELAY));
}

export function createMockFriendsClient(): HttpClient {
  function unsupported(): never {
    throw new Error('mock-friends-client: route not implemented');
  }

  async function get<T>(path: string): Promise<T> {
    // Boundary cast (`as Promise<T>`): the mock returns the route's concrete type;
    // the generic T is owned by the @repo/api network query factory.
    if (path === '/network') {
      const surface: ReaderNetwork = READER_NETWORK;
      return delay(surface) as Promise<T>;
    }
    return unsupported();
  }

  async function post<T>(path: string, body?: unknown): Promise<T> {
    const connect = CONNECT.exec(path);
    if (connect) {
      return delay({ pending: true }) as Promise<T>;
    }
    const respond = RESPOND.exec(path);
    if (respond?.[1]) {
      // Boundary read of the untyped request body (`as`): the route owns its
      // shape. Narrow to a real boolean so a stray truthy value can't slip through.
      const accept = (body as { accept?: boolean } | undefined)?.accept === true;
      return delay({ id: decodeURIComponent(respond[1]), accepted: accept }) as Promise<T>;
    }
    return unsupported();
  }

  return {
    request: unsupported,
    get,
    post,
    put: unsupported,
    patch: unsupported,
    delete: unsupported,
    addRequestInterceptor: () => undefined,
    addResponseInterceptor: () => undefined,
  };
}
