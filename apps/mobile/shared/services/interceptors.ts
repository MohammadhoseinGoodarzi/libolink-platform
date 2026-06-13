import { accessTokenAtom, sessionAtom } from '@repo/stores';
import type { Nullable } from '@repo/types';
import { jotaiStore } from '@/shared/store';

export function getAccessToken(): Nullable<string> {
  return jotaiStore.get(accessTokenAtom);
}

export function handleUnauthorized(): void {
  jotaiStore.set(sessionAtom, null);
}
