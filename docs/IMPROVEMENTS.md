# Improvement Backlog — known-good things we'd do better with more time

> Living list of **deliberate trade-offs and small nits** that are not bugs and not
> blocking, but that a future pass should tighten. Distinct from `ENGINEERING_LOG.md`
> (solved incidents) and `PRE_RELEASE_CHECKLIST.md` (mock/dev-only things that MUST go
> before ship). Add an entry whenever you knowingly pick the pragmatic option over the
> textbook one, or spot a refinement that isn't worth doing right now. Note *why it's
> deferred* so the next person doesn't re-litigate it.

Last updated: 2026-06-26.

---

## Routing & navigation (mobile)

Context: the app uses Expo Router file-based routing — a `Stack` in
`app/(dashboard)/_layout.tsx` wrapping a nested `Tabs` group, with the drawer-reached
pages (Settings / Saved / Friends / Subscription) as `Stack` siblings of `(tabs)`.
Navigation uses **`router.push`** (history stack — back returns to the previous page);
the bottom tab bar uses `router.navigate` (tab switch, correct there). Drawer pages show
the hamburger `Header` (open-drawer) instead of a back button, like the tab screens.

> We tried `router.navigate` for "top-level" jumps and reverted it: the `(tabs)` group is
> a **singleton**, so navigating toward a tab rewinds the stack to the tab navigator and
> resets it to Home — making *every* back land on Home. `push` keeps a real history stack.

### 1. Custom overlay drawer instead of Expo Router's `Drawer` layout — DEFERRED (deps)
- **What:** the drawer is a hand-built `ModalShell` overlay (`shared/components/shell/
  left-drawer.tsx`), not `expo-router/drawer`.
- **Why deferred:** the by-the-book `Drawer` layout pulls in `react-native-gesture-handler`
  + `react-native-reanimated`, which the repo deliberately bans to keep the native
  dependency surface minimal (see `ENGINEERING_LOG.md` 2026-06-22 and the locked
  package decisions in project memory). This is a conscious trade-off, not an oversight.
- **Consequence to revisit:** because the drawer pages are `Stack` siblings (not Drawer
  routes), `navigate` dedupes them but hopping **between two non-tab pages**
  (e.g. Settings → Saved) can still leave one extra `Stack` entry (order-dependent).
  Harmless today (no page shows a back button), but not perfectly "tab-like."
- **If we ever revisit:** either (a) adopt the real `Drawer` layout — only if the
  gesture-handler/reanimated ban is lifted — or (b) keep one `Stack` but give the drawer
  reset/replace semantics for non-tab pages so there's always exactly one in history.

### 2. Drill-in buttons must use stacked routes, not the tab roots — DONE for the known spots
- **Why:** Profile and Messages are **tabs** (singleton roots). A button that targets the
  Profile/Messages *tab* rewinds `(tabs)` and resets to Home, so hardware back lands on
  Home instead of the page you came from.
- **Fixed:** Settings → View Profile pushes a stacked `/me` (owner `ProfileView` + back
  header); the reader sheet pushes `/reader/[id]` (visitor profile) and `/chat/[id]`
  (seeded chat) instead of the tabs; visitor-mode `ProfileView` "Message" pushes
  `/chat/[id]`. All push/pop normally → back returns to the previous page.
- **Residual (acceptable):** a few *section-jump* spots still target tab roots on purpose —
  the drawer's Messages item / profile card, and Saved's empty-state "Explore" → Home.
  These are "go to that section" actions, so resetting to the tab root is fine. Revisit
  only if a specific one feels wrong in use.

### 3. `as never` casts in the drawer `go()` — EASY WIN
- **What:** `router.navigate(route as never)` in `left-drawer.tsx` casts away Expo
  Router's href type-safety.
- **Better:** type the drawer items' `route` as `Href` (from `expo-router`) and drop the
  cast, so a typo'd route is a compile error instead of a runtime dead link.

### 4. Typed routes experiment not enabled — OPTIONAL
- **What:** route hrefs are hand-rolled via the central `ROUTES` constant
  (`shared/constants`). Fine and common, but Expo Router can verify hrefs at compile time.
- **Better:** enable `experiments.typedRoutes` in `app.json` for free compile-time href
  checking. Pairs naturally with #2 (both about typing navigation). Low risk; verify it
  doesn't fight the `ROUTES` indirection first.

---

## How to use this file
- Keep entries **actionable** (what / why deferred / what better looks like).
- When you actually do one, delete it here and — if it involved a real gotcha — add the
  resolution to `ENGINEERING_LOG.md`.
