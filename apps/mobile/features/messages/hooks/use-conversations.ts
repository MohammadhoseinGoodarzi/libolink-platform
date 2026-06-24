import {
  conversationCandidatesQueryOptions,
  conversationsQueryOptions,
  threadQueryOptions,
} from '@repo/api';
import type { Conversation, ConversationCandidate } from '@repo/types';
import { useQuery } from '@tanstack/react-query';
import { messagesClient } from '../services/messages-service';

// Feature bindings over the shared @repo/api factories, wired to the messages
// (currently mock) HttpClient. Components stay client-agnostic.
export function useConversations() {
  return useQuery(conversationsQueryOptions(messagesClient));
}

// Startable targets for the new-message sheet (readers, clubs, communities).
export function useConversationCandidates() {
  return useQuery(conversationCandidatesQueryOptions(messagesClient));
}

// A fresh conversation synthesized from a new-message candidate: no history yet,
// so the chat opens straight into the "say hello" empty state.
function fromCandidate(candidate: ConversationCandidate): Conversation {
  return {
    ...candidate,
    preview: '',
    lastActivityAt: new Date().toISOString(),
    unreadCount: 0,
    pinned: false,
    muted: false,
    typing: false,
    lastMessageMine: false,
    lastMessageRead: false,
    archived: false,
    blocked: false,
  };
}

export function useConversation(id: string) {
  const conversations = useConversations();
  const candidates = useConversationCandidates();

  const existing = conversations.data?.items.find((c) => c.id === id) ?? null;
  // A chat opened from the new-message sheet has no inbox entry yet — fall back
  // to the candidate directory and synthesize a fresh conversation so the screen
  // renders instead of showing "not found".
  const candidate = candidates.data?.find((c) => c.id === id) ?? null;
  const conversation = existing ?? (candidate ? fromCandidate(candidate) : null);

  const isError = conversations.isError || candidates.isError;
  // Distinguish "still loading" from "loaded but no such id" so consumers don't
  // sit on a permanent spinner for an unknown/invalid conversation.
  const notFound =
    conversations.isFetched && candidates.isFetched && !isError && conversation === null;

  return {
    conversation,
    isLoading: conversations.isLoading || candidates.isLoading,
    isError,
    notFound,
  };
}

export function useThread(conversationId: string) {
  return useQuery(threadQueryOptions(messagesClient, conversationId));
}
