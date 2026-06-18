import { conversationsQueryOptions, threadQueryOptions } from '@repo/api';
import { useQuery } from '@tanstack/react-query';
import { messagesClient } from '../services/messages-service';

// Feature bindings over the shared @repo/api factories, wired to the messages
// (currently mock) HttpClient. Components stay client-agnostic.
export function useConversations() {
  return useQuery(conversationsQueryOptions(messagesClient));
}

export function useConversation(id: string) {
  const conversations = useConversations();
  const conversation = conversations.data?.items.find((c) => c.id === id) ?? null;
  return { conversation, isLoading: conversations.isLoading };
}

export function useThread(conversationId: string) {
  return useQuery(threadQueryOptions(messagesClient, conversationId));
}
