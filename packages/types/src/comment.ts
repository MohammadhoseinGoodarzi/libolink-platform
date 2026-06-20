import type { User } from './user';

export interface Comment {
  id: string;
  postId: string;
  author: User;
  content: string;
  likeCount: number;
  likedByMe: boolean;
  /** The signed-in reader is the author (server-computed, like likedByMe). */
  mine: boolean;
  createdAt: string;
  /** Nested replies (handoff §6.2 — one level deep in practice). */
  replies: Comment[];
}

export interface CreateCommentPayload {
  postId: string;
  content: string;
  /** Root comment id when replying; omitted for a top-level comment. */
  parentId?: string;
}
