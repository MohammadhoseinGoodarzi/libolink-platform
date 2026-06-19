import { createMockMessagesClient } from './mock-messages-client';

// Messages runs against an offline mock client until the backend exists
// (handoff §7). To go live, replace this with the real `httpClient` — the
// @repo/api factories, hooks, and screens are untouched.
export const messagesClient = createMockMessagesClient();
