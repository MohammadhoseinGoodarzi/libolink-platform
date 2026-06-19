import { meProfileQueryOptions } from '@repo/api';
import { useQuery } from '@tanstack/react-query';
import { profileClient } from '../services/profile-service';

// Feature binding over the shared @repo/api profile factory, wired to the
// (currently mock) profile HttpClient. Components stay client-agnostic.
export function useProfile() {
  return useQuery(meProfileQueryOptions(profileClient));
}
