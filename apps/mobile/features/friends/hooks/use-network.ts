import { networkSurfaceQueryOptions } from '@repo/api';
import { useQuery } from '@tanstack/react-query';
import { friendsClient } from '../services/friends-service';

// Feature binding over the shared @repo/api network factory, wired to the
// (currently mock) friends HttpClient. The screen stays client-agnostic.
export function useNetwork() {
  return useQuery(networkSurfaceQueryOptions(friendsClient));
}
