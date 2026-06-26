import type { HttpClient } from '@repo/api';
import type { PremiumOffer } from '@repo/types';
import { PREMIUM_OFFER } from './subscription-data';

// Offline premium backend (handoff §7) — fulfils the one route createPremiumApi
// calls. Swap `subscriptionClient` in subscription-service.ts for the real
// httpClient when it exists; the factory, hook and screen are untouched.
const NETWORK_DELAY = 300;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), NETWORK_DELAY));
}

export function createMockSubscriptionClient(): HttpClient {
  function unsupported(): never {
    throw new Error('mock-subscription-client: route not implemented');
  }

  async function get<T>(path: string): Promise<T> {
    // Boundary cast (`as Promise<T>`): the mock returns the route's concrete type;
    // the generic T is owned by the @repo/api premium query factory.
    if (path === '/premium/offer') {
      const offer: PremiumOffer = PREMIUM_OFFER;
      return delay(offer) as Promise<T>;
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
