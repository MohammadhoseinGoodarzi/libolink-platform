import type { AuthSession, Nullable, User } from '@repo/types';
import { atom } from 'jotai';

export const sessionAtom = atom<Nullable<AuthSession>>(null);

export const userAtom = atom<Nullable<User>>((get) => get(sessionAtom)?.user ?? null);

export const accessTokenAtom = atom<Nullable<string>>(
  (get) => get(sessionAtom)?.tokens.accessToken ?? null,
);

export const isAuthenticatedAtom = atom((get) => get(sessionAtom) !== null);
