import type { ClubsDirectory } from '@repo/types';
import { queryOptions } from '@tanstack/react-query';
import type { HttpClient } from '../client';

// Clubs & Communities directory (handoff §6.5).
export const clubKeys = {
  all: ['clubs'] as const,
  directory: () => [...clubKeys.all, 'directory'] as const,
};

export interface ClubsApi {
  directory(): Promise<ClubsDirectory>;
}

export function createClubsApi(client: HttpClient): ClubsApi {
  return {
    directory: () => client.get<ClubsDirectory>('/clubs/directory'),
  };
}

export function clubsDirectoryQueryOptions(client: HttpClient) {
  return queryOptions({
    queryKey: clubKeys.directory(),
    queryFn: () => createClubsApi(client).directory(),
  });
}
