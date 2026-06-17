import type { Conversation, Paginated } from '@repo/types';
import { queryOptions } from '@tanstack/react-query';
import type { HttpClient } from '../client';

export const messageKeys = {
  all: ['messages'] as const,
  conversations: () => [...messageKeys.all, 'conversations'] as const,
  thread: (conversationId: string) => [...messageKeys.all, conversationId, 'thread'] as const,
};

export interface MessageApi {
  conversations(): Promise<Paginated<Conversation>>;
}

export function createMessageApi(client: HttpClient): MessageApi {
  return {
    conversations: () => client.get<Paginated<Conversation>>('/conversations'),
  };
}

export function conversationsQueryOptions(client: HttpClient) {
  return queryOptions({
    queryKey: messageKeys.conversations(),
    queryFn: () => createMessageApi(client).conversations(),
  });
}
