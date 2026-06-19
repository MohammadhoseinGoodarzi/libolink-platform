import type { HttpClient } from '@repo/api';
import type { ReaderProfile } from '@repo/types';
import { MEHRAB_PROFILE } from './profile-data';

const PROFILE_BY_HANDLE = /^\/profiles\/([^/]+)$/;

// Offline profile backend (handoff §7) — a minimal HttpClient fulfilling the
// routes createProfileApi calls. Swap `profileClient` in profile-service.ts for
// the real httpClient when it exists; the api factories, hooks, and screens stay
// untouched.
const NETWORK_DELAY = 450;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), NETWORK_DELAY));
}

export function createMockProfileClient(): HttpClient {
  function unsupported(): never {
    throw new Error('mock-profile-client: route not implemented');
  }

  async function get<T>(path: string): Promise<T> {
    // Boundary cast (`as Promise<T>`): the mock returns the route's concrete
    // type; the generic T is owned by the @repo/api query factories. The single
    // mock persona answers both "me" and any handle lookup.
    if (path === '/profile/me' || PROFILE_BY_HANDLE.test(path)) {
      const profile: ReaderProfile = MEHRAB_PROFILE;
      return delay(profile) as Promise<T>;
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
