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
  /** Row swipe actions (handoff §6.3). */
  setRead(conversationId: string, read: boolean): Promise<void>;
  setMuted(conversationId: string, muted: boolean): Promise<void>;
  archive(conversationId: string): Promise<void>;
  unarchive(conversationId: string): Promise<void>;
  remove(conversationId: string): Promise<void>;
}

export function createMessageApi(client: HttpClient): MessageApi {
  const at = (id: string) => `/conversations/${encodeURIComponent(id)}`;
  return {
    conversations: () => client.get<Paginated<Conversation>>('/conversations'),
    thread: (conversationId) => client.get<ChatMessage[]>(`${at(conversationId)}/thread`),
    candidates: () => client.get<ConversationCandidate[]>('/conversations/candidates'),
    setRead: (conversationId, read) => client.post<void>(`${at(conversationId)}/read`, { read }),
    setMuted: (conversationId, muted) => client.post<void>(`${at(conversationId)}/mute`, { muted }),
    archive: (conversationId) => client.post<void>(`${at(conversationId)}/archive`),
    unarchive: (conversationId) => client.post<void>(`${at(conversationId)}/unarchive`),
    remove: (conversationId) => client.delete<void>(at(conversationId)),
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
