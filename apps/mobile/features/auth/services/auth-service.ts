import { createMockAuthClient } from './mock-auth-client';

// Auth runs against an offline mock client until the backend exists (handoff §7).
// To go live, replace this with the real `httpClient` from
// '@/shared/services/http-client' — useAuth/forms/screens are untouched.
export const authClient = createMockAuthClient();
