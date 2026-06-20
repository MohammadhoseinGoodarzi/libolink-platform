import { commentsQueryOptions, createPostApi, type HttpClient } from '@repo/api';
import type { Comment, User } from '@repo/types';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

// Pure tree helpers — the comment-thread business logic both apps share; only
// the rendering differs (core law).
function mapTree(list: Comment[], id: string, fn: (node: Comment) => Comment): Comment[] {
  return list.map((node) => {
    if (node.id === id) {
      return fn(node);
    }
    if (node.replies.length > 0) {
      return { ...node, replies: mapTree(node.replies, id, fn) };
    }
    return node;
  });
}

function removeFromTree(list: Comment[], id: string): Comment[] {
  return list
    .filter((node) => node.id !== id)
    .map((node) =>
      node.replies.length > 0 ? { ...node, replies: removeFromTree(node.replies, id) } : node,
    );
}

function countTree(list: Comment[]): number {
  return list.reduce((sum, node) => sum + 1 + countTree(node.replies), 0);
}

function findInTree(list: Comment[], id: string): Comment | undefined {
  for (const node of list) {
    if (node.id === id) {
      return node;
    }
    const found = findInTree(node.replies, id);
    if (found) {
      return found;
    }
  }
  return undefined;
}

export interface CommentThread {
  thread: Comment[];
  total: number;
  isLoading: boolean;
  isError: boolean;
  /** Toggle the like on a comment (optimistic). */
  toggleLike: (id: string) => void;
  /** Append a top-level comment, or a reply when parentId is given. */
  addComment: (content: string, parentId?: string) => void;
  editComment: (id: string, content: string) => void;
  deleteComment: (id: string) => void;
}

// Shared comment-thread controller (handoff §6.2). Seeds from the @repo/api
// comments query, then owns the tree locally so optimistic edits survive without
// a refetch; each mutation is persisted best-effort through the shared api.
export function useCommentThread(client: HttpClient, postId: string, me: User): CommentThread {
  const api = createPostApi(client);
  const query = useQuery(commentsQueryOptions(client, postId));
  const [thread, setThread] = useState<Comment[]>([]);

  useEffect(() => {
    if (query.data) {
      setThread(query.data);
    }
  }, [query.data]);

  const toggleLike = (id: string) => {
    const node = findInTree(thread, id);
    if (!node) {
      return;
    }
    const nextLiked = !node.likedByMe;
    setThread((list) =>
      mapTree(list, id, (n) => ({
        ...n,
        likedByMe: nextLiked,
        likeCount: n.likeCount + (nextLiked ? 1 : -1),
      })),
    );
    const request = nextLiked ? api.likeComment(postId, id) : api.unlikeComment(postId, id);
    request.catch(() => undefined);
  };

  const addComment = (content: string, parentId?: string) => {
    const fresh: Comment = {
      id: `c_local_${Date.now()}`,
      postId,
      author: me,
      content,
      likeCount: 0,
      likedByMe: false,
      mine: true,
      createdAt: new Date().toISOString(),
      replies: [],
    };
    setThread((list) =>
      parentId
        ? mapTree(list, parentId, (n) => ({ ...n, replies: [...n.replies, fresh] }))
        : [...list, fresh],
    );
    api.addComment({ postId, content, ...(parentId ? { parentId } : {}) }).catch(() => undefined);
  };

  const editComment = (id: string, content: string) => {
    setThread((list) => mapTree(list, id, (n) => ({ ...n, content })));
    api.editComment(postId, id, content).catch(() => undefined);
  };

  const deleteComment = (id: string) => {
    setThread((list) => removeFromTree(list, id));
    api.deleteComment(postId, id).catch(() => undefined);
  };

  return {
    thread,
    total: countTree(thread),
    isLoading: query.isLoading,
    isError: query.isError,
    toggleLike,
    addComment,
    editComment,
    deleteComment,
  };
}
