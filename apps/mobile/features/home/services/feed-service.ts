import { createMockFeedClient } from './mock-feed-client';

// The feed runs against an offline mock client until the backend exists
// (handoff §7). To go live, replace this with the real `httpClient` — the
// @repo/api factories, @repo/hooks, and feed screens are untouched.
export const feedClient = createMockFeedClient();
