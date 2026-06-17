import { atom } from 'jotai';

// App-global UI state for the shared shell. Mobile-only (no @repo/stores home):
// the header opens the drawer, the centre tab opens Lio.
export const drawerOpenAtom = atom(false);
export const lioOpenAtom = atom(false);
