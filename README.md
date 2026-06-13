# Libolink

A cross-platform social reading platform built as a **Turborepo + pnpm workspaces** monorepo. One
web app, one mobile app, and a set of shared packages that hold every piece of non-UI logic.

> **Core law — code is written once.** The only accepted duplication is UI. Every type, validator,
> schema, HTTP call, Jotai atom, business-logic hook, utility, and i18n string lives in a shared
> `@repo/*` package and is consumed by both apps.

---

## Apps & packages

| Workspace | Description |
|---|---|
| `apps/web` | Next.js (App Router), RSC-first, shadcn/ui (new-york), Tailwind v4 |
| `apps/mobile` | Expo / React Native, Expo Router, react-native-reusables + NativeWind |
| `packages/types` | Cross-platform TypeScript types — no runtime code |
| `packages/validators` | Valibot schemas mirroring `@repo/types` (+ `valibotResolver`) |
| `packages/api` | Fetch-based HTTP client factory + TanStack Query factories |
| `packages/stores` | Global Jotai atoms (`userAtom`, `sessionAtom`, `themeAtom`) |
| `packages/hooks` | Shared business-logic hooks (`useAuth`, `usePostActions`, `useComments`) |
| `packages/utils` | Pure functions — `cn()`, formatters |
| `packages/i18n` | Single canonical `en.json` + `getDictionary()` (next-intl-compatible) |
| `packages/config/typescript` | Shared tsconfig bases (not published) |

Shared packages ship **TypeScript source directly** (no build step); each app compiles them as part
of its own build.

---

## Tech stack

Versions are governed by a canonical table in [CLAUDE.md](./CLAUDE.md) and must not change without
explicit approval. Shared versions live in the `catalog:` of `pnpm-workspace.yaml`.

| Area | Package | Web | Mobile |
|---|---|---|---|
| Framework | next / expo | `16.2.9` | `56.0.11` (SDK 56) |
| Runtime | react / react-native | `19.2.7` | `19.2.7` / `0.85.3` |
| Routing | — / expo-router | App Router | `56.2.10` |
| Styling | tailwindcss | `4.3.1` | `3.4.19` (NativeWind `4.2.5`) |
| Data | @tanstack/react-query | `5.101.0` | `5.101.0` |
| State | jotai | `2.20.1` | `2.20.1` |
| Validation | valibot | `1.4.1` | `1.4.1` |
| Forms | react-hook-form | `7.78.0` | `7.78.0` |
| Icons | lucide-react / -native | `1.18.0` | `1.18.0` |
| Tooling | turbo · biome · typescript | `2.9.18` · `2.5.0` · `5.9.3` |

---

## Prerequisites

- **Node** `26.3.0` (see [`.nvmrc`](./.nvmrc))
- **pnpm** `10.11.0` (pinned via `packageManager`)

```bash
corepack enable
corepack prepare pnpm@10.11.0 --activate
```

---

## Getting started

```bash
pnpm install          # install all workspaces

pnpm dev              # run every app via turbo
pnpm dev:web          # web only  → http://localhost:3000
pnpm dev:mobile       # mobile only → Expo dev server
```

### Mobile — before the first native build

Two peer-dependency warnings on `pnpm install` are **expected** (transitive native modules drift
ahead of the Expo SDK 56 matrix). Align them the idiomatic Expo way:

```bash
cd apps/mobile
npx expo install --fix
```

Do **not** pin them with manual `pnpm.overrides` — the root `package.json` stays devDeps-only.

---

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Run all apps (turbo, persistent) |
| `pnpm build` | Production build of every app |
| `pnpm lint` | Biome check across the repo |
| `pnpm format` | Biome format (write) |
| `pnpm type-check` | `tsc --noEmit` across every workspace (turbo) |

---

## Architecture

### Dependency graph (no cycles — ever)

```
utils · types · i18n        → no @repo deps
validators · stores · api   → @repo/types
hooks                       → api · stores · types · validators

apps/* → features/* (barrel only) → shared/ → @repo/*
```

### Import direction (identical in both apps)

```
app/ → features/* (barrel only) → shared/ → @repo/*
```

- Features **never** import from other features.
- `shared/` **never** imports from `features/`.
- `app/` imports the feature **barrel** (`@/features/auth`) only — never internal paths.

### Feature slice (web & mobile mirror each other)

```
features/<name>/
├── components/    presentational — pure props in, JSX out
├── containers/    smart — orchestrate hooks + state
├── hooks/         feature-scoped hooks
├── services/      bind @repo/api to the app's HTTP client
├── store/         feature Jotai atoms (or re-export from @repo/stores)
├── validations/   extend / re-export @repo/validators
├── types/         feature-only types
├── constants/
└── index.ts       public barrel — the ONLY import surface
```

---

## Conventions

| Thing | Convention | Example |
|---|---|---|
| Files & folders | kebab-case | `sign-in-form.tsx` |
| Components | PascalCase | `SignInForm` |
| Hooks | camelCase | `useAuth` |
| Constants | SCREAMING_SNAKE_CASE | `AUTH_ROUTES` |
| Jotai atoms | camelCase + `Atom` | `userAtom` |
| Packages | `@repo/kebab-case` | `@repo/types` |

- **TypeScript strict** everywhere (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`,
  `noImplicitReturns`). No `any`, no unjustified `as`.
- **Biome only** — no ESLint, no Prettier. Single quotes, trailing commas, 2-space, 100 cols.
- **pnpm only.** Never install a package without approval; shared versions go through `catalog:`.
- Never hardcode user-visible strings — they live in `@repo/i18n`.

---

## Git workflow

- Branch from `dev`: `feat/<descriptive-name>`. Never commit directly to `dev` or `main`.
- Conventional commits (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`).
- One logical unit per commit.

---

## License

Private — all rights reserved.
