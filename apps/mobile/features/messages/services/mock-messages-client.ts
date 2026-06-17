import type { HttpClient } from '@repo/api';
import type { Conversation, Paginated } from '@repo/types';
import { CONVERSATIONS } from './messages-data';

// Offline messages backend (handoff §7) — a minimal HttpClient fulfilling the
// routes createMessageApi calls. Swap `messagesClient` in messages-service.ts
// for the real httpClient when it exists; the api factories, hooks, and screens
// stay untouched.
const NETWORK_DELAY = 450;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), NETWORK_DELAY));
}

export function createMockMessagesClient(): HttpClient {
  function unsupported(): never {
    throw new Error('mock-messages-client: route not implemented');
  }

  async function get<T>(path: string): Promise<T> {
    if (path === '/conversations') {
      const page: Paginated<Conversation> = {
        items: CONVERSATIONS.map((c) => ({ ...c })),
        page: 1,
        pageSize: CONVERSATIONS.length,
        totalItems: CONVERSATIONS.length,
        totalPages: 1,
      };
      return delay(page) as Promise<T>;
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
