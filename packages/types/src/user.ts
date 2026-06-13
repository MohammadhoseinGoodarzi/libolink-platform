import type { Nullable } from './common';

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl: Nullable<string>;
  bio: Nullable<string>;
  createdAt: string;
  updatedAt: string;
}
