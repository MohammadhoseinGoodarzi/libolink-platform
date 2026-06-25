import type { HttpClient } from '@repo/api';
import type { ClubDetail, ClubListing, ClubsDirectory, Paginated } from '@repo/types';
import { CLUBS_DIRECTORY, getClubDetail, getClubListings } from './clubs-data';

// Offline clubs backend (handoff §7) — a minimal HttpClient fulfilling the routes
// createClubsApi calls. Swap `clubsClient` in clubs-service.ts for the real
// httpClient when it exists; the api factories, hooks, and screens stay the same.
const NETWORK_DELAY = 450;
// 20 ≈ 1.5–2 phone screens of 64px rows: overflows the viewport so infinite
// scroll can trigger, without an over-eager re-fetch on every flick (UX R&D).
const PAGE_SIZE = 20;

// Trending order: liveliest communities first.
const ACTIVITY_RANK: Record<ClubListing['activity'], number> = {
  buzzing: 0,
  high: 1,
  medium: 2,
  steady: 3,
  new: 4,
};

// Publish-year (decade) buckets for the year filter.
function inYearBucket(year: number, bucket: string): boolean {
  if (bucket === '2020s') {
    return year >= 2020;
  }
  if (bucket === '2010s') {
    return year >= 2010 && year < 2020;
  }
  if (bucket === '2000s') {
    return year >= 2000 && year < 2010;
  }
  if (bucket === 'classic') {
    return year < 2000;
  }
  return true;
}

function sortListings(list: ClubListing[], sort: string): ClubListing[] {
  const sorted = [...list];
  if (sort === 'trending') {
    return sorted.sort(
      (a, b) => ACTIVITY_RANK[a.activity] - ACTIVITY_RANK[b.activity] || b.count - a.count,
    );
  }
  if (sort === 'new') {
    return sorted.sort((a, b) => b.year - a.year || b.count - a.count);
  }
  if (sort === 'az') {
    return sorted.sort((a, b) => a.name.localeCompare(b.name));
  }
  // 'top' (default) — most members/followers first.
  return sorted.sort((a, b) => b.count - a.count);
}

// `/clubs/listing/{category}?page=&q=&activity=` (paginated "see all").
const CLUB_LISTING = /^\/clubs\/listing\/([^/?]+)(?:\?(.*))?$/;
// `/clubs/{id}` (detail) — one segment, excluding the `directory`/`listing` routes.
const CLUB_DETAIL = /^\/clubs\/([^/]+)$/;
// `/clubs/{id}/membership` (join/leave).
const CLUB_MEMBERSHIP = /^\/clubs\/([^/]+)\/membership$/;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), NETWORK_DELAY));
}

function parseQuery(qs: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const pair of qs.split('&')) {
    if (!pair) {
      continue;
    }
    const [key, value = ''] = pair.split('=');
    if (key) {
      out[decodeURIComponent(key)] = decodeURIComponent(value);
    }
  }
  return out;
}

function listingPage(category: string, qs: string): Paginated<ClubListing> {
  const params = parseQuery(qs);
  const page = Math.max(1, Number(params.page) || 1);
  const q = (params.q ?? '').toLowerCase();
  const genre = params.genre ?? 'all';
  const year = params.year ?? 'all';
  const sort = params.sort ?? 'top';

  let list = getClubListings(category);
  if (q) {
    list = list.filter((l) => l.name.toLowerCase().includes(q));
  }
  if (genre !== 'all') {
    list = list.filter((l) => l.genre === genre);
  }
  if (year !== 'all') {
    list = list.filter((l) => inYearBucket(l.year, year));
  }
  list = sortListings(list, sort);

  const totalItems = list.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  return {
    items: list.slice(start, start + PAGE_SIZE),
    page,
    pageSize: PAGE_SIZE,
    totalItems,
    totalPages,
  };
}

export function createMockClubsClient(): HttpClient {
  function unsupported(): never {
    throw new Error('mock-clubs-client: route not implemented');
  }

  async function get<T>(path: string): Promise<T> {
    // Boundary cast (`as Promise<T>`): the mock returns the route's concrete
    // type; the generic T is owned by the @repo/api query factories.
    if (path === '/clubs/directory') {
      const directory: ClubsDirectory = CLUBS_DIRECTORY;
      return delay(directory) as Promise<T>;
    }
    const listing = CLUB_LISTING.exec(path);
    if (listing?.[1]) {
      const page = listingPage(decodeURIComponent(listing[1]), listing[2] ?? '');
      return delay(page) as Promise<T>;
    }
    const detail = CLUB_DETAIL.exec(path);
    if (detail?.[1]) {
      const club: ClubDetail = getClubDetail(decodeURIComponent(detail[1]));
      return delay(club) as Promise<T>;
    }
    return unsupported();
  }

  // Membership is owned optimistically by the detail hook's query cache; the mock
  // just acknowledges with the resulting state (POST joins, DELETE leaves).
  async function post<T>(path: string): Promise<T> {
    if (CLUB_MEMBERSHIP.test(path)) {
      return delay({ joined: true }) as Promise<T>;
    }
    return unsupported();
  }

  async function del<T>(path: string): Promise<T> {
    if (CLUB_MEMBERSHIP.test(path)) {
      return delay({ joined: false }) as Promise<T>;
    }
    return unsupported();
  }

  return {
    request: unsupported,
    get,
    post,
    put: unsupported,
    patch: unsupported,
    delete: del,
    addRequestInterceptor: () => undefined,
    addResponseInterceptor: () => undefined,
  };
}
