# Wire skeleton pages into multi-page workbench UI

Story: (pending)
Agent: quick-fixer

## Context

The API generates skeleton pages (about, contact, pricing, etc.) and sends them as `skeletonPages` in the response, but the frontend drops them — missing from the type, the streaming handler, the file list, and the preview renderer.

## What changes

| File | Change |
|---|---|
| `src/lib/packer/constants.ts` | Add `skeletonPages` optional field to `ThemeFilesData`; add skeleton pages to `buildThemeFileMap` output |
| `src/app/app/page.tsx` | Handle `skeleton-pages` streaming event; include `pages/<slug>` in WorkbenchHeader `files` prop; pass `skeletonPages` to ThemePreview |
| `src/components/WorkbenchHeader.tsx` | Add "Pages" section in dropdown for files matching `pages/` prefix |
| `src/components/ThemePreview.tsx` | Accept optional `skeletonPages` prop; resolve page content when `activeFile` starts with `pages/` |

## Tasks

1. In `constants.ts`: Add `skeletonPages?: Record<string, { title: string; slug: string; content: string }>` to `ThemeFilesData`. In `buildThemeFileMap`, iterate over `skeletonPages` and write each as `templates/page-<slug>.html` (WordPress convention for page templates).
2. In `page.tsx` streaming handler: Add `else if (parsed.type === "skeleton-pages" && parsed.files)` branch that merges into `themeFiles.skeletonPages`.
3. In `page.tsx` WorkbenchHeader: Spread `Object.keys(result.themeFiles.skeletonPages || {}).map(s => `pages/${s}`)` into the `files` array.
4. In `page.tsx` ThemePreview: Pass `skeletonPages={result?.themeFiles.skeletonPages}` prop.
5. In `WorkbenchHeader.tsx`: Filter files for `pages/` prefix (like existing `parts/` filter). Add a third "Pages" section in the dropdown between Parts and the end. Use a document icon. Display the page name stripped of `pages/` prefix.
6. In `ThemePreview.tsx`: Add `skeletonPages?: Record<string, { title: string; slug: string; content: string }>` to props. In the file resolution block, add a branch: if `activeFile.startsWith('pages/')`, extract slug via `activeFile.replace('pages/', '')`, look up `skeletonPages?.[slug]?.content`, and use that as `templateHTML`. Add `skeletonPages` to the useEffect dependency array.

## Acceptance criteria

- Skeleton pages appear in the WorkbenchHeader dropdown under a "Pages" section
- Clicking a page in the dropdown switches the preview to show that page's content
- Page tabs appear in the tab bar when opened
- Skeleton pages are included in the zip export via `buildThemeFileMap`

## Verification

- Generate a theme and confirm pages section appears in the file dropdown
- Click each page and verify the preview updates
- Download the theme zip and confirm page templates are included
