import { createMockSubscriptionClient } from './mock-subscription-client';

// Subscription runs against an offline mock client until the backend exists
// (handoff §7). To go live, replace this with the real `httpClient` — the
// @repo/api factory, hook and screen are untouched.
export const subscriptionClient = createMockSubscriptionClient();
