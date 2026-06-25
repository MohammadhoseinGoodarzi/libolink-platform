import {
  conversationCandidatesQueryOptions,
  conversationsQueryOptions,
  threadQueryOptions,
} from '@repo/api';
import type { Conversation, ConversationCandidate } from '@repo/types';
import { useQuery } from '@tanstack/react-query';
import { messagesClient } from '../services/messages-service';
import type { ConversationSeed } from '../types';

// Feature bindings over the shared @repo/api factories, wired to the messages
// (currently mock) HttpClient. Components stay client-agnostic.
export function useConversations() {
  return useQuery(conversationsQueryOptions(messagesClient));
}

// Startable targets for the new-message sheet (readers, clubs, communities).
export function useConversationCandidates() {
  return useQuery(conversationCandidatesQueryOptions(messagesClient));
}

// The inbox fields a Conversation carries on top of its identity — shared by the
// candidate- and seed-synthesized fallbacks. A freshly opened chat has no history.
const FRESH_INBOX = {
  preview: '',
  unreadCount: 0,
  pinned: false,
  muted: false,
  typing: false,
  lastMessageMine: false,
  lastMessageRead: false,
  archived: false,
  blocked: false,
} as const;

// A fresh conversation synthesized from a new-message candidate: no history yet,
// so the chat opens straight into the "say hello" empty state.
function fromCandidate(candidate: ConversationCandidate): Conversation {
  return { ...candidate, lastActivityAt: new Date().toISOString(), ...FRESH_INBOX };
}

// A fresh conversation synthesized from a route-param seed — lets a chat open for
// an entity (e.g. a club) reached by id from another feature, with no inbox entry
// or candidate record. The id is the canonical key; the seed supplies just enough
// identity to render the header + empty state.
function fromSeed(id: string, seed: ConversationSeed): Conversation {
  return {
    id,
    kind: seed.kind,
    title: seed.title,
    handle: '',
    online: false,
    memberCount: seed.memberCount ?? null,
    book: null,
    lastActivityAt: new Date().toISOString(),
    ...FRESH_INBOX,
  };
}

export function useConversation(id: string, seed?: ConversationSeed) {
  const conversations = useConversations();
  const candidates = useConversationCandidates();

  const existing = conversations.data?.items.find((c) => c.id === id) ?? null;
  // A chat opened from the new-message sheet has no inbox entry yet — fall back
  // to the candidate directory and synthesize a fresh conversation so the screen
  // renders instead of showing "not found". Failing that, a route-param seed (an
  // entity opened by id from another feature) synthesizes one too.
  const candidate = candidates.data?.find((c) => c.id === id) ?? null;
  const conversation =
    existing ?? (candidate ? fromCandidate(candidate) : seed ? fromSeed(id, seed) : null);

  const isError = conversations.isError || candidates.isError;
  // Distinguish "still loading" from "loaded but no such id" so consumers don't
  // sit on a permanent spinner for an unknown/invalid conversation. A seed always
  // resolves, so this only matters when no seed was supplied.
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
