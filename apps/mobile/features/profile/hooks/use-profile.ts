import { createProfileApi, profileKeys } from '@repo/api';
import { useQuery } from '@tanstack/react-query';
import { profileClient } from '../services/profile-service';

// Feature binding over the shared @repo/api profile factory, wired to the
// (currently mock) profile HttpClient. Components stay client-agnostic. Pass a
// reader id/handle to load another reader's profile (visitor mode); omit it for
// the signed-in user ("me"). Built as one query (not a ternary over two
// queryOptions) so the queryKey type stays a single shape for useQuery.
export function useProfile(readerId?: string) {
  const api = createProfileApi(profileClient);
  return useQuery({
    queryKey: readerId ? profileKeys.detail(readerId) : profileKeys.me(),
    queryFn: () => (readerId ? api.byHandle(readerId) : api.me()),
  });
}
