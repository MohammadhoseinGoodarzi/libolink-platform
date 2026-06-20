import type { User } from './user';

// A single full-screen panel within a reader's story (handoff §6.2).
export interface StorySegment {
  id: string;
  title: string;
  caption: string;
}

// A reader's story bubble in the feed's stories row (handoff §6.2).
export interface Story {
  id: string;
  author: User;
  /** Already viewed — ring renders muted instead of the brand gradient. */
  seen: boolean;
  /** Full-screen panels shown in the story viewer, in order. */
  segments: StorySegment[];
}
