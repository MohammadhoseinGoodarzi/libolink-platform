# Libolink Monorepo — CLAUDE.md

Turborepo + pnpm workspaces monorepo:

- `apps/web` — Next.js (App Router) with shadcn/ui (new-york style)
- `apps/mobile` — Expo / React Native with react-native-reusables + NativeWind
- `packages/*` — Shared types, validators, API client, stores, hooks, utilities, i18n

**Core law:** Code is written once. The only accepted duplication is UI. Every type, validator,
schema, HTTP call, Jotai atom, business logic hook, utility function, and i18n string lives in a
shared package and is consumed by both apps. If you find yourself writing the same non-UI logic in
both apps, stop — it belongs in a package.

---

## Canonical Version Table (approved 2026-06-13 — do not change without explicit approval)

| Package | Web | Mobile | Shared | Notes |
|---|---|---|---|---|
| next | 16.2.9 | — | — | ≥16.2.6 required (May 2026 security release, 13 CVEs) |
| react / react-dom | 19.2.7 | 19.2.7 | peer | 19.2.3 affected by May 2026 React/Next security release |
| expo | — | 56.0.11 | — | SDK 56 |
| react-native | — | 0.85.3 | — | Expo SDK 56 matrix — do NOT use npm latest (0.86.x) |
| expo-router | — | 56.2.10 | — | SDK-aligned versioning; no longer depends on react-navigation |
| nativewind | — | 4.2.5 | — | Tailwind v3 ONLY. v5 (Tailwind v4) still preview — revisit when stable |
| react-native-reusables | — | CLI 0.7.1 | — | Copy-in components via `@react-native-reusables/cli`; not a runtime dep |
| @react-native-async-storage/async-storage | — | 2.2.0 | — | `expo install`-pinned (SDK 56); theme + settings persistence, future session token |
| expo-image-picker | — | ~56.0.18 | — | `expo install`-pinned (SDK 56); Complete-Profile photo (camera/gallery) |
| Vazirmatn (font) | woff2 (web) | ttf 400/500/600/700 (mobile) | — | Bundled asset, NOT a dependency. Mobile `.ttf` in `assets/fonts/` from the Google Fonts release |
| react-native-web | — | ~0.21.0 | — | Web preview only (`expo start --web`); Expo SDK 56-aligned |
| react-dom (mobile) | — | catalog: (19.2.7) | — | Web preview peer; matches React (NOT the SDK-suggested 19.2.3 — react/react-dom must match) |
| @expo/metro-runtime | — | ~56.0.15 | — | Required by Expo web bundling |
| @tanstack/react-query | 5.101.0 | 5.101.0 | 5.101.0 | catalog |
| jotai | 2.20.1 | 2.20.1 | 2.20.1 | catalog |
| jotai-tanstack-query | 0.11.0 | 0.11.0 | 0.11.0 | No stable v1.0 exists (verified 2026-06-13) |
| valibot | 1.4.1 | 1.4.1 | 1.4.1 | catalog |
| react-hook-form | 7.78.0 | 7.78.0 | 7.78.0 | catalog; works on RN |
| @hookform/resolvers | 5.4.0 | 5.4.0 | 5.4.0 | catalog |
| lucide-react / lucide-react-native | 1.18.0 | 1.18.0 | — | v1: icon renames, brand icons removed, ESM/CJS only |
| tailwindcss | 4.3.1 | 3.4.19 | — | Web v4 (CSS config); mobile pinned v3 for NativeWind 4 |
| tw-animate-css | 1.4.0 | — | — | Replaces tailwindcss-animate (Tailwind v4-native) |
| @radix-ui/react-dialog | 1.1.16 | — | — | |
| @radix-ui/react-slot | 1.2.5 | — | — | |
| class-variance-authority | 0.7.1 | 0.7.1 | catalog | |
| clsx / tailwind-merge | 2.1.1 / 3.6.0 | 2.1.1 / 3.6.0 | catalog | |
| @biomejs/biome | — | — | 2.5.0 | Root devDep only |
| turbo | — | — | 2.9.18 | Root devDep only |
| typescript | 5.9.3 | 5.9.3 | 5.9.3 | Pinned 5.x per project decision (6.0.3 exists, not adopted) |
| @types/node | ^25.9.3 | — | catalog | No v26 types published yet |
| pnpm | — | — | 10.11.0 | `packageManager` pin; catalogs need ≥9.5 |
| Node | — | — | 26.3.0 | `.nvmrc` |

