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
  // Distinguish "still loading" from "loaded but no such id" so consumers don't
  // sit on a permanent spinner for an unknown/invalid conversation.
  const notFound = conversations.isFetched && !conversations.isError && conversation === null;
  return {
    conversation,
    isLoading: conversations.isLoading,
    isError: conversations.isError,
    notFound,
  };
}

export function useThread(conversationId: string) {
  return useQuery(threadQueryOptions(messagesClient, conversationId));
}
