// Account settings data (handoff Settings · Account). Identity fields
// (displayName, username, email, bio, verified) live on the session `User`; the
// extra editable profile fields the Account screens own live here. Connected
// accounts are the linked sign-in providers managed on the Connected Accounts
// screen. Mock seeds stay app-side (features/<name>/services).

// Pronoun choices offered on the Edit Personal Info screen. Stored as a key so
// the visible label stays translatable (@repo/i18n), never a hardcoded string.
export type PronounKey = 'unspecified' | 'heHim' | 'sheHer' | 'theyThem';

export interface AccountProfile {
  /** Legal / full name — distinct from the public displayName on `User`. */
  fullName: string;
  /** Free-text "City, Country". */
  location: string;
  /** Personal site, stored without the https:// prefix. */
  website: string;
  pronouns: PronounKey;
  /** ISO date (yyyy-mm-dd); empty string when unset. */
  birthday: string;
}

export type ConnectedProvider = 'google' | 'apple' | 'goodreads' | 'x';

export interface ConnectedAccount {
  id: ConnectedProvider;
  /** Provider display name (e.g. "Google"). */
  name: string;
  /** The linked identity shown when connected (email / handle). */
  detail: string;
  connected: boolean;
}
