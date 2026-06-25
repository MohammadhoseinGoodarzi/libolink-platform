import type { ClubDetail, ClubListing, ClubsDirectory, Paginated } from '@repo/types';
import { infiniteQueryOptions, keepPreviousData, queryOptions } from '@tanstack/react-query';
import type { HttpClient } from '../client';

const at = (id: string) => `/clubs/${encodeURIComponent(id)}`;

// Sort + refinement options for a category listing (the "see all" screen).
export interface ClubListingFilters {
  /** Name search; empty string means no filter. */
  q: string;
  /** Sort key: 'top' | 'trending' | 'new' | 'az'. */
  sort: string;
  /** Genre/category key; 'all' means no filter. */
  genre: string;
  /** Publish-year bucket: 'all' | '2020s' | '2010s' | '2000s' | 'classic'. */
  year: string;
}

// One page of a directory category's full listing (the "see all" screen).
export interface ClubListingParams extends ClubListingFilters {
  category: string;
  page: number;
}

// Clubs & Communities directory + detail + paginated listings (handoff §6.5).
export const clubKeys = {
  all: ['clubs'] as const,
  directory: () => [...clubKeys.all, 'directory'] as const,
  detail: (id: string) => [...clubKeys.all, 'detail', id] as const,
  listing: (category: string, filters: ClubListingFilters) =>
    [...clubKeys.all, 'listing', category, filters] as const,
};

export interface ClubsApi {
  directory(): Promise<ClubsDirectory>;
  detail(id: string): Promise<ClubDetail>;
  /** One page of a category's full community listing, name/activity filtered. */
  listing(params: ClubListingParams): Promise<Paginated<ClubListing>>;
  /** Join/follow a community; resolves to the new membership state. */
  join(id: string): Promise<{ joined: boolean }>;
  /** Leave/unfollow a community; resolves to the new membership state. */
  leave(id: string): Promise<{ joined: boolean }>;
}

export function createClubsApi(client: HttpClient): ClubsApi {
  return {
    directory: () => client.get<ClubsDirectory>('/clubs/directory'),
    detail: (id) => client.get<ClubDetail>(at(id)),
    listing: ({ category, page, q, sort, genre, year }) => {
      const query = [`page=${page}`];
      if (q) {
        query.push(`q=${encodeURIComponent(q)}`);
      }
      if (sort) {
        query.push(`sort=${encodeURIComponent(sort)}`);
      }
      if (genre && genre !== 'all') {
        query.push(`genre=${encodeURIComponent(genre)}`);
      }
      if (year && year !== 'all') {
        query.push(`year=${encodeURIComponent(year)}`);
      }
      return client.get<Paginated<ClubListing>>(
        `/clubs/listing/${encodeURIComponent(category)}?${query.join('&')}`,
      );
    },
    join: (id) => client.post<{ joined: boolean }>(`${at(id)}/membership`, undefined),
    leave: (id) => client.delete<{ joined: boolean }>(`${at(id)}/membership`),
  };
}

export function clubsDirectoryQueryOptions(client: HttpClient) {
  return queryOptions({
    queryKey: clubKeys.directory(),
    queryFn: () => createClubsApi(client).directory(),
  });
}

export function clubDetailQueryOptions(client: HttpClient, id: string) {
  return queryOptions({
    queryKey: clubKeys.detail(id),
    queryFn: () => createClubsApi(client).detail(id),
  });
}

export function clubListingInfiniteQueryOptions(
  client: HttpClient,
  category: string,
  filters: ClubListingFilters,
) {
  return infiniteQueryOptions({
    queryKey: clubKeys.listing(category, filters),
    queryFn: ({ pageParam }) =>
      createClubsApi(client).listing({ category, page: pageParam, ...filters }),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.page < last.totalPages ? last.page + 1 : undefined),
    // Keep the current results on screen while a new search/sort/filter loads, so
    // the list doesn't blank out and jump on every refinement.
    placeholderData: keepPreviousData,
  });
}
