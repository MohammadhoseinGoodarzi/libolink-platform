import { createMockNotificationsClient } from './mock-notifications-client';

// Notifications run against an offline mock client until the backend exists
// (handoff §7). To go live, replace this with the real `httpClient` — the
// @repo/api factory, useNotifications, and the UI are untouched.
export const notificationsClient = createMockNotificationsClient();
