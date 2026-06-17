import type { User } from './user';

// A reader's story bubble in the feed's stories row (handoff §6.2).
export interface Story {
  id: string;
  author: User;
  /** Already viewed — ring renders muted instead of the brand gradient. */
  seen: boolean;
}
