// Password strength scoring shared by the auth New-Password screen and the
// Settings · Change-Password screen (handoff). Pure function — the meter UI lives
// in each app/feature (UI is the one accepted duplication).

/** 0–4 score: 8+ chars, mixed case, a number, a symbol. */
export function passwordStrength(password: string): number {
  let score = 0;
  if (password.length >= 8) {
    score += 1;
  }
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) {
    score += 1;
  }
  if (/[0-9]/.test(password)) {
    score += 1;
  }
  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  }
  return Math.min(score, 4);
}
