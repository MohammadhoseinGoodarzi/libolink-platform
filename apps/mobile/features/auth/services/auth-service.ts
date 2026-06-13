import { createAuthApi } from '@repo/api';
import { httpClient } from '@/shared/services/http-client';

// Feature service binds the shared, platform-agnostic auth API to this app's
// configured HTTP client. To develop without a backend, swap `httpClient` for a
// mock client here — the call sites and shared hooks stay untouched.
export const authService = createAuthApi(httpClient);
