import type { ChatMessage, Conversation, ConversationCandidate, Paginated } from '@repo/types';
import { queryOptions } from '@tanstack/react-query';
import type { HttpClient } from '../client';

export const messageKeys = {
  all: ['messages'] as const,
  conversations: () => [...messageKeys.all, 'conversations'] as const,
  thread: (conversationId: string) => [...messageKeys.all, conversationId, 'thread'] as const,
  candidates: () => [...messageKeys.all, 'candidates'] as const,
};

export interface MessageApi {
  conversations(): Promise<Paginated<Conversation>>;
  thread(conversationId: string): Promise<ChatMessage[]>;
  /** Startable targets for the new-message sheet (readers, clubs, communities). */
  candidates(): Promise<ConversationCandidate[]>;
}

export function createMessageApi(client: HttpClient): MessageApi {
  return {
    conversations: () => client.get<Paginated<Conversation>>('/conversations'),
    thread: (conversationId) =>
      client.get<ChatMessage[]>(`/conversations/${encodeURIComponent(conversationId)}/thread`),
    candidates: () => client.get<ConversationCandidate[]>('/conversations/candidates'),
  };
}

export function conversationsQueryOptions(client: HttpClient) {
  return queryOptions({
    queryKey: messageKeys.conversations(),
    queryFn: () => createMessageApi(client).conversations(),
  });
}

export function threadQueryOptions(client: HttpClient, conversationId: string) {
  return queryOptions({
    queryKey: messageKeys.thread(conversationId),
    queryFn: () => createMessageApi(client).thread(conversationId),
  });
}

export function conversationCandidatesQueryOptions(client: HttpClient) {
  return queryOptions({
    queryKey: messageKeys.candidates(),
    queryFn: () => createMessageApi(client).candidates(),
  });
}
