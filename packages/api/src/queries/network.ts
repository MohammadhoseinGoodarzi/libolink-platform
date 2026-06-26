import type { ReaderNetwork } from '@repo/types';
import { queryOptions } from '@tanstack/react-query';
import type { HttpClient } from '../client';

// Reader Network (handoff Friends) — the discovery hub reached from the drawer.
export const networkKeys = {
  all: ['network'] as const,
  surface: () => [...networkKeys.all, 'surface'] as const,
};

export interface NetworkApi {
  surface(): Promise<ReaderNetwork>;
  /** Send/cancel a connection request; resolves to the new pending state. */
  connect(id: string): Promise<{ pending: boolean }>;
  /** Accept/decline an incoming request; resolves to the resolved id. */
  respond(id: string, accept: boolean): Promise<{ id: string; accepted: boolean }>;
}

export function createNetworkApi(client: HttpClient): NetworkApi {
  return {
    surface: () => client.get<ReaderNetwork>('/network'),
    connect: (id) =>
      client.post<{ pending: boolean }>(`/network/${encodeURIComponent(id)}/connect`, undefined),
    respond: (id, accept) =>
      client.post<{ id: string; accepted: boolean }>(`/network/${encodeURIComponent(id)}/respond`, {
        accept,
      }),
  };
}

export function networkSurfaceQueryOptions(client: HttpClient) {
  return queryOptions({
    queryKey: networkKeys.surface(),
    queryFn: () => createNetworkApi(client).surface(),
  });
}
