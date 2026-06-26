import type { Nullable } from './common';

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl: Nullable<string>;
  bio: Nullable<string>;
  /** Verified reader — renders the green badge across the app (handoff §6.2). */
  verified: boolean;
  /** Premium subscriber — drives the two app modes (normal vs premium): premium
      users get the PRO badge in the header; normal users see upgrade CTAs. */
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
}
