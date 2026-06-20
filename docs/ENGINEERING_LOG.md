# Engineering Log

A running, append-only record of **notable problems and how we resolved them** — non-obvious
bugs, environment/tooling gotchas, and the reasoning behind structural decisions. The goal is
that nobody debugs the same thing twice.

**Format:** newest entry on top. Each entry: date · title · *Symptom* → *Root cause* → *Fix* →
*Prevention*. Keep it concise; link to commits/PRs where useful.

---

## 2026-06-20 — React/renderer mismatch on first native run; web-preview removed

**Symptom.** First run on a real device (Expo Go, SDK 56) crashed: *"Incompatible React
versions: react and react-native-renderer must have the exact same version … react-native-renderer:
19.2.3"* plus *"Cannot read property 'default' of undefined"* in `RendererImplementation.js`.

**Root cause.** The catalog pinned `react`/`react-dom` to **19.2.7** (a deliberate May-2026
Next/react-dom SSR security bump), but Expo SDK 56 / RN 0.85.3 ship a reconciler built for
**19.2.3** and require an exact match. We'd never hit it because every prior check ran on the
**web preview**, which renders through `react-dom` — not the native renderer. The first native run
exposed the latent mismatch. (`pnpm --filter mobile exec expo install --check` confirms SDK wants
`react@19.2.3`.) The security advisory is a react-dom/Next SSR issue — **N/A to React Native**.

**Fix.** Aligned the whole repo to `react`/`react-dom` **19.2.3** (catalog), enforced repo-wide via
a root **`pnpm.overrides`** (a per-app pin left a *duplicate* React — root 19.2.3 + a nested 19.2.7
under `apps/mobile` from a transitive `^19` range — which is its own hazard). A stale-symlink
gotcha on Windows meant the nested 19.2.7 survived several installs; a clean `rm -rf` of all
`node_modules` + reinstall was needed. After: a single `react@19.2.3`, no nested copies.

Separately, now that Expo Go runs SDK 56 we **removed the web-preview stack** (react-native-web,
react-dom-as-mobile-dep, @expo/metro-runtime, the `web` platform, the `global.css` web block) and
the unused `features/landing`. Testing is now device-only via Expo Go (`exp://<LAN-IP>:8081`);
`expo export -p web` no longer applies — verify with type-check + lint + the device.

**⚠️ Open decision (web security debt).** Web is now on react 19.2.3 too, which lacks the 19.2.7
Next/react-dom SSR fix. Web is unbuilt scaffold so this is dormant — **when the web app is actually
built, decide** how to restore the web security pin (e.g. web-only react/react-dom 19.2.7 with
`@repo/*` react as peer-only so neither app bundles a duplicate, or whatever Next requires then).

**Prevention.** Codified in `CLAUDE.md` (version table react row + the `.npmrc`/overrides note).
Rule of thumb: the mobile React version is **dictated by the Expo SDK matrix** — run
`expo install --check` before trusting a native build, and don't bump React off the matrix for
mobile. Test on a device, not just a (now-removed) web bundle.

---

## 2026-06-19 — Route files must default-export (named-export rule has a router exception)

**Symptom.** CodeRabbit (PR #6) flagged `apps/mobile/app/(dashboard)/(tabs)/messages.tsx` for
using `export default function MessagesScreen()` and "suggested" converting it to a named export,
citing our "named exports for components" guideline.

**Root cause.** That guideline targets *our* components. **Framework route files are different:**
Expo Router (and Next.js `app/**`) discover a route by its **default export** — the file's default
is the screen/page/layout. A named export there is not picked up, so converting it silently breaks
routing (blank/404 route, no type error). CodeRabbit doesn't model this framework contract, so it's
a false positive for any file under `app/**`.

**Fix.** Kept the default export; skipped the finding with that reason. Everything else in the file
(the `MessagesHeaderActions` helper) stays a named/inline component as usual.

**Prevention.** Codified the exception in `CLAUDE.md` (TypeScript & Code Style → "Named exports for
components — **except framework route files**…"). Rule of thumb: **default-export only the route
entry under `app/**`; named-export everywhere else.** Re-flags of this pattern can be dismissed.

---

## 2026-06-17 — `biome check .` fails on ~105 untouched files (CRLF) after merge + pull

**Symptom.** Right after merging `feat/mobile-shell` → `dev` and running `git pull` + `pnpm i`
on Windows, `pnpm lint` (Biome) reported ~105 formatting errors on files nobody had edited.
The sample diffs were pure line-ending changes (`␍` → removed). Type-check was green; only
Biome failed.

**Root cause.** The repo had **no `.gitattributes`**, and the contributor's Git was set to
`core.autocrlf=true`. The committed blobs are LF, but with that combo Git rewrites files to
**CRLF in the working tree on checkout**. Biome's formatter expects **LF**, so it flagged
every CRLF file. The breakage appeared only after the round-trip through GitHub (merge → fresh
checkout) re-applied the CRLF conversion; it was invisible during the original session because
those files were authored as LF and never re-checked-out.

**Why LF (not CRLF).** Cross-platform JS/TS monorepos standardize on LF: Biome defaults to LF,
Git stores LF, and a single line-ending avoids spurious whole-file diffs and lint failures
between macOS/Linux/Windows/CI. LF in the repo **and** LF on checkout everywhere is the only
self-consistent state.

**Fix.** Added a root `.gitattributes`:

```gitattributes
* text=auto eol=lf
# + explicit `binary` for png/jpg/gif/webp/ico/ttf/otf/woff/woff2
```

This forces Git to check out LF on every platform regardless of `core.autocrlf`. The working
tree's stray CRLF files were converted back to LF — **no content/blob change** (the blobs were
already LF), so there was no normalization churn in history. (Note: after converting mtimes,
`git status` can briefly show files as modified due to a stale stat cache even though
`git diff` is empty and `git add --renormalize .` stages nothing — that's cosmetic.)

**Prevention.** `.gitattributes` is committed, so future checkouts stay LF on all platforms and
CI. Documented as a rule in `CLAUDE.md` (Linting). Do not delete `.gitattributes`. On Windows,
`core.autocrlf=false` is also fine but no longer required.
