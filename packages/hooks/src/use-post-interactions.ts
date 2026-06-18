import type { HttpClient } from '@repo/api';
import type { Post } from '@repo/types';
import { useState } from 'react';
import { usePostActions } from './use-post-actions';

export interface PostInteractions {
  liked: boolean;
  likeCount: number;
  saved: boolean;
  /** Optimistically toggle the like and fire the persisted mutation. */
  toggleLiked: () => void;
  /** Optimistically toggle save; returns the new saved state for UI feedback. */
  toggleSaved: () => boolean;
}

// Shared optimistic like/save behaviour for a post — identical on web and
// mobile (core law: only the rendering differs). Wraps the persisted mutations
// from usePostActions; the calling component owns the UI feedback (toast).
export function usePostInteractions(client: HttpClient, post: Post): PostInteractions {
  const { toggleLike, toggleSave } = usePostActions(client);
  const [liked, setLiked] = useState(post.likedByMe);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [saved, setSaved] = useState(post.savedByMe);

  const toggleLiked = () => {
    setLiked(!liked);
    setLikeCount((count) => count + (liked ? -1 : 1));
    toggleLike.mutate({ postId: post.id, liked });
  };

  const toggleSaved = (): boolean => {
    const next = !saved;
    setSaved(next);
    toggleSave.mutate({ postId: post.id, saved });
    return next;
  };

  return { liked, likeCount, saved, toggleLiked, toggleSaved };
}
