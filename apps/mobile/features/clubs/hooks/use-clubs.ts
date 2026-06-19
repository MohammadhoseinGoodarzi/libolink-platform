import { clubsDirectoryQueryOptions } from '@repo/api';
import { useQuery } from '@tanstack/react-query';
import { clubsClient } from '../services/clubs-service';

// Feature binding over the shared @repo/api clubs factory, wired to the
// (currently mock) clubs HttpClient. Components stay client-agnostic.
export function useClubs() {
  return useQuery(clubsDirectoryQueryOptions(clubsClient));
}
