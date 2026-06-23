import type { HttpClient } from '@repo/api';
import type { AppNotification } from '@repo/types';
import { NOTIFICATIONS } from './notifications-data';

// Offline notifications backend (handoff §7): a minimal HttpClient serving the
// routes `createNotificationApi` calls. Mark-read and request responses are
// accepted as no-ops — useNotifications owns the live, optimistic list. Swap
// `notificationsClient` in notifications-service.ts for the real httpClient later.
const NETWORK_DELAY = 450;
const REQUEST_RESPONSE = /^\/notifications\/[^/]+\/(accept|decline)$/;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), NETWORK_DELAY));
}

export function createMockNotificationsClient(): HttpClient {
  const items: AppNotification[] = NOTIFICATIONS.map((n) => ({ ...n, actor: { ...n.actor } }));

  function unsupported(): never {
    throw new Error('mock-notifications-client: route not implemented');
  }

  async function get<T>(path: string): Promise<T> {
    if (path === '/notifications') {
      // Boundary cast (`as Promise<T>`): T is owned by the @repo/api factories.
      return delay(items.map((n) => ({ ...n, actor: { ...n.actor } }))) as Promise<T>;
    }
    return unsupported();
  }

  async function post<T>(path: string): Promise<T> {
    if (path === '/notifications/read-all' || REQUEST_RESPONSE.test(path)) {
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
    delete: unsupported,
    addRequestInterceptor: () => undefined,
    addResponseInterceptor: () => undefined,
  };
}
