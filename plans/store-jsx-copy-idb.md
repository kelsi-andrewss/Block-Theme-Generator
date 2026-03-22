# Store JSX page copy in IDB, iframe reads from IDB

Story: (pending)
Agent: quick-fixer

## Context

The iframe reads from static JSX constants — changes don't persist. IDB becomes the state: parent writes the JSX copy to IDB, iframe pages read from IDB on mount and fall back to static constants.

## What changes

| File | Change |
|---|---|
| `src/app/app/page.tsx` | In handleSelectGalleryTheme: replace `setJsxPages(...)` with `set("jsx-pages", {...})` (idb-keyval). Remove the `jsxPages` React state and `setJsxPages` calls. In handleDownload/handlePreview: replace `jsxPages` reads with `await get("jsx-pages")`. In handleStartOver: add `del("jsx-pages")`. Keep activeSlug useMemo. Keep transpileJsxPagesToThemeFiles helper. |
| `src/app/templates/saas/[slug]/page.tsx` | Import `get` from `idb-keyval`. Add useState + useEffect: on mount, `get("jsx-pages")` → if found, use `stored[slug]` as jsxSource. Fall back to TEMPLATE_MAP[slug] if IDB empty. |
| `src/app/templates/saas/page.tsx` | Import `get` from `idb-keyval`. Add useState + useEffect: on mount, `get("jsx-pages")` → if found, use `stored.home` as jsxSource. Fall back to SAAS_JSX_SOURCE if IDB empty. |

## Tasks

1. In page.tsx: remove `const [jsxPages, setJsxPages]` state declaration. Remove the `setJsxPages({...})` in handleSelectGalleryTheme — replace with `set("jsx-pages", { home: SAAS_JSX_SOURCE, header: SAAS_HEADER_JSX_SOURCE, ... })`. Remove `setJsxPages(null)` in handleSelectGalleryTheme else branch — replace with `del("jsx-pages")`. In handleStartOver: replace `setJsxPages(null)` with `del("jsx-pages")`. In handleDownload: replace `jsxPages` with `await get("jsx-pages")`. In handlePreview: same. `del` is imported from `idb-keyval` (already imported as `set`).
2. In [slug]/page.tsx: add `import { get } from "idb-keyval"`. Add `const [jsxSource, setJsxSource] = useState(TEMPLATE_MAP[slug] ?? SAAS_404_JSX_SOURCE)`. Add useEffect that calls `get("jsx-pages").then(stored => { if (stored?.[slug]) setJsxSource(stored[slug]); })` on mount. Render from jsxSource state instead of the direct TEMPLATE_MAP lookup.
3. In saas/page.tsx: add `import { get } from "idb-keyval"` and `import { useState, useEffect } from "react"`. Add `const [jsxSource, setJsxSource] = useState(SAAS_JSX_SOURCE)`. Add useEffect that calls `get("jsx-pages").then(stored => { if (stored?.home) setJsxSource(stored.home); })`. Render from jsxSource state.

## Acceptance criteria

- Selecting SaaS template writes JSX copy to IDB
- Iframe pages read from IDB and render the copy
- Tab switching preserves the copy (IDB persists across iframe remounts)
- Download/preview transpile from IDB copy
- Start over clears IDB

## Verification

- Select SaaS template, verify IDB has "jsx-pages" key in devtools
- Switch tabs, verify preview still works
- Click download, verify ZIP contains transpiled content
