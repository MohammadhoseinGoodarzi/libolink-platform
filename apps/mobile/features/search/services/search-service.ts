import { createMockSearchClient } from './mock-search-client';

// Search runs against an offline mock client until the backend exists (handoff
// §7). To go live, replace this with the real `httpClient` — the @repo/api
// factory, useSearch, and the UI are untouched.
export const searchClient = createMockSearchClient();
