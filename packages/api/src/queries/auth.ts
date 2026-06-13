import type { AuthSession, SignInPayload, SignUpPayload } from '@repo/types';
import { queryOptions } from '@tanstack/react-query';
import type { HttpClient } from '../client';

export const authKeys = {
  all: ['auth'] as const,
  session: () => [...authKeys.all, 'session'] as const,
};

export interface AuthApi {
  signIn(payload: SignInPayload): Promise<AuthSession>;
  signUp(payload: SignUpPayload): Promise<AuthSession>;
  signOut(): Promise<void>;
  me(): Promise<AuthSession>;
}

export function createAuthApi(client: HttpClient): AuthApi {
  return {
    signIn: (payload) => client.post<AuthSession>('/auth/sign-in', payload),
    signUp: (payload) => client.post<AuthSession>('/auth/sign-up', payload),
    signOut: () => client.post<void>('/auth/sign-out'),
    me: () => client.get<AuthSession>('/auth/me'),
  };
}

export function sessionQueryOptions(client: HttpClient) {
  return queryOptions({
    queryKey: authKeys.session(),
    queryFn: () => createAuthApi(client).me(),
  });
}
