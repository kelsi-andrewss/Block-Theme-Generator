# Centralize blueprint file operations into blueprint-builder writeFile steps

Story: story-952
Agent: architect

## Context

`playground-preview/page.tsx` manually creates directories via PHP `mkdir` and writes files via `client.writeFile` (lines 42-65). This logic should be in `blueprint-builder.ts` as declarative blueprint steps, so the frontend just calls `client.runBlueprint()`. The Blueprint v2 schema supports `writeFile` and `mkdir` steps natively.

## What changes

| File | Change |
|---|---|
| `src/lib/playground/blueprint-builder.ts` | Add a new `buildPreviewBlueprint(themeSlug, fileMap)` function that returns a Blueprint with `writeFile` steps for every theme file, `mkdir` steps for directories, theme activation PHP, and home page creation. This replaces the manual imperative logic in the preview page. |
| `src/app/playground-preview/page.tsx` | Replace the manual `mkdir`/`writeFile` loop (lines 42-80) with a single call to `buildPreviewBlueprint()` then `client.runBlueprint(blueprint)`. The `buildThemeFileMap` import stays — it provides the file map input. |

<!-- CODER_ONLY -->
## Read-only context

- `src/lib/packer/constants.ts` — buildThemeFileMap interface
- WordPress Playground Blueprint schema — writeFile step format: `{ step: "writeFile", path: "/wordpress/...", data: "..." }`

## Tasks

1. In `blueprint-builder.ts`, add `buildPreviewBlueprint(themeSlug: string, fileMap: Record<string, string>): Blueprint`:
   - Generate `mkdir` steps for all unique parent directories
   - Generate `writeFile` steps for each file in fileMap
   - Add theme activation PHP step (switch_theme + create home page + set static front)
   - Return complete Blueprint object

2. In `playground-preview/page.tsx`:
   - Import `buildPreviewBlueprint` from blueprint-builder
   - Replace lines 42-83 (the manual mkdir/writeFile/activation loop) with:
     ```
     const blueprint = buildPreviewBlueprint(slug, fileMap);
     await client.runBlueprint(blueprint);
     ```
   - Keep the status messages and error handling wrapper

3. Verify the `startPlaygroundWeb` + `runBlueprint` flow works — the client from `startPlaygroundWeb` exposes `runBlueprint`.
<!-- END_CODER_ONLY -->

## Contract

- `buildPreviewBlueprint(themeSlug: string, fileMap: Record<string, string>) -> Blueprint` — Returns a complete Blueprint with mkdir, writeFile, and activation steps

## Acceptance criteria

- Given a theme file map is provided, when buildPreviewBlueprint is called, then it returns a Blueprint with writeFile steps for every file
- Given the preview page loads, when boot() runs, then it uses runBlueprint instead of manual mkdir/writeFile calls
- Given the blueprint runs, then the theme is activated and the home page is set as static front

## Verification

- Build passes
- Preview workflow functions end-to-end
- No manual mkdir/writeFile calls remain in playground-preview

<!-- TESTER_ONLY -->
<!-- END_TESTER_ONLY -->
