import type { HttpClient, RequestOptions } from '@repo/api';
import type { Comment, CreatePostPayload, Paginated, Post, Story } from '@repo/types';
import { FEED_POSTS, ME, STORIES } from './feed-data';

// Offline feed backend (handoff §7). A minimal HttpClient fulfilling the routes
// `createPostApi` calls, backed by mutable in-memory state so like/save survive
// TanStack Query's invalidate→refetch — exactly like the real server would.
// Swap `feedClient` in feed-service.ts for the real httpClient when it exists;
// the api factories, hooks, and screens stay untouched.
const NETWORK_DELAY = 450;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), NETWORK_DELAY));
}

const LIKE_OR_SAVE = /^\/posts\/([^/]+)\/(like|save)$/;
const COMMENTS = /^\/posts\/([^/]+)\/comments$/;

export function createMockFeedClient(): HttpClient {
  // Mutable "server" state — seeded once from the static fixtures.
  const posts: Post[] = FEED_POSTS.map((p) => ({ ...p }));
  const findPost = (id: string): Post | undefined => posts.find((p) => p.id === id);

  function clone(post: Post): Post {
    return { ...post, author: { ...post.author }, book: post.book ? { ...post.book } : null };
  }

  function createPost(payload: CreatePostPayload): Post {
    const nowIso = new Date().toISOString();
    const created: Post = {
      id: `u_${Date.now()}`,
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
    if (COMMENTS.test(path)) {
      return delay<Comment[]>([]) as Promise<T>;
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
      // Boundary cast: the create route always receives a CreatePostPayload.
      return delay(createPost(body as CreatePostPayload)) as Promise<T>;
    }
    mutateFlag(path, true);
    return delay(undefined as T);
  }

  async function del<T>(path: string): Promise<T> {
    mutateFlag(path, false);
    return delay(undefined as T);
  }

  return {
    request: unsupported,
    get,
    post,
    put: unsupported,
    patch: unsupported,
    delete: del,
    addRequestInterceptor: () => undefined,
    addResponseInterceptor: () => undefined,
  };
}
