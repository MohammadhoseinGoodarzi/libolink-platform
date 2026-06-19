import type { ReaderProfile } from '@repo/types';
import { queryOptions } from '@tanstack/react-query';
import type { HttpClient } from '../client';

// The rich reader profile (handoff §6.4). Distinct from the lightweight `User`
// fetch in queries/user.ts: this aggregates identity, stats, favourites, the
// reading journey, shelves, writer works and reading life for the profile page.

export const profileKeys = {
  all: ['profile'] as const,
  me: () => [...profileKeys.all, 'me'] as const,
  detail: (handle: string) => [...profileKeys.all, 'detail', handle] as const,
};

export interface ProfileApi {
  me(): Promise<ReaderProfile>;
  byHandle(handle: string): Promise<ReaderProfile>;
}

export function createProfileApi(client: HttpClient): ProfileApi {
  return {
    me: () => client.get<ReaderProfile>('/profile/me'),
    byHandle: (handle) => client.get<ReaderProfile>(`/profiles/${encodeURIComponent(handle)}`),
  };
}

export function meProfileQueryOptions(client: HttpClient) {
  return queryOptions({
    queryKey: profileKeys.me(),
    queryFn: () => createProfileApi(client).me(),
  });
}

export function readerProfileQueryOptions(client: HttpClient, handle: string) {
  return queryOptions({
    queryKey: profileKeys.detail(handle),
    queryFn: () => createProfileApi(client).byHandle(handle),
  });
}
