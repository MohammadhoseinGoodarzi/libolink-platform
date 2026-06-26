import { premiumOfferQueryOptions } from '@repo/api';
import { useQuery } from '@tanstack/react-query';
import { subscriptionClient } from '../services/subscription-service';

// Feature binding over the shared @repo/api premium factory, wired to the
// (currently mock) subscription HttpClient. The screen stays client-agnostic.
export function usePremiumOffer() {
  return useQuery(premiumOfferQueryOptions(subscriptionClient));
}
