# Replace sessionStorage with IndexedDB for theme preview data

Story: story-949
Agent: quick-fixer

## Context

Theme data is passed to the playground preview via `sessionStorage`, which has a 5MB limit. Generated themes with complex templates can exceed this. Replace with IndexedDB via `idb-keyval` for effectively unlimited storage.

## What changes

| File | Change |
|---|---|
| `src/app/playground-preview/page.tsx` | Replace `sessionStorage.getItem("playground-theme")` (line 16) with `idb-keyval` `get("playground-theme")`. Make the data retrieval async. |
| `src/app/app/page.tsx` | Replace `sessionStorage.setItem("playground-theme", ...)` with `idb-keyval` `set("playground-theme", ...)`. The writer side needs to match. |

<!-- CODER_ONLY -->
## Tasks

1. Install `idb-keyval` — run `npm install idb-keyval` in the worktree.
2. In `src/app/app/page.tsx`, find where `sessionStorage.setItem("playground-theme", ...)` is called. Replace with `import { set } from 'idb-keyval'` and `await set("playground-theme", data)`.
3. In `src/app/playground-preview/page.tsx`, replace `sessionStorage.getItem("playground-theme")` (line 16) with `import { get } from 'idb-keyval'` and `const raw = await get("playground-theme")`. Since this is inside a useEffect, wrap the retrieval in an async IIFE.
4. Remove any remaining `sessionStorage` references for theme data.
<!-- END_CODER_ONLY -->

## Acceptance criteria

- Given a theme is generated and "Preview in WordPress" is clicked, when the preview page loads, then theme data is retrieved from IndexedDB (not sessionStorage)
- Given a theme larger than 5MB is generated, when previewing, then it loads without error

## Verification

- Build passes
- Preview workflow functions end-to-end
- No sessionStorage references for theme data remain

<!-- TESTER_ONLY -->
<!-- END_TESTER_ONLY -->
