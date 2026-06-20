import type {
  Comment,
  CreateCommentPayload,
  CreatePostPayload,
  Paginated,
  Post,
  Story,
} from '@repo/types';
import { queryOptions } from '@tanstack/react-query';
import type { HttpClient } from '../client';

export const postKeys = {
  all: ['posts'] as const,
  feed: () => [...postKeys.all, 'feed'] as const,
  feedPage: (page: number) => [...postKeys.feed(), page] as const,
  stories: () => [...postKeys.all, 'stories'] as const,
  comments: (postId: string) => [...postKeys.all, postId, 'comments'] as const,
};

export interface PostApi {
  feed(page?: number, pageSize?: number): Promise<Paginated<Post>>;
  stories(): Promise<Story[]>;
  create(payload: CreatePostPayload): Promise<Post>;
  like(postId: string): Promise<void>;
  unlike(postId: string): Promise<void>;
  save(postId: string): Promise<void>;
  unsave(postId: string): Promise<void>;
  comments(postId: string): Promise<Comment[]>;
  addComment(payload: CreateCommentPayload): Promise<Comment>;
  likeComment(postId: string, commentId: string): Promise<void>;
  unlikeComment(postId: string, commentId: string): Promise<void>;
  editComment(postId: string, commentId: string, content: string): Promise<Comment>;
  deleteComment(postId: string, commentId: string): Promise<void>;
}

export function createPostApi(client: HttpClient): PostApi {
  return {
    feed: (page = 1, pageSize = 20) =>
      client.get<Paginated<Post>>('/posts/feed', { query: { page, pageSize } }),
    stories: () => client.get<Story[]>('/posts/stories'),
    create: (payload) => client.post<Post>('/posts', payload),
    like: (postId) => client.post<void>(`/posts/${postId}/like`),
    unlike: (postId) => client.delete<void>(`/posts/${postId}/like`),
    save: (postId) => client.post<void>(`/posts/${postId}/save`),
    unsave: (postId) => client.delete<void>(`/posts/${postId}/save`),
    comments: (postId) => client.get<Comment[]>(`/posts/${encodeURIComponent(postId)}/comments`),
    addComment: (payload) =>
      client.post<Comment>(`/posts/${encodeURIComponent(payload.postId)}/comments`, payload),
    likeComment: (postId, commentId) =>
      client.post<void>(
        `/posts/${encodeURIComponent(postId)}/comments/${encodeURIComponent(commentId)}/like`,
      ),
    unlikeComment: (postId, commentId) =>
      client.delete<void>(
        `/posts/${encodeURIComponent(postId)}/comments/${encodeURIComponent(commentId)}/like`,
      ),
    editComment: (postId, commentId, content) =>
      client.patch<Comment>(
        `/posts/${encodeURIComponent(postId)}/comments/${encodeURIComponent(commentId)}`,
        { content },
      ),
    deleteComment: (postId, commentId) =>
      client.delete<void>(
        `/posts/${encodeURIComponent(postId)}/comments/${encodeURIComponent(commentId)}`,
      ),
  };
}

export function feedQueryOptions(client: HttpClient, page = 1, pageSize = 20) {
  return queryOptions({
    queryKey: postKeys.feedPage(page),
    queryFn: () => createPostApi(client).feed(page, pageSize),
  });
}

export function storiesQueryOptions(client: HttpClient) {
  return queryOptions({
    queryKey: postKeys.stories(),
    queryFn: () => createPostApi(client).stories(),
  });
}

export function commentsQueryOptions(client: HttpClient, postId: string) {
  return queryOptions({
    queryKey: postKeys.comments(postId),
    queryFn: () => createPostApi(client).comments(postId),
  });
}
