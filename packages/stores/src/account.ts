import type { AccountProfile } from '@repo/types';
import { atom } from 'jotai';

// Seed for the editable account-profile fields the Settings · Account screens own
// (the identity fields — name/username/email/bio — live on the session `User`).
// Local-only for now, the same posture as `settingsAtom`; persistence /
// backend sync is layered app-side later.
export const DEFAULT_ACCOUNT_PROFILE: AccountProfile = {
  fullName: '',
  location: '',
  website: '',
  pronouns: 'unspecified',
  birthday: '',
};

export const accountProfileAtom = atom<AccountProfile>(DEFAULT_ACCOUNT_PROFILE);