Shared versions live in the `catalog:` of `pnpm-workspace.yaml` — apps/packages reference them
with `"catalog:"`. Mobile's Expo-managed deps (expo, react-native, expo-*) stay explicit per the
Expo SDK 56 compatibility matrix.

The root `.npmrc` sets `node-linker=hoisted` (Expo's official pnpm-monorepo recommendation): React
Native autolinking + Metro need a flat-ish `node_modules` to resolve bare imports injected by
tooling (e.g. NativeWind's `react-native-css-interop/jsx-runtime`). Do NOT revert to the strict
pnpm layout for the mobile app. Note: Expo Go (Play/App Store) is version-locked and cannot run
this SDK 56 app — use the web preview (`expo start --web`) or a dev build to run it.

---

## Repository Layout

```
libolink/
├── apps/
│   ├── web/                 → Next.js App Router
│   └── mobile/              → Expo + React Native
├── packages/
│   ├── types/               → @repo/types       (no @repo deps)
│   ├── validators/          → @repo/validators  (← @repo/types)
│   ├── api/                 → @repo/api         (← @repo/types)
│   ├── stores/              → @repo/stores      (← @repo/types)
│   ├── hooks/               → @repo/hooks       (← api, stores, types, validators)
│   ├── utils/               → @repo/utils       (no @repo deps)
│   ├── i18n/                → @repo/i18n        (no @repo deps)
│   └── config/
│       └── typescript/      → tsconfig bases (not a publishable package)
├── turbo.json
├── pnpm-workspace.yaml      → workspace globs + version catalog
├── biome.json               → ROOT — single source of lint/format truth
├── package.json             → devDeps only (turbo, biome, typescript)
└── .nvmrc
```

**No circular dependencies — ever.** If one is forming, stop and surface it.

### Import direction (both apps — identical rule)

```
app/ → features/* (barrel only) → shared/ → @repo/*
```

- Features NEVER import from other features
- `shared/` NEVER imports from `features/`
- `app/` NEVER imports internal feature paths — barrel (`@/features/auth`) only

---

## Shared Package Rules

All packages are `@repo/<name>`, ship TypeScript source directly (no build step), and export via:

```json
"exports": { ".": { "types": "./src/index.ts", "default": "./src/index.ts" } }
```

- **@repo/types** — types/interfaces ONLY. No runtime code, no platform imports. Shared by both
  apps; single-app types stay in that app's `features/<name>/types/`.
- **@repo/validators** — Valibot schemas mirroring @repo/types. Export schema + inferred type.
  Includes `valibotResolver` re-export for react-hook-form.
- **@repo/api** — fetch-based `createHttpClient(config)` factory (NOT Axios), interceptor chain
  (auth inject, error normalize, 401), `makeQueryClient()`, query/mutation factories by domain.
  Zero platform-specific imports.
- **@repo/stores** — global Jotai atoms both apps need (userAtom, sessionAtom, themeAtom).
  Feature-scoped atoms stay in each app.
- **@repo/hooks** — hooks that would be byte-for-byte identical in both apps. Touches `window`/
  `localStorage` → web app only. Touches `useColorScheme`/`Dimensions`/`Platform` → mobile only.
- **@repo/utils** — pure functions only. `cn()` (clsx + tailwind-merge) lives here.
- **@repo/i18n** — `messages/en.json` is the ONE canonical strings file. `getDictionary(namespace)`
  mirrors next-intl API. Namespace = feature name (PascalCase), keys = camelCase. Never hardcode
  user-visible strings in any component in either app.

Mock data and service stubs stay in each app's `features/<name>/services/` — not in packages.

---

## Web App Rules (apps/web)

### RSC first
- Server Component by default; `"use client"` only for state, effects, browser APIs, event
  listeners, or client-context libraries. Push the boundary to the leaves (containers).
- Never `useEffect` for data fetching — async Server Components with direct `await`.
- `React.cache()` for deduplicating server-side fetches.
- Prefer `loading.tsx` / `error.tsx` over client-side loading states.
- Do NOT use `useQuery` to replace RSC data fetching. TanStack Query is for mutations, optimistic
  updates, polling, invalidation. Client/UI state → Jotai. Query-in-atom → `atomWithQuery` /
  `atomWithMutation` from jotai-tanstack-query.

### Components
- Never raw `<button>` — use `<Button>` from `@/shared/components/ui/button`. Exception: invisible
  accessibility wrapper with `type="button"`, `aria-label`, zero styling.
- Never raw `<input>` — use `<Input>`, `<PasswordInput>`, or `<SearchInput>`.
- `<Button>` defaults to `type="button"` — pass `type="submit"` explicitly on form submits.
- Variants (must match mobile naming): `default` (green fill), `outline` (surface fill, green
  text), `ghost` (transparent), `destructive` (crimson fill), `post` (brand-primary, glow).
- Sizes: `default` (h-42px), `sm` (h-8), `lg` (h-52px), `icon` (36×36), `icon-sm` (32×32),
  `post` (h-19px).

### Dark mode
- No-flash script in `app/layout.tsx` `<body>` — synchronous localStorage read before React
  mounts. NEVER replace with useEffect. `suppressHydrationWarning` on `<html>` is intentional.
- `ThemeToggle`: `useSyncExternalStore` + MutationObserver on documentElement classList;
  `getServerSnapshot = () => false`. Must appear on every page.
- `.dark {}` block in `globals.css` overrides all semantic tokens.

### Overlays
- Never Radix Dialog for full-screen glass/blur overlays (its own overlay blocks backdrop-blur).
  Use `createPortal(…, document.body)` with `backdrop-blur-xl bg-white/10` on the outermost div.
  Radix Dialog is fine for standard modals.

### Misc
- next/image natural ratio: `width={0} height={0} sizes="…" className="w-full h-auto block"`;
  blob URLs: `unoptimized={src.startsWith('blob:')}`.
- Scroll-hide anti-oscillation: `visibleRef` + `lastToggle` refs, skip events within 350ms.
- Tailwind v4: config lives in `app/globals.css` (no tailwind.config.ts). Built-in scale only —
  no arbitrary bracket values unless no built-in equivalent exists.
- shadcn/ui: new-york, neutral, RSC enabled. Install via `pnpm dlx shadcn@latest add <component>`.
  Edit installed sources directly for customizations — no duplicate overrides.
- i18n: every Server Component rendering text is `async` and calls `getDictionary(namespace)`.
  Client components / leaves use the sync `useDictionary(namespace)` from @repo/i18n.
- Keep `next.config.ts` minimal. Next 16 removed built-in ESLint, so no
  `eslint.ignoreDuringBuilds` is needed; pin `turbopack.root` to the monorepo root so Next
  never infers a stray lockfile higher up the tree. Don't touch `next-env.d.ts`.

---

## Mobile App Rules (apps/mobile)

- **Mirror principle:** same feature names, same folder shape, same barrel rule, same naming, and
  route groups `(auth)`/`(dashboard)`/`(landing)` match web.
- Containers = screen-level orchestrators (no directive concept; everything is client-side).
- No Server Actions — mobile calls `@repo/api` directly.
- Expo Router only — never React Navigation directly. `"newArchEnabled": true` in app.json.
- Never raw `<TouchableOpacity>` for buttons → mobile `<Button>`. Never raw `<TextInput>` →
  `<Input>`/`<PasswordInput>`/`<SearchInput>`. Mobile UI mirrors web variant/size names exactly.
- NativeWind 4 (Tailwind v3 pinned — see version table). Same `cn()` from @repo/utils.
- Dark mode: RN `useColorScheme` bridged via `themeAtom` from @repo/stores; NativeWind dark classes.
- Metro: `watchFolders` monorepo root, transpile all `@repo/*` (they ship TS source), path aliases
  for `@/` and `@repo/*` in both metro.config.js and babel.config.js (module-resolver).
- Fonts via expo-font (Vazirmatn — same as web). Icons via lucide-react-native.
- Before the first native build run `npx expo install --fix` to align transitive native
  modules (react-native-reanimated/worklets, @react-native/metro-config) to the Expo SDK 56
  matrix. Two peer warnings on `pnpm install` are expected until then — do NOT pin them with
  manual `pnpm.overrides` (root package.json stays devDeps-only).

### Implemented shared layer — reuse, never recreate
- UI atoms barrel `@/shared/components/ui`: `Text` (Vazirmatn-enforcing — use INSTEAD of RN
  `<Text>` so no screen leaks the system font), `Button`, `Input`/`PasswordInput`/`SearchInput`
  (filled, recessed), `Card`, `Avatar`, `BookCover`, `FilterChip`, `MessageBubble`, badges
  (`CountBadge`/`VerifiedBadge`/`ProChip`), `IconButton`, `BrandGradient` (svg green→navy),
  `BottomSheet`, `ActionSheet`, `Toast`. `BrandLogo` is `@/shared/components/brand-logo`.
- Shell `@/shared/components/shell`: `Header`, `LeftDrawer`, `BottomTabBar` (raised AI centre
  opens Lio), `LioAssistant`. Drawer/Lio toggle via `drawerOpenAtom`/`lioOpenAtom`
  (`@/shared/store/ui`). `ToastProvider` lives at the app root (`app/_layout.tsx`) — fire with
  `useToast().show()`.
- Sheets/drawer use built-in `Modal` + `Animated` + `PanResponder` (NO gesture-handler /
  reanimated / @gorhom). Gradients use the installed `react-native-svg` (NO expo-linear-gradient).
  Ask before adding native deps — the owner keeps the dependency surface minimal.
- Theme: `useThemeColors()` + `useShadow()` from `@/shared/theme` for any RN prop that can't read a
  CSS var (lucide `color`, `placeholderTextColor`, `shadowColor`, svg fills). `oklchToHex` /
  `avatarColors` / `hueFromString` for avatars. Persisted via AsyncStorage — `useAppTheme`
  (toggle) and `useThemeBootstrap` (root gate, applies theme + fonts before first paint).
- Fonts: Vazirmatn only via family classes — `font-sans` (400) · `font-sans-medium` (500) ·
  `font-sans-semibold` (600) · `font-sans-bold` (700). Do NOT use Tailwind weight classes
  (`font-medium`/`font-bold`) on RN text — static weights are separate registered families.
- Mock data lives in `features/<name>/services` (auth runs on a mock `HttpClient` until the
  backend exists — swap `authClient` in `features/auth/services/auth-service.ts`, untouched hooks).

### Running it (no device needed)
- **Expo Go cannot run this app** — it is version-locked and tops out below SDK 56. Use the **web
  preview** (or a dev build). Run from the **repo ROOT** (the shell cwd drifts; a bare `expo`
  then computes the wrong project root): `pnpm --filter mobile exec expo start --web` →
  http://localhost:8081. No login backend — deep-link `/home` on web, or use the mock auth form.
- `global.css` ends with a web-only block (input focus outline + Chrome autofill) that is
  DOM-targeted and ignored on native — keep web/native parity in mind when editing it.

---

## Naming Conventions (everywhere)

| Thing | Convention | Example |
|---|---|---|
| Files & folders | kebab-case | `sign-in-form.tsx`, `use-auth.ts` |
| Components | PascalCase | `export function SignInForm` |
| Hooks | camelCase | `export function useAuth` |
| Constants | SCREAMING_SNAKE_CASE | `export const AUTH_ROUTES` |
| Types/Interfaces | PascalCase | `interface SignInFormProps` |
| Jotai atoms | camelCase + `Atom` | `export const userAtom` |
| TanStack Query key factories | camelCase + `Keys` | `export const postKeys` |
| Packages | @repo/kebab-case | `@repo/types` |

Query-key factories are the one intentional exception to the SCREAMING_SNAKE_CASE
constant rule: every `@repo/api` domain uses the `xxxKeys` convention
(`userKeys`, `postKeys`, `messageKeys`, `authKeys`, `profileKeys`, `clubKeys`) —
the React Query community standard. Keep new ones consistent; don't rename to
`XXX_KEYS`. (CodeRabbit flags these — it's a false positive.)

---

## TypeScript & Code Style

- Strict always: `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`,
  `noImplicitReturns`.
- No `any` (use `unknown` + type guard; if unavoidable, inline comment why). No `as` casts without
  an inline justification comment.
- Never `import * as React` — import exactly what's needed, types with `type`.
- **No `type`/`interface` declarations inside component files** (any `*.tsx` that renders, incl.
  private in-file helper components and their prop types). Move them to an organized `types/`
  folder, not scattered next to each file:
  - Feature code → `features/<name>/types/` (the feature-based structure).
  - Shared components → a shared `types/` folder (e.g. `shared/components/ui/types/`), grouped
    like `@repo/types` does — RN/platform-coupled prop types can't go in `@repo/types`.
  - Cross-app domain types still go in `@repo/types`.
  - Type declarations in non-component `.ts` files (constants/validations/services/hooks) are
    fine — this rule targets component files only.
- Named exports for components — **except framework route files**, which the router contract
  requires to **default-export**: Next.js `apps/web/app/**` pages/layouts and Expo Router
  `apps/mobile/app/**` screens. Converting these to named exports breaks routing. (CodeRabbit
  flags route default exports as a false positive — keep them default; see ENGINEERING_LOG
  2026-06-19.) `async/await` over `.then()`. `cn()` for all className merging. `cva` for
  variants. TypeScript only — never `.js` source files.

## Linting — Biome only

- One root `biome.json`. Apps/packages use nested configs: `{ "root": false, "extends": "//" }`.
- No ESLint. No Prettier. Anywhere.
- Single quotes, trailing commas all, semicolons, 2-space indent, 100-char lines, organized
  imports via assist.
- **Line endings are LF everywhere**, enforced by the root `.gitattributes` (`* text=auto
  eol=lf`). Biome formats to LF; CRLF in the working tree (e.g. a Windows checkout with
  `core.autocrlf=true` on a repo missing `.gitattributes`) makes `biome check .` fail on every
  file. Do NOT remove `.gitattributes`. See `docs/ENGINEERING_LOG.md` (2026-06-17 entry).
- **Run `pnpm lint` after creating or editing files — no task is done with lint errors.**

## Package Management

- pnpm only. Never npm/yarn.
- Before installing anything: check compatibility, peer deps, breaking changes. Never install a
  package without asking first. When confirmed, update the version table above.
- Shared versions via `catalog:` in pnpm-workspace.yaml.

## Git Workflow

- Never commit directly to `dev` or `main`. Branch from `dev`: `feat/<descriptive-name>`.
- Commit step by step — one logical unit per commit, ask before committing.
- Conventional commits (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`).
- Never include `Co-Authored-By:` in commit messages.

## Engineering log

`docs/ENGINEERING_LOG.md` is the running record of **notable problems and how we resolved
them** — non-obvious bugs, environment/tooling gotchas, and the reasoning behind structural
decisions. Two hard rules:

- **Check it FIRST when you hit a problem or error.** Before debugging anything unexpected
  (build/lint/type/test failures, tooling or environment weirdness), search this log — the
  fix may already be written down. Don't re-debug a solved problem.
- **Always log it AFTER you resolve one.** Append a dated entry (newest on top: *symptom →
  root cause → fix → prevention*) for anything that cost real debugging time or that a
  teammate could hit again. No task that involved a non-trivial problem is done until it's
  logged.
