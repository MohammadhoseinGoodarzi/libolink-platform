import type { Theme } from '@repo/types';
import { atom } from 'jotai';

export const themeAtom = atom<Theme>('system');
