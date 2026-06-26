import { createMockSavedClient } from './mock-saved-client';

// Saved runs against an offline mock client until the backend exists (handoff
// §7). To go live, replace this with the real `httpClient` — the @repo/api
// factory, hook, and screen are untouched.
export const savedClient = createMockSavedClient();
