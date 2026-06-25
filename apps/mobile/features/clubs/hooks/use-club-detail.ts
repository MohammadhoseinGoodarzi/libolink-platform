import { clubDetailQueryOptions, clubKeys, createClubsApi } from '@repo/api';
import type { ClubDetail } from '@repo/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import { clubsClient } from '../services/clubs-service';

// Feature binding over the shared @repo/api clubs factory for a single community,
// wired to the (currently mock) clubs HttpClient. Owns the optimistic Join/Leave
// toggle: it flips `joined` (and the member count) in the React Query cache so the
// button reacts instantly, fires the api call, and rolls back on failure.
export function useClubDetail(id: string) {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, refetch } = useQuery(clubDetailQueryOptions(clubsClient, id));
  // Block overlapping join/leave requests — rapid taps would otherwise fire racing
  // calls and roll back against a stale delta, desyncing joined/members.
  const inFlight = useRef(false);

  const patch = (joined: boolean, delta: number) => {
    queryClient.setQueryData<ClubDetail>(clubKeys.detail(id), (c) =>
      c ? { ...c, joined, members: c.members + delta } : c,
    );
  };

  // Returns the new joined state so the caller can pick the right toast, or null
  // when a request is already in flight (the tap is ignored).
  const toggleJoin = (): boolean | null => {
    if (inFlight.current) {
      return null;
    }
    const current = queryClient.getQueryData<ClubDetail>(clubKeys.detail(id));
    const next = !(current?.joined ?? false);
    inFlight.current = true;
    patch(next, next ? 1 : -1);
    const api = createClubsApi(clubsClient);
    const call = next ? api.join(id) : api.leave(id);
    call
      .catch(() => patch(!next, next ? -1 : 1))
      .finally(() => {
        inFlight.current = false;
      });
    return next;
  };

  return { data, isLoading, isError, refetch, toggleJoin };
}
