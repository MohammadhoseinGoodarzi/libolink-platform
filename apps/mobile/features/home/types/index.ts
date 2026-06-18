// View-only types for the Social Home feed (handoff §6.2). The feed's domain
// shapes (Post, Story, Comment, User) live in @repo/types and are consumed
// directly — these cover presentation concerns the API contract doesn't own.

// Brand-only gradient pair for a post's book/media banner (no new hex, §3.1).
export type FeedCover = 'greenNavy' | 'navyCrimson' | 'greenCrimson';

// A feed-native sponsored card, injected after every 6 posts (handoff §6.2 / §5).
export interface FeedAd {
  brand: string;
  title: string;
  body: string;
  cta: string;
  /** Monogram letter shown in the ad's square mark. */
  letter: string;
}
