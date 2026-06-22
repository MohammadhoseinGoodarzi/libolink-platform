import type { Comment, Post } from '@repo/types';

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

// A rendered feed row — a post or an injected sponsored ad.
export type FeedRow = { kind: 'post'; post: Post } | { kind: 'ad'; key: string; ad: FeedAd };

// Phase-2 interaction props (handoff §6.2): compose + story viewer.
export type HomeFeedProps = {
  /** Open the story viewer at the tapped story. */
  onOpenStory?: (id: string) => void;
};

export type ComposerBarProps = {
  onOpen: () => void;
};

export type ComposeSheetProps = {
  open: boolean;
  onClose: () => void;
  /** Resolves true when the post was created (sheet closes only then). */
  onSubmit: (text: string) => Promise<boolean>;
};

export type StoryViewerProps = {
  /** Story to open first; the viewer can page to neighbours from here. */
  startId: string;
  onClose: () => void;
};

export type CommentsSheetProps = {
  post: Post;
  open: boolean;
  onClose: () => void;
};

export type ShareSheetProps = {
  post: Post;
  open: boolean;
  onClose: () => void;
};

export type CommentRowProps = {
  node: Comment;
  depth: number;
  /** Top-level ancestor id — replies attach to the root. */
  rootId: string;
  onLike: (id: string) => void;
  onReply: (node: Comment, rootId: string) => void;
  onMenu: (node: Comment, rootId: string) => void;
};
