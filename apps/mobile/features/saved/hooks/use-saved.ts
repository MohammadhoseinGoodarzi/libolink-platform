import { savedCollectionQueryOptions } from '@repo/api';
import { useQuery } from '@tanstack/react-query';
import { savedClient } from '../services/saved-service';

// Feature binding over the shared @repo/api saved factory, wired to the
// (currently mock) saved HttpClient. The screen stays client-agnostic.
export function useSaved() {
  return useQuery(savedCollectionQueryOptions(savedClient));
}
