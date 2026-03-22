# IDB persistence of modified JSX source

Story: story-1079
Agent: architect

## Context

Previous attempts (commits 586dd3b through bbc9566, reverted in 93833b5) failed because they replaced the DOM-patch iteration path with a JSX-level rewrite path. That approach sent full-page JSX to Gemini, got rewritten JSX back, stored it to IDB, and forced an iframe remount. The result: slow round-trips, no instant visual feedback, and Gemini hallucinating structural changes to unrelated parts of the page.

The correct architecture is **dual-write**: keep the existing DOM-patch path (PATCH_STYLES, PATCH_ELEMENT via postMessage) for instant visual feedback, and add a concurrent background pipeline that applies the same edit to the JSX AST and persists it to IDB. The DOM is already correct from the postMessage patch — the AST mutation is purely for persistence so the edit survives page reload and appears in download/preview transpilation.

Story-1077 changes the `/api/iterate` response to include a structured `editIntent` field alongside the existing `styles`/`html`/`textContent` fields. Story-1078 provides `applyAstMutation(jsxSource, editIntent)` which uses recast to apply that intent to JSX source without rewriting unrelated code. Story-1080 provides `PATCH_HTML` postMessage support (no-remount hot-swap). This story wires them together in `page.tsx`.

The `jsxPages` state (currently `useState` on line 79) becomes the in-memory mirror of IDB. On mount, initialize from IDB. On every edit, update both state and IDB. The iframe is NOT reloaded — the DOM patch already handled the visual update.

## What changes

| File | Change |
|---|---|
| `src/app/app/page.tsx` | (1) Add IDB hydration on mount: read `"jsx-pages"` from idb-keyval into `jsxPages` state. (2) Add `commitJsxEdit(slug, editIntent)` helper that calls `applyAstMutation`, updates `jsxPages` state, and writes to IDB. (3) In `handleSendMessage`, after each successful DOM-patch postMessage (PATCH_STYLES, PATCH_ELEMENT), fire `commitJsxEdit` concurrently — do not await it, do not block the UI response. (4) Add `activeSlug` → jsxPages key resolution so the correct page source is mutated. |

<!-- CODER_ONLY -->
## Read-only context

- `src/lib/transpiler/ast-mutator.ts` — `applyAstMutation(jsxSource: string, editIntent: EditIntent): string` (story-1078). Recast-based — parses JSX, finds node by `data-uid`, applies property/text/structural change, prints back. Returns the modified JSX source string with all unrelated code untouched.
- `src/app/api/iterate/route.ts` — After story-1077, the targeted-edit response shape is an `EditIntentResponse`:
  ```typescript
  // New response format (story-1077):
  { edits: EditIntent[]; explanation: string }
  // Where EditIntent is: { kind: "style"|"text"|"attribute"|"html"; uid: string; ... }
  // Legacy fallback still supported: { styles?: Record<string, string>; html?: string; textContent?: string; explanation: string }
  ```
  Each edit carries a `uid` (the `data-uid` attribute from story-1076) and a discriminated `kind`. The legacy fallback means the consumer must try `edits` first, then fall back to the old 3-key format.
- `src/components/NativeIframeController.tsx` — Handles PATCH_STYLES, PATCH_ELEMENT, and (after story-1080) PATCH_HTML postMessages inside the iframe.
- `src/app/templates/saas/page.tsx` (lines 326-329) — Already reads `"jsx-pages"` from IDB on mount via `get<Record<string, string>>("jsx-pages")`. This is the consumer side — we only need to ensure the producer (page.tsx) writes correctly.
<!-- END_CODER_ONLY -->

## Contract

```typescript
import { get, set } from "idb-keyval";
import { applyAstMutation, type EditIntent } from "@/lib/transpiler/ast-mutator";

const IDB_KEY = "jsx-pages";

/**
 * Map the workbench activeFile to the jsxPages dictionary key.
 * Already exists as `activeSlug` useMemo on line 81 — reuse it.
 *
 * "index.html" | "front-page.html" → "home"
 * "parts/header.html" → "header"
 * "pages/pricing" → "pricing"
 * "404.html" → "404"
 */
function fileToJsxKey(activeFile: string): string;

/**
 * Apply an edit intent to the JSX source for a given page,
 * update jsxPages state, and persist to IDB.
 *
 * Fire-and-forget from handleSendMessage — errors are logged,
 * never surfaced to the user or allowed to block the DOM-patch path.
 *
 * @param slug - jsxPages key (e.g., "home", "header", "pricing")
 * @param edits - Array of structured edits from API response (story-1077 EditIntent[])
 */
async function commitJsxEdit(slug: string, edits: EditIntent[]): Promise<void>;
```

<!-- CODER_ONLY -->
## Tasks

1. **Import `get` from idb-keyval** (line 20 already imports `set` — add `get` to the same import).

