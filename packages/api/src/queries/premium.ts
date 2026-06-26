import type { PremiumOffer } from '@repo/types';
import { queryOptions } from '@tanstack/react-query';
import type { HttpClient } from '../client';

// Premium membership offer (handoff Subscription) — plans, benefits and the
// Free-vs-Premium comparison shown on the subscription landing page.
export const premiumKeys = {
  all: ['premium'] as const,
  offer: () => [...premiumKeys.all, 'offer'] as const,
};

export interface PremiumApi {
  offer(): Promise<PremiumOffer>;
}

export function createPremiumApi(client: HttpClient): PremiumApi {
  return {
    offer: () => client.get<PremiumOffer>('/premium/offer'),
  };
}

export function premiumOfferQueryOptions(client: HttpClient) {
  return queryOptions({
    queryKey: premiumKeys.offer(),
    queryFn: () => createPremiumApi(client).offer(),
  });
}
