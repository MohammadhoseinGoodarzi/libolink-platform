import type { User } from '@repo/types';
import { queryOptions } from '@tanstack/react-query';
import type { HttpClient } from '../client';

export const userKeys = {
  all: ['users'] as const,
  profile: (username: string) => [...userKeys.all, 'profile', username] as const,
};

export interface UserApi {
  profile(username: string): Promise<User>;
}

export function createUserApi(client: HttpClient): UserApi {
  return {
    profile: (username) => client.get<User>(`/users/${username}`),
  };
}

export function profileQueryOptions(client: HttpClient, username: string) {
  return queryOptions({
    queryKey: userKeys.profile(username),
    queryFn: () => createUserApi(client).profile(username),
  });
}
