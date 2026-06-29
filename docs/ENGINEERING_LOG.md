# Engineering Log

A running, append-only record of **notable problems and how we resolved them** — non-obvious
bugs, environment/tooling gotchas, and the reasoning behind structural decisions. The goal is
that nobody debugs the same thing twice.

**Format:** newest entry on top. Each entry: date · title · *Symptom* → *Root cause* → *Fix* →
*Prevention*. Keep it concise; link to commits/PRs where useful.

---

## 2026-06-30 — First EAS Android build: upload geo-block, the GitHub-build workaround, ngrok + `expo install --fix` gotchas (branch `chore/android-build-setup`, PR #32)

*Goal.* Produce a sideloadable test APK and a remote tunnel so a coworker in another city
could test. Three tooling gotchas, one hard blocker.

**1. EAS upload 403 (the blocker).** *Symptom:* `eas build -p android --profile preview`
(and later `eas workflow:run`) ran all the way through — project linked, keystore generated in
the cloud, project compressed to 2.4 MB — then died at *"Uploading project archive to EAS …
Request failed: 403 (Forbidden)."* *Root cause:* the EAS Build **upload/storage endpoint is
geo-blocked** from the owner's network (`api.expo.dev` itself is fine — config/keystore went
through; only the tarball upload is blocked). This is the long-standing "EAS dead-ended" note.
*Fix:* **don't upload from the local machine — build from GitHub.** Expo dashboard → *Build from
GitHub* (connect the Expo GitHub App to the repo, set **base directory `apps/mobile`**, branch,
Android, profile `preview`); Expo clones the code server-side, so nothing uploads from the blocked
network. The APK built this way. *Prevention:* every local CLI build path uploads a tarball and
will 403 here — always use the GitHub-sourced dashboard build (or a `git push`-triggered
workflow). A VPN also clears it but the GitHub route is the durable answer. Logged in CLAUDE.md
"Running it".

