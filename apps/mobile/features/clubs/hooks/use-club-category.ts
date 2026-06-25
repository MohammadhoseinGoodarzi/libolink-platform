import { type ClubListingFilters, clubListingInfiniteQueryOptions } from '@repo/api';
import { useInfiniteQuery } from '@tanstack/react-query';
import { clubsClient } from '../services/clubs-service';

// Infinite, server-filtered listing for one directory category (the "see all"
// screen). Search + sort + genre + year are applied by the (mock) backend, so
// they narrow the whole catalogue, not just the loaded pages. The query key
// includes every filter, so changing any of them starts a fresh paged result.
export function useClubCategory(category: string, filters: ClubListingFilters) {
  return useInfiniteQuery(clubListingInfiniteQueryOptions(clubsClient, category, filters));
}
