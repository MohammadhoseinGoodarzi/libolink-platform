import type { AppNotification } from '@repo/types';
import { queryOptions } from '@tanstack/react-query';
import type { HttpClient } from '../client';

export const notificationKeys = {
  all: ['notifications'] as const,
  list: () => [...notificationKeys.all, 'list'] as const,
};

export interface NotificationApi {
  list(): Promise<AppNotification[]>;
  markAllRead(): Promise<void>;
  respondToRequest(id: string, accept: boolean): Promise<void>;
}

export function createNotificationApi(client: HttpClient): NotificationApi {
  return {
    list: () => client.get<AppNotification[]>('/notifications'),
    markAllRead: () => client.post<void>('/notifications/read-all'),
    respondToRequest: (id, accept) =>
      client.post<void>(
        `/notifications/${encodeURIComponent(id)}/${accept ? 'accept' : 'decline'}`,
      ),
  };
}

export function notificationsQueryOptions(client: HttpClient) {
  return queryOptions({
    queryKey: notificationKeys.list(),
    queryFn: () => createNotificationApi(client).list(),
  });
}
