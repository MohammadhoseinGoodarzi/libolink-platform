// Mock username availability (handoff §6.1 — live availability). Replaced by a
// real GET /users/username-available?u=… once the backend exists.
const TAKEN = new Set(['admin', 'books', 'libolink', 'support', 'reader']);
const USERNAME_RE = /^[a-z0-9_.]+$/;

export type UsernameStatus = 'idle' | 'invalid' | 'taken' | 'available';

export function checkUsername(raw: string): UsernameStatus {
  const username = raw.trim().toLowerCase();
  if (username.length < 3) {
    return 'idle';
  }
  if (!USERNAME_RE.test(username)) {
    return 'invalid';
  }
  return TAKEN.has(username) ? 'taken' : 'available';
}
