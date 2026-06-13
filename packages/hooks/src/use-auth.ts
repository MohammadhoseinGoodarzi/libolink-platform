import { authKeys, createAuthApi, type HttpClient } from '@repo/api';
import { sessionAtom, userAtom } from '@repo/stores';
import type { SignInPayload, SignUpPayload } from '@repo/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAtomValue, useSetAtom } from 'jotai';

export function useAuth(client: HttpClient) {
  const queryClient = useQueryClient();
  const setSession = useSetAtom(sessionAtom);
  const user = useAtomValue(userAtom);

  const signIn = useMutation({
    mutationFn: (payload: SignInPayload) => createAuthApi(client).signIn(payload),
    onSuccess: (session) => {
      setSession(session);
      queryClient.setQueryData(authKeys.session(), session);
    },
  });

  const signUp = useMutation({
    mutationFn: (payload: SignUpPayload) => createAuthApi(client).signUp(payload),
    onSuccess: (session) => {
      setSession(session);
      queryClient.setQueryData(authKeys.session(), session);
    },
  });

  const signOut = useMutation({
    mutationFn: () => createAuthApi(client).signOut(),
    onSuccess: () => {
      setSession(null);
      queryClient.removeQueries({ queryKey: authKeys.all });
    },
  });

  return {
    user,
    isAuthenticated: user !== null,
    signIn,
    signUp,
    signOut,
  };
}
