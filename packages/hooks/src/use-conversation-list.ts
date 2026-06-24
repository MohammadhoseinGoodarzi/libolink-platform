import { conversationsQueryOptions, createMessageApi, type HttpClient } from '@repo/api';
import type { Conversation } from '@repo/types';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export interface ConversationListController {
  conversations: Conversation[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  /** Clear the unread badge. */
  markRead: (id: string) => void;
  /** Mark unread again (at least one). */
  markUnread: (id: string) => void;
  /** Toggle mute; returns the new muted state for UI feedback. */
  toggleMute: (id: string) => boolean;
  /** Archive — drops the row from the list. */
  archive: (id: string) => void;
  /** Delete — drops the row from the list. */
  remove: (id: string) => void;
}

// Shared conversation-list controller (handoff §6.3). Seeds from the @repo/api
// conversations query, then owns the list locally so swipe actions are optimistic;
// each mutation is persisted best-effort through the api (mirrors useNotifications).
export function useConversationList(client: HttpClient): ConversationListController {
  const api = createMessageApi(client);
  const query = useQuery(conversationsQueryOptions(client));
  const [list, setList] = useState<Conversation[]>([]);

  useEffect(() => {
    if (query.data) {
      setList(query.data.items);
    }
  }, [query.data]);

  const patch = (id: string, fn: (c: Conversation) => Conversation) => {
    setList((items) => items.map((c) => (c.id === id ? fn(c) : c)));
  };

  const markRead = (id: string) => {
    patch(id, (c) => ({ ...c, unreadCount: 0 }));
    api.setRead(id, true).catch(() => undefined);
  };

  const markUnread = (id: string) => {
    patch(id, (c) => ({ ...c, unreadCount: c.unreadCount || 1 }));
    api.setRead(id, false).catch(() => undefined);
  };

  const toggleMute = (id: string): boolean => {
    // Read the current state from the latest snapshot (rapid mute toggles are
    // not a realistic race); the api call mirrors usePostInteractions.
    const next = !(list.find((c) => c.id === id)?.muted ?? false);
    patch(id, (c) => ({ ...c, muted: next }));
    api.setMuted(id, next).catch(() => undefined);
    return next;
  };

  const archive = (id: string) => {
    setList((items) => items.filter((c) => c.id !== id));
    api.archive(id).catch(() => undefined);
  };

  const remove = (id: string) => {
    setList((items) => items.filter((c) => c.id !== id));
    api.remove(id).catch(() => undefined);
  };

  return {
    conversations: list,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: () => void query.refetch(),
    markRead,
    markUnread,
    toggleMute,
    archive,
    remove,
  };
}
