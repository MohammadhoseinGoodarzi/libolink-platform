import type { HttpClient } from '@repo/api';
import type { ChatMessage, Conversation, ConversationCandidate, Paginated } from '@repo/types';
import { CONVERSATION_CANDIDATES, CONVERSATIONS } from './messages-data';
import { getThread } from './thread-data';

const THREAD = /^\/conversations\/([^/]+)\/thread$/;
// Swipe-action routes (read/mute/archive POST, delete DELETE) — accepted as
// no-ops; useConversationList owns the optimistic list state.
const ROW_ACTION = /^\/conversations\/[^/]+\/(read|mute|pin|block|archive|unarchive)$/;
const ONE = /^\/conversations\/([^/]+)$/;

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
    // Boundary casts (`as Promise<T>`): this mock returns each route's concrete
    // type; the generic T is owned by the @repo/api query factories.
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
    if (path === '/conversations/candidates') {
      const candidates: ConversationCandidate[] = CONVERSATION_CANDIDATES.map((c) => ({ ...c }));
      return delay(candidates) as Promise<T>;
    }
    const threadMatch = THREAD.exec(path);
    const conversationId = threadMatch?.[1];
    if (conversationId) {
      const thread: ChatMessage[] = getThread(conversationId);
      return delay(thread) as Promise<T>;
    }
    return unsupported();
  }

  async function post<T>(path: string): Promise<T> {
    if (ROW_ACTION.test(path)) {
      return delay(undefined as T);
    }
    return unsupported();
  }

  async function remove<T>(path: string): Promise<T> {
    if (ONE.test(path)) {
      return delay(undefined as T);
    }
    return unsupported();
  }

  return {
    request: unsupported,
    get,
    post,
    put: unsupported,
    patch: unsupported,
    delete: remove,
    addRequestInterceptor: () => undefined,
    addResponseInterceptor: () => undefined,
  };
}
