import type { HttpClient } from '@repo/api';
import type { Post } from '@repo/types';
import { useRef, useState } from 'react';
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

  // Tag each toggle with an incrementing id so a stale (out-of-order) failure
  // can't roll back a newer tap's optimistic state.
  const likeOpRef = useRef(0);
  const saveOpRef = useRef(0);

  const toggleLiked = () => {
    const op = ++likeOpRef.current;
    const prevLiked = liked;
    const prevLikeCount = likeCount;
    setLiked(!prevLiked);
    setLikeCount((count) => count + (prevLiked ? -1 : 1));
    toggleLike.mutate(
      { postId: post.id, liked: prevLiked },
      {
        // Roll back only if no newer toggle has superseded this one.
        onError: () => {
          if (likeOpRef.current !== op) {
            return;
          }
          setLiked(prevLiked);
          setLikeCount(prevLikeCount);
        },
      },
    );
  };

  const toggleSaved = (): boolean => {
    const op = ++saveOpRef.current;
    const prevSaved = saved;
    const next = !prevSaved;
    setSaved(next);
    toggleSave.mutate(
      { postId: post.id, saved: prevSaved },
      {
        onError: () => {
          if (saveOpRef.current !== op) {
            return;
          }
          setSaved(prevSaved);
        },
      },
    );
    return next;
  };

  return { liked, likeCount, saved, toggleLiked, toggleSaved };
}
