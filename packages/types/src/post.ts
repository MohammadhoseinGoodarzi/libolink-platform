import type { Nullable } from './common';
import type { User } from './user';

/** A book a post is about — drives the media banner (handoff §6.2). */
export interface PostBook {
  title: string;
  author: string;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  imageUrl: Nullable<string>;
  /** Book the post is sharing, when present (renders the cover banner). */
  book: Nullable<PostBook>;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  likedByMe: boolean;
  savedByMe: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostPayload {
  content: string;
  imageUrl?: string | undefined;
}

export interface ToggleLikeInput {
  postId: string;
  liked: boolean;
}

export interface ToggleSaveInput {
  postId: string;
  saved: boolean;
}
