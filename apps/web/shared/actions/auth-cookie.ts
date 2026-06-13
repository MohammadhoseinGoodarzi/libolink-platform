'use server';

import type { Nullable } from '@repo/types';
import { cookies } from 'next/headers';

const AUTH_COOKIE_NAME = 'libolink_session';

export async function setAuthCookie(token: string): Promise<void> {
  const store = await cookies();
  store.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });
}

export async function clearAuthCookie(): Promise<void> {
  const store = await cookies();
  store.delete(AUTH_COOKIE_NAME);
}

export async function getAuthCookie(): Promise<Nullable<string>> {
  const store = await cookies();
  return store.get(AUTH_COOKIE_NAME)?.value ?? null;
}
