import {
  conversationsQueryOptions,
  createMessageApi,
  type HttpClient,
  messageKeys,
} from '@repo/api';
import type { Conversation, Paginated } from '@repo/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';

/** Telegram-style cap on how many conversations can be pinned at once. */
export const MAX_PINNED_CONVERSATIONS = 10;

export type PinResult = 'pinned' | 'unpinned' | 'limit';

export interface ConversationListController {
  /** Active conversations (not archived). */
  conversations: Conversation[];
  /** Conversations moved to the Archived folder. */
  archived: Conversation[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  /** Clear the unread badge. */
  markRead: (id: string) => void;
  /** Mark unread again (at least one). */
  markUnread: (id: string) => void;
  /** Toggle mute; returns the new muted state for UI feedback. */
  toggleMute: (id: string) => boolean;
  /** Toggle pin (capped at MAX_PINNED_CONVERSATIONS); returns the outcome so the
      UI can confirm or warn that the limit was hit. */
  togglePin: (id: string) => PinResult;
  /** Block/unblock the other party; returns the new blocked state. */
  toggleBlock: (id: string) => boolean;
  /** Move to the Archived folder. */
  archive: (id: string) => void;
  /** Restore from the Archived folder. */
  unarchive: (id: string) => void;
  /** Delete — drops the row entirely. */
  remove: (id: string) => void;
}

// Shared conversation-list controller (handoff §6.3). Optimistic swipe actions
// are written straight into the React Query cache (not local state) so every
// screen observing the conversations query — the list and the Archived folder —
// stays in sync; each mutation is then persisted best-effort through the api.
export function useConversationList(client: HttpClient): ConversationListController {
  const api = createMessageApi(client);
  const queryClient = useQueryClient();
  const query = useQuery(conversationsQueryOptions(client));
  const items = query.data?.items ?? [];

  const patchItems = (fn: (items: Conversation[]) => Conversation[]) => {
    queryClient.setQueryData<Paginated<Conversation>>(messageKeys.conversations(), (old) =>
      old ? { ...old, items: fn(old.items) } : old,
    );
  };
  const patchOne = (id: string, fn: (c: Conversation) => Conversation) => {
    patchItems((list) => list.map((c) => (c.id === id ? fn(c) : c)));
  };

  const markRead = (id: string) => {
    patchOne(id, (c) => ({ ...c, unreadCount: 0 }));
    api.setRead(id, true).catch(() => undefined);
  };

  const markUnread = (id: string) => {
    patchOne(id, (c) => ({ ...c, unreadCount: c.unreadCount || 1 }));
    api.setRead(id, false).catch(() => undefined);
  };

  const toggleMute = (id: string): boolean => {
    const next = !(items.find((c) => c.id === id)?.muted ?? false);
    patchOne(id, (c) => ({ ...c, muted: next }));
    api.setMuted(id, next).catch(() => undefined);
    return next;
  };

  const togglePin = (id: string): PinResult => {
    const isPinned = items.find((c) => c.id === id)?.pinned ?? false;
    // Pinning a new one is capped; unpinning is always allowed. Count pins in the
    // active list only (archived chats aren't shown in the pinned section).
    if (!isPinned) {
      const pinnedCount = items.filter((c) => c.pinned && !c.archived).length;
      if (pinnedCount >= MAX_PINNED_CONVERSATIONS) {
        return 'limit';
      }
    }
    patchOne(id, (c) => ({ ...c, pinned: !isPinned }));
    api.setPinned(id, !isPinned).catch(() => undefined);
    return isPinned ? 'unpinned' : 'pinned';
  };

  const toggleBlock = (id: string): boolean => {
    const next = !(items.find((c) => c.id === id)?.blocked ?? false);
    patchOne(id, (c) => ({ ...c, blocked: next }));
    api.setBlocked(id, next).catch(() => undefined);
    return next;
  };

  const archive = (id: string) => {
    patchOne(id, (c) => ({ ...c, archived: true }));
    api.archive(id).catch(() => undefined);
  };

  const unarchive = (id: string) => {
    patchOne(id, (c) => ({ ...c, archived: false }));
    api.unarchive(id).catch(() => undefined);
  };

  const remove = (id: string) => {
    patchItems((list) => list.filter((c) => c.id !== id));
    api.remove(id).catch(() => undefined);
  };

  return {
    conversations: items.filter((c) => !c.archived),
    archived: items.filter((c) => c.archived),
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: () => void query.refetch(),
    markRead,
    markUnread,
    toggleMute,
    togglePin,
    toggleBlock,
    archive,
    unarchive,
    remove,
  };
}
