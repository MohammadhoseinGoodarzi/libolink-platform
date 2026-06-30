import type { ConnectedAccount } from '@repo/types';

// Mock linked sign-in providers for the Settings · Connected Accounts screen
// (handoff). Feature-local seed; swapped for a real GET /account/connections once
// the backend exists. The screen toggles connect/disconnect on a local copy.
export const CONNECTED_ACCOUNTS: ConnectedAccount[] = [
  { id: 'google', name: 'Google', detail: 'you@example.com', connected: true },
  { id: 'apple', name: 'Apple', detail: '', connected: false },
  { id: 'goodreads', name: 'Goodreads', detail: '@yourhandle', connected: true },
  { id: 'x', name: 'X (Twitter)', detail: '', connected: false },
];
