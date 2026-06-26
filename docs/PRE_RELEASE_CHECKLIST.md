# Pre-Release Checklist — mocks & dev-only affordances to remove/gate

> Living inventory of everything that exists only because there is **no backend yet**.
> Before the app ships, every item here must be removed, swapped for the real
> implementation, or hard-gated behind `__DEV__`. Add a row whenever you introduce a
> mock, a seed, or a dev toggle. Companion to `ENGINEERING_LOG.md` (incidents) and the
> frontend-security backlog in project memory.

Last updated: 2026-06-26.

---

## 1. Mock HTTP clients (swap at the `*-service.ts` seam)

Each feature talks to a mock `HttpClient` selected in its `services/<feature>-service.ts`.
When the backend exists, point that one export at the real `httpClient` — hooks, forms,
and screens are untouched. **Also add a `__DEV__`/env assertion so a mock client can
never bundle into a release** (a fabricated-token auth bypass would be severe — see §3).

| Feature | Mock client | Service seam to repoint |
|---|---|---|
| Auth | `features/auth/services/mock-auth-client.ts` | `auth-service.ts` |
| Home feed | `features/home/services/mock-feed-client.ts` | `feed-service.ts` |
| Notifications | `features/home/services/mock-notifications-client.ts` | `notifications-service.ts` |
| Messages | `features/messages/services/mock-messages-client.ts` | `messages-service.ts` |
| Profile | `features/profile/services/mock-profile-client.ts` | `profile-service.ts` |
| Clubs | `features/clubs/services/mock-clubs-client.ts` | `clubs-service.ts` |
| Search | `features/search/services/mock-search-client.ts` | `search-service.ts` |

## 2. Seed / persona data (delete once real data flows)

- `features/home/services/feed-data.ts` — feed posts, stories, and the signed-in
  persona `ME` (Mehrab Kargardoost). **`ME.isPremium = true`** (see §3).
- `features/home/services/comments-data.ts` — mock commenters + `MENTION_USERS`.
- `features/messages/services/messages-data.ts`, `contacts-data.ts` — threads/contacts.
- `features/profile/services/profile-data.ts` — `MEHRAB_PROFILE` aggregate.
- `features/clubs/services/clubs-data.ts` — directory + generated regional chapters.
- `features/auth/services/profile-options.ts`, `username-availability.ts` — canned lists.

## 3. Dev-only affordances (must be removed or `__DEV__`-gated)

- **Premium mode toggle** — `shared/components/shell/left-drawer.tsx` "Switch to
  Normal/Premium User" button (`toggleMode`). Testing aid for the two app modes; gate
  behind `__DEV__` or remove. Real premium status comes from the subscription/backend.
- **Seeded premium user** — mock sign-ins land in premium mode:
  `mock-auth-client.ts` sets `isPremium: true`, and `feed-data.ts` `ME.isPremium = true`.
  Default real users to **non-premium**; premium must be backend-driven.
- **Fabricated session token** — `mock-auth-client.ts` returns `'mock-access-token'`.
  Never allow into a release build (auth-bypass risk).
- **Deep-link straight to `/home`** without auth (no session guard on the dashboard).
  Add a real auth guard before release.

## 4. "Coming soon" placeholders (wire to real features)

- `comingSoon` / per-feature toasts standing in for unbuilt actions (compose
  attachments, share/invite, edit profile, create-club, help & support, etc.).
- Placeholder drawer routes (Friends/Saved/Settings/Subscription) where still stubs.

## 5. Misc copy/claims

- **"End-to-end encrypted" messaging copy** is cosmetic (no crypto). Implement real
  E2E or soften the copy before shipping (trust/compliance risk).
