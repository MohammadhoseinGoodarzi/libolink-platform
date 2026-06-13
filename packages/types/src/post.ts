import type { Nullable } from './common';
import type { User } from './user';

export interface Post {
  id: string;
  author: User;
  content: string;
  imageUrl: Nullable<string>;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
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