**2. `--tunnel` needs `@expo/ngrok` as a LOCAL dep (pnpm monorepo).** *Symptom:* `expo start
--tunnel` aborted: *"@expo/ngrok is required … non-interactive mode."* Installing it globally
(`pnpm add -g` failed on a corrupted global store; `npm i -g` succeeded) still didn't help —
Expo resolves it from the **pnpm project**, not npm's global. *Fix:* add `@expo/ngrok` to
`apps/mobile` devDependencies. After that the tunnel connected (slow internet needed a retry
loop; the URL was pulled from ngrok's local API at `127.0.0.1:4040/api/tunnels`). Note the same
geo-block also makes ngrok's own connect flaky, so the tunnel is unreliable here regardless.

**3. `expo install --fix` overreaches on TypeScript.** *Symptom:* the mandated pre-native-build
`expo install --fix` bumped `typescript` from the pinned catalog `5.9.3` to `~6.0.3` (TS isn't a
native module). *Fix:* revert that one line back to `"typescript": "catalog:"` and reinstall; keep
the expo-* patch bumps it made (expo 56.0.11→56.0.12, expo-font →56.0.7, expo-router →56.2.11),
which are the legitimate SDK-56 alignment. *Aside:* swapping the TS version left a stale
`apps/mobile/node_modules/.bin/tsc` symlink (type-check failed to find `tsc`); `rm -rf
apps/mobile/node_modules && pnpm install` restored it.

## 2026-06-26 — Component-base consolidation #2–#4: ModalShell, Chip, Card (branch `chore/mobile-component-bases`)

*Decision.* Continued the "one base + thin variants" rule (Button is the model; InputBase was
the first base, PR #28). Three more families folded to a single base each:
- **`ModalShell`** (`shared/components/ui/modal-shell.tsx`) — the lone `Modal` + scrim + mount-
  while-animating lifecycle. A single `0→1` `progress` `Animated.Value` (native driver) drives
  scrim opacity + panel slide + panel fade; `placement` = `bottom` (sheets, slide up) / `left`
  (drawer, slides in by `slideDistance` = its width) / `full` (fade, no scrim). Rebuilt
  `BottomSheet`, `ActionSheet`, `left-drawer`, `story-viewer`, `search-overlay` on it — was
  ~5× duplicated Modal/scrim/Animated plumbing (−178 lines). BottomSheet's grabber, `header`
  slot, 90%-box and keyboard-overlap padding were left byte-identical so the comments sheet's
  layout/keyboard handling didn't regress.
- **`Chip`** (`chip.tsx` + `chip-variants.ts` cva) — `tone` neutral/muted/primary/accent +
  `size` sm/default + `selectable`. `FilterChip` is now a thin selectable wrapper; static
  topic/tag/Joined/screen pills pass a `tone` instead of a hand-rolled `rounded-full
  bg-secondary` View. Static pill heights normalised to the sm(22)/default(32) scale.
- **`Card`** (`card-variants.ts` cva) — `variant` elevated (default soft shadow) / flat (bordered,
  shadowless) + `padded`. Migrated the 3 hand-rolled `rounded-2xl border bg-card p-4` cards.

*Gotcha (teammates will hit this).* Under `exactOptionalPropertyTypes`, you **cannot** forward an
optional `string | undefined` straight into a non-optional RN/Animated prop. Two cases here:
(a) `<Animated.View className={panelClassName}>` where `panelClassName?: string` — NativeWind's
`className` on `Animated.View` is typed non-`undefined`, so pass it conditionally:
`{...(panelClassName ? { className: panelClassName } : {})}`. (b) A passthrough optional like
`label`/`count`/`onPress` that a wrapper hands down must be typed `T | undefined` (not just `T?`)
on the base's props, or the call site (`label={label}`) fails. *Prevention.* On a base component
that re-forwards optionals, declare those props as `?: T | undefined`; for `className`/other
props the underlying RN type marks non-optional, spread them in conditionally rather than passing
`undefined`.

## 2026-06-26 — `BrandGradient` didn't fill content-sized surfaces / clipped circles (PR #28)

*Symptom.* The profile favourite-quote card (content height, no fixed height) showed the
gradient over only part of its box; separately, after a first fix, the raised AI-tab circle
had a thin transparent sliver on its right/bottom edge ("not a complete circle"). *Root cause.*
`BrandGradient` drew its SVG with `width/height="100%"`. A percentage size only resolves when the
parent has an explicit height, so on a content-sized parent it collapsed and the gradient never
covered the box. Switching to the measured pixel size then rounded *short* on hi-dpi (e.g. a
47.6px box measured/drawn as 47), leaving a sub-pixel gap on the right/bottom of fixed-size
circles. *Fix.* Measure the laid-out size via `onLayout` and draw the `<Svg>`/`<Rect>` at
`Math.ceil(size) + 1` (1px overscan, clipped by the wrapper's `overflow-hidden`), with `'100%'`
as the first-frame fallback so fixed-size callers never flash; also compose any caller-provided
`onLayout`. *Prevention.* For an SVG that must fill an RN box, never rely on `100%` on a
content-sized parent — measure it and overscan by a pixel; the wrapper's `overflow-hidden` hides
the spill. Same pattern applies to any future full-bleed SVG surface (sponsored cards, etc.).

## 2026-06-22 — Comments-sheet drag-to-dismiss removed; global-testing (ngrok/EAS) dead-ends

Context: polishing the Social Home comments sheet (`feat/mobile-home-comments`) on a real
device via Expo Go. Three notable things, all from this session.

**1. Drag-to-dismiss on `BottomSheet` — attempted, never worked on-device, removed.**
*Symptom.* Dragging the grabber/header down did nothing — the sheet never followed the
finger and never dismissed (Android, Expo Go). *Root cause (most likely, compounded).*
(a) `translateY` was animated with `useNativeDriver: true`; on Android a value owned by the
native driver ignores JS-side `.setValue()` mid-gesture, so finger-tracking never rendered.
(b) `Animated.Value` is created in `useRef`, which **survives Fast Refresh** — so after
flipping the timings to `useNativeDriver: false`, the *live* value was still the old
native-bound instance and stayed broken until a full reload (which we couldn't reliably get
the device to do). Hardening (`onMoveShouldSetPanResponderCapture`, `collapsable={false}`,
velocity dismiss, opacity fade) didn't help in the time available. *Fix.* Removed the
feature per owner's call — `BottomSheet` is back to a static slide-up sheet (native-driven
enter/exit), dismiss via scrim tap or a close control. Kept the green (`bg-primary`) grabber
as a visual handle and the `header` prop (used for layout, below). *Prevention.* For any
future RN gesture/drag work without reanimated/gesture-handler: keep the dragged
`Animated.Value` **JS-driven** (`useNativeDriver: false`) end-to-end, and **fully reload**
(not Fast Refresh) when changing an `Animated.Value`'s driver — the useRef instance persists
and keeps its old native binding.

**2. Composer hidden behind the Android nav bar — fixed (kept).** *Symptom.* The comments
composer (input + send) sat behind the 3-button nav bar, untappable. *Root cause.*
`BottomSheet` caps content at `maxHeight: 90%`; the grabber + header + fixed-height body +
bottom pad together exceeded that, so the bottom (composer) overflowed below the box, into
the nav-bar inset. *Fix.* The comments body height is capped against the chrome:
`min(height*0.84, height*0.9 - SHEET_CHROME - pad)` where `SHEET_CHROME ≈ 72` (grabber ~30 +
header ~42) and `pad` is the keyboard overlap when open else `useBottomInset()`. The sheet
header is rendered via `BottomSheet`'s `header` prop (non-scrolling region) so it's counted
in the cap. Keyboard-rise of the composer works and must not be "fixed" again.

**3. Global device testing over the internet — both routes dead-ended here, reverted.**
Tried to share the dev app beyond LAN. *(a) Expo tunnel (`expo start --tunnel`)* repeatedly
failed with `ngrok tunnel took too long to connect`; root cause is the bundled agent in
`@expo/ngrok` 4.1.3 is **ngrok v2 (2.3.41)** and ngrok has sunset the v2 session protocol
(`failed to reconnect session … i/o timeout`, even with a valid authtoken). *(b) EAS Update*
(`eas update`) bundled + exported fine but the asset upload failed with **`403 Forbidden`** —
API calls (login/init/configure) worked but the binary upload to Expo's storage CDN was
refused, the signature of an IP/region restriction (a VPN that didn't cover the upload host).
*Outcome.* Owner abandoned both; testing stays on **LAN** (`exp://<LAN-IP>:8081`, phone on
same Wi-Fi). Reverted all of it off the feature branch: `expo-updates` + `@expo/ngrok` deps,
the EAS block in `app.json` (`extra.eas`/`owner`/`updates`/`runtimeVersion`), and the
lockfile churn. (The `@mhg1998/libolink` EAS project on expo.dev and the local
`~/.ngrok2/ngrok.yml` authtoken were left in place — harmless, outside the repo.)

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
