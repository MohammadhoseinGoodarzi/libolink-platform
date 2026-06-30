// Mock username availability for the Settings · Change Username screen (handoff).
// Mirrors auth's signup check but adds the "current username" state. Mock data
// (the taken set) stays feature-local; replaced by a real
// GET /users/username-available?u=… once the backend exists.
const TAKEN = new Set(['admin', 'books', 'libolink', 'support', 'mehrab.k']);
const USERNAME_RE = /^[a-z0-9_.]+$/;

export type UsernameStatusKey = 'current' | 'tooShort' | 'invalid' | 'taken' | 'available';

export function usernameStatus(clean: string, current: string): UsernameStatusKey {
  if (clean === current) {
    return 'current';
  }
  if (clean.length < 3) {
    return 'tooShort';
  }
  if (!USERNAME_RE.test(clean)) {
    return 'invalid';
  }
  return TAKEN.has(clean) ? 'taken' : 'available';
}
