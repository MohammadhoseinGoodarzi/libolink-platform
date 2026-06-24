import type { HttpClient, RequestOptions } from '@repo/api';
import type { Comment, CreatePostPayload, Paginated, Post, Story } from '@repo/types';
import { COMMENTS as MOCK_COMMENTS } from './comments-data';
import { FEED_POSTS, ME, STORIES } from './feed-data';

// Offline feed backend (handoff §7). A minimal HttpClient fulfilling the routes
// `createPostApi` calls, backed by mutable in-memory state so like/save survive
// TanStack Query's invalidate→refetch — exactly like the real server would.
// Comment mutations are accepted as no-ops; useCommentThread owns the live tree.
// Swap `feedClient` in feed-service.ts for the real httpClient when it exists.
const NETWORK_DELAY = 450;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), NETWORK_DELAY));
}

const LIKE_OR_SAVE = /^\/posts\/([^/]+)\/(like|save)$/;
const COMMENTS_PATH = /^\/posts\/([^/]+)\/comments$/;
const COMMENT_LIKE = /^\/posts\/[^/]+\/comments\/[^/]+\/like$/;
const COMMENT_ONE = /^\/posts\/([^/]+)\/comments\/[^/]+$/;

function isCreatePostPayload(value: unknown): value is CreatePostPayload {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  // Narrow the unknown request body to read its fields (justified: type guard).
  const candidate = value as { content?: unknown; imageUrl?: unknown };
  return (
    typeof candidate.content === 'string' &&
    (candidate.imageUrl === undefined || typeof candidate.imageUrl === 'string')
  );
}

function commentContent(body: unknown): string {
  if (typeof body !== 'object' || body === null) {
    return '';
  }
  // Narrow the unknown request body to read its content (justified: type guard).
  const candidate = body as { content?: unknown };
  return typeof candidate.content === 'string' ? candidate.content : '';
}

function cloneComment(comment: Comment, postId: string): Comment {
  return {
    ...comment,
    postId,
    author: { ...comment.author },
    replies: comment.replies.map((reply) => cloneComment(reply, postId)),
  };
}

// Echo a created/edited comment so the api contract returns a Comment; the
// useCommentThread hook drives the UI from its own optimistic state.
function echoComment(postId: string, content: string): Comment {
  return {
    id: `c_srv_${Date.now()}`,
    postId,
    author: { ...ME },
    content,
    likeCount: 0,
    likedByMe: false,
    mine: true,
    createdAt: new Date().toISOString(),
    replies: [],
  };
}

export function createMockFeedClient(): HttpClient {
  // Mutable "server" state — seeded once from the static fixtures.
  const posts: Post[] = FEED_POSTS.map((p) => ({ ...p }));
  let postSeq = 0;
  const findPost = (id: string): Post | undefined => posts.find((p) => p.id === id);

  function clone(post: Post): Post {
    return { ...post, author: { ...post.author }, book: post.book ? { ...post.book } : null };
  }

  function createPost(payload: CreatePostPayload): Post {
    const nowIso = new Date().toISOString();
    postSeq += 1;
    const created: Post = {
      id: `p_mock_${Date.now()}_${postSeq}`,
      author: { ...ME },
      content: payload.content,
      imageUrl: payload.imageUrl ?? null,
      book: null,
      likeCount: 0,
      commentCount: 0,
      shareCount: 0,
      likedByMe: false,
      savedByMe: false,
      createdAt: nowIso,
      updatedAt: nowIso,
    };
    posts.unshift(created);
    return clone(created);
  }

  function feed(options: RequestOptions | undefined): Paginated<Post> {
    const page = Number(options?.query?.page ?? 1);
    const pageSize = Number(options?.query?.pageSize ?? 20);
    const start = (page - 1) * pageSize;
    return {
      items: posts.slice(start, start + pageSize).map(clone),
      page,
      pageSize,
      totalItems: posts.length,
      totalPages: Math.max(1, Math.ceil(posts.length / pageSize)),
    };
  }

  function unsupported(): never {
    throw new Error('mock-feed-client: route not implemented');
  }

  async function get<T>(path: string, options?: RequestOptions): Promise<T> {
    // Boundary casts (`as Promise<T>`): this mock returns each route's concrete
    // type; the generic T is owned by the @repo/api query factories.
    if (path === '/posts/feed') {
      return delay(feed(options)) as Promise<T>;
    }
    if (path === '/posts/stories') {
      const stories: Story[] = STORIES.map((s) => ({ ...s, author: { ...s.author } }));
      return delay(stories) as Promise<T>;
    }
    const comments = COMMENTS_PATH.exec(path);
    if (comments) {
      const postId = comments[1] ?? '';
      return delay(MOCK_COMMENTS.map((c) => cloneComment(c, postId))) as Promise<T>;
    }
    return unsupported();
  }

  function mutateFlag(path: string, on: boolean): void {
    const match = LIKE_OR_SAVE.exec(path);
    if (!match) {
      unsupported();
    }
    const id = match[1];
    if (!id) {
      return;
    }
    const post = findPost(id);
    if (!post) {
      return;
    }
    if (match[2] === 'like') {
      // Idempotent — a repeated like/unlike must not drift the counter.
      if (post.likedByMe === on) {
        return;
      }
      post.likedByMe = on;
      post.likeCount += on ? 1 : -1;
    } else {
      post.savedByMe = on;
    }
  }

  async function post<T>(path: string, body?: unknown): Promise<T> {
    if (path === '/posts') {
      if (!isCreatePostPayload(body)) {
        throw new Error('mock-feed-client: invalid create-post payload');
      }
      // Boundary cast (`as Promise<T>`): T is owned by the @repo/api factories.
      return delay(createPost(body)) as Promise<T>;
    }
    const comments = COMMENTS_PATH.exec(path);
    if (comments) {
      return delay(echoComment(comments[1] ?? '', commentContent(body))) as Promise<T>;
    }
    if (COMMENT_LIKE.test(path)) {
      return delay(undefined as T);
    }
    mutateFlag(path, true);
    return delay(undefined as T);
  }

  async function patch<T>(path: string, body?: unknown): Promise<T> {
    const comment = COMMENT_ONE.exec(path);
    if (comment) {
      return delay(echoComment(comment[1] ?? '', commentContent(body))) as Promise<T>;
    }
    return unsupported();
  }

  async function del<T>(path: string): Promise<T> {
    if (COMMENT_LIKE.test(path) || COMMENT_ONE.test(path)) {
      return delay(undefined as T);
    }
    mutateFlag(path, false);
    return delay(undefined as T);
  }

  return {
    request: unsupported,
    get,
    post,
    put: unsupported,
    patch,
    delete: del,
    addRequestInterceptor: () => undefined,
    addResponseInterceptor: () => undefined,
  };
}