2. **IDB hydration on mount.** Add a `useEffect` (empty deps) that calls `get<Record<string, string>>("jsx-pages")` and, if the result is non-null, calls `setJsxPages(stored)`. Place it after the existing `jsxPages` useState declaration (line 79). This means: if a user previously edited JSX and reloads the page, their edits are restored as the initial state. The `handleSelectGalleryTheme` function already sets jsxPages for fresh starts, so this only applies to reload recovery.

3. **Add `commitJsxEdit` as a `useCallback`** inside `Home()`, after `handleSendMessage`. Implementation:
   - Guard: if `jsxPages` is null, return (non-JSX theme, nothing to persist).
   - Guard: if `jsxPages[slug]` is undefined, return (unknown page).
   - Call `applyAstMutation(jsxPages[slug], edits)` to get `updatedJsx`.
   - Call `setJsxPages(prev => prev ? { ...prev, [slug]: updatedJsx } : null)`.
   - Call `set(IDB_KEY, { ...jsxPages, [slug]: updatedJsx })` (fire-and-forget the promise — catch and console.error).
   - Wrap the entire body in try/catch. On error, `console.error("[commitJsxEdit]", err)` and return. Never throw — this must not disrupt the main flow.
   - Deps: `[jsxPages]`.

4. **Wire `commitJsxEdit` into `handleSendMessage`.** In the `if (block)` branch, after the API response is parsed and the DOM-patch postMessage is dispatched:
   - If `data.edits` exists (array, story-1077 format) and `jsxPages` is not null:
     - Compute the slug via `activeSlug` (the existing useMemo, already derived from `activeFile`).
     - Call `commitJsxEdit(activeSlug, data.edits)` — no `await`. This runs concurrently with the DOM patch.
   - If `data.edits` does not exist (legacy format), skip AST mutation — DOM-patch-only mode. No regression.
   - This goes right before `return data.explanation` (line 225), after the `if/else if/else if` block that handles styles/textContent/html.
   - Update the `handleSendMessage` useCallback deps to include `jsxPages` and `activeSlug`.

5. **Also persist on gallery theme selection.** In `handleSelectGalleryTheme` (line 570), after calling `setJsxPages(...)` for the saas theme, also write to IDB: `set(IDB_KEY, { home: SAAS_JSX_SOURCE, header: SAAS_HEADER_JSX_SOURCE, ... })`. This seeds IDB so the iframe can read initial sources on mount even before any edits occur. Same fire-and-forget pattern.

6. **Clear IDB on start over.** In `handleStartOver` (line 558), after `setJsxPages(null)`, add `set(IDB_KEY, undefined)` to clear stale data from IDB so a fresh generation doesn't accidentally load previous session's JSX.
<!-- END_CODER_ONLY -->

## Acceptance criteria

- Given the SaaS template is selected from the gallery, when the page mounts, then `jsxPages` state is populated and `"jsx-pages"` is written to IDB with all page sources.
- Given a user clicks an element and sends an iteration message, when the API returns a response with `editIntent`, then the DOM is patched immediately via postMessage AND the JSX source in `jsxPages[activeSlug]` is updated via `applyAstMutation` AND the updated pages are persisted to IDB under `"jsx-pages"`.
- Given the above edit occurred, when the user reloads the browser, then `jsxPages` state is hydrated from IDB on mount with the previously edited JSX source.
- Given a successful edit, when `commitJsxEdit` throws (e.g., AST parse error), then the DOM patch is unaffected — the user sees their visual change, the error is logged to console, and no UI disruption occurs.
- Given a non-JSX theme (generated via the pipeline, not gallery), when the user iterates, then `commitJsxEdit` is a no-op (jsxPages is null) and the existing DOM-patch-only flow is unchanged.
- Given the user clicks "Start over", when the page resets, then IDB `"jsx-pages"` is cleared.
- Given a user downloads the theme after iterating, when `handleDownload` runs, then `transpileJsxPagesToThemeFiles` uses the updated `jsxPages` (which reflects all AST mutations), producing a ZIP with the iterated content baked in.

## Verification

- Select SaaS template. Open DevTools > Application > IndexedDB > `keyval-store` > `keyval`. Confirm `"jsx-pages"` key exists with all page sources.
- Click a heading, type "make it red", send. Confirm: (1) heading turns red immediately in the iframe, (2) `"jsx-pages"` in IDB now contains `style={{...color:"red"...}}` (or equivalent) in the relevant page source.
- Reload the page. Select SaaS template again. Confirm the edited heading still shows the red color (hydrated from IDB).
- Trigger a commitJsxEdit failure (e.g., temporarily return malformed JSX from applyAstMutation). Confirm the DOM patch still applies and console shows the error.
- Click "Start over". Confirm `"jsx-pages"` is removed from IDB.
- Download ZIP after iterating. Unzip and inspect `front-page.html` — the iterated style change should be present in the WordPress block markup.

<!-- TESTER_ONLY -->
<!-- END_TESTER_ONLY -->
