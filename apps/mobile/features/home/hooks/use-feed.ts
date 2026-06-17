import { feedQueryOptions, storiesQueryOptions } from '@repo/api';
import { usePostInteractions } from '@repo/hooks';
import type { Post } from '@repo/types';
import { useQuery } from '@tanstack/react-query';
import { feedClient } from '../services/feed-service';

// Thin feature bindings over the shared @repo/api query factories + @repo/hooks,
// wired to the feed's (currently mock) HttpClient. Components stay client-
// agnostic — only this file knows which client backs the feed.
export function useFeed() {
  return useQuery(feedQueryOptions(feedClient));
}

export function useStories() {
  return useQuery(storiesQueryOptions(feedClient));
}

export function usePostCard(post: Post) {
  return usePostInteractions(feedClient, post);
}
