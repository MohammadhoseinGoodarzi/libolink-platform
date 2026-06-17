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
  createdAt: string;
  updatedAt: string;
}
