import type { HttpClient } from '@repo/api';
import type { AuthSession, SignInPayload, SignUpPayload } from '@repo/types';

// Offline auth for development (handoff §7 — prototypes mock everything). This
// is a minimal HttpClient that fulfils /auth/* with a fabricated session. Swap
// `authClient` in auth-service.ts back to the real httpClient when the backend
// exists — the hooks, forms, and screens stay untouched.
const NETWORK_DELAY = 700;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), NETWORK_DELAY));
}

function titleCase(value: string): string {
  return value
    .split(/[._\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function mockSession(email: string, username?: string): AuthSession {
  const handle = username ?? email.split('@')[0] ?? 'reader';
  const now = new Date().toISOString();
  return {
    user: {
      id: `u_${Date.now()}`,
      email,
      username: handle,
      displayName: titleCase(handle) || 'Reader',
      avatarUrl: null,
      bio: null,
      verified: false,
      // Mock sign-ins land in premium mode so the two-mode header is visible.
      isPremium: true,
      createdAt: now,
      updatedAt: now,
    },
    tokens: {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      expiresAt: Date.now() + 60 * 60 * 1000,
    },
  };
}

function unsupported(): never {
  throw new Error('mock-auth-client: only POST /auth/* is implemented');
}

export function createMockAuthClient(): HttpClient {
  async function post<T>(path: string, body?: unknown): Promise<T> {
    if (path === '/auth/sign-in') {
      return delay(mockSession((body as SignInPayload).email)) as Promise<T>;
    }
    if (path === '/auth/sign-up') {
      const payload = body as SignUpPayload;
      return delay(mockSession(payload.email, payload.username)) as Promise<T>;
    }
    if (path === '/auth/sign-out') {
      return delay(undefined as T);
    }
    return unsupported();
  }

  return {
    request: unsupported,
    get: unsupported,
    post,
    put: unsupported,
    patch: unsupported,
    delete: unsupported,
    addRequestInterceptor: () => undefined,
    addResponseInterceptor: () => undefined,
  };
}
