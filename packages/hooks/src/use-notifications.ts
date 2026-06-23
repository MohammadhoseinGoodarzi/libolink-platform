import { createNotificationApi, type HttpClient, notificationsQueryOptions } from '@repo/api';
import type { AppNotification } from '@repo/types';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export interface NotificationsController {
  notifications: AppNotification[];
  unreadCount: number;
  isLoading: boolean;
  isError: boolean;
  markAllRead: () => void;
  /** Accept/decline a friend request. `resolvedText` is the localized line shown
      afterwards — copy stays in the app layer, not this shared hook. */
  respondToRequest: (id: string, accept: boolean, resolvedText: string) => void;
}

// Shared notifications controller (handoff §6.2). Seeds from the @repo/api
// notifications query, then owns the list locally so mark-read / request
// responses are optimistic; each mutation is persisted best-effort through the api.
export function useNotifications(client: HttpClient): NotificationsController {
  const api = createNotificationApi(client);
  const query = useQuery(notificationsQueryOptions(client));
  const [list, setList] = useState<AppNotification[]>([]);

  useEffect(() => {
    if (query.data) {
      setList(query.data);
    }
  }, [query.data]);

  const markAllRead = () => {
    setList((items) => items.map((n) => ({ ...n, unread: false })));
    api.markAllRead().catch(() => undefined);
  };

  const respondToRequest = (id: string, accept: boolean, resolvedText: string) => {
    setList((items) =>
      items.map((n) =>
        n.id === id
          ? { ...n, type: accept ? 'follow' : 'declined', text: resolvedText, unread: false }
          : n,
      ),
    );
    api.respondToRequest(id, accept).catch(() => undefined);
  };

  return {
    notifications: list,
    unreadCount: list.filter((n) => n.unread).length,
    isLoading: query.isLoading,
    isError: query.isError,
    markAllRead,
    respondToRequest,
  };
}
