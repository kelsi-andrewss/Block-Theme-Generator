# SaaS layout reads header/footer from IDB

Story: story-1081
Agent: architect

## Context

`layout.tsx` imports `SAAS_HEADER_JSX_SOURCE` and `SAAS_FOOTER_JSX_SOURCE` as static constants from `page.tsx` and renders them directly. This means any header/footer changes written to IDB by the workbench (story-1079) are invisible in the layout — the header and footer are frozen at their initial static values.

`page.tsx` and `[slug]/page.tsx` already have IDB read patterns from a previous attempt, but the layout never adopted them. After the revert (93833b5) nothing currently writes to IDB either, but once story-1079 lands the write side will exist. This story makes the read side complete.

All three files are `'use client'` components, so there is no true SSR hydration mismatch risk — Next.js App Router `'use client'` components render on the client. However, IDB is async, so we still need `useState` + `useEffect` to avoid blocking initial render: start with the static fallback, then swap to IDB content once it resolves.

## What changes

| File | Change |
|---|---|
| `src/app/templates/saas/layout.tsx` | Add `useState`/`useEffect` + `get` from `idb-keyval`. Read `header` and `footer` keys from the `"jsx-pages"` IDB store on mount. Fall back to `SAAS_HEADER_JSX_SOURCE` / `SAAS_FOOTER_JSX_SOURCE` if no stored value exists. Pass the stateful values to `JsxStringRenderer`. |
| `src/app/templates/saas/page.tsx` | No functional change needed — already has `useState` + `useEffect` + `get("jsx-pages")` reading `stored.home`. Kept as-is. |
| `src/app/templates/saas/[slug]/page.tsx` | No functional change needed — already has `useState` + `useEffect` + `get("jsx-pages")` reading `stored[slug]`. Kept as-is. |

<!-- CODER_ONLY -->
## Read-only context

- IDB write side: story-1079 will call `set("jsx-pages", { home: "...", header: "...", footer: "...", pricing: "...", ... })` from `src/app/app/page.tsx`. The value is a `Record<string, string>` where keys are page/component names and values are JSX source strings.
- `page.tsx` reads with key `"home"`, `[slug]/page.tsx` reads with key matching the dynamic `slug` param.
- `layout.tsx` must read keys `"header"` and `"footer"` — these match the keys in `[slug]/page.tsx`'s `TEMPLATE_MAP`.
- The static constants `SAAS_HEADER_JSX_SOURCE` and `SAAS_FOOTER_JSX_SOURCE` are exported from `page.tsx` and re-exported from `jsx-sources.ts`. These remain as fallbacks; do not remove the exports.
<!-- END_CODER_ONLY -->

## Contract

```typescript
// layout.tsx — new state and effect (added to existing SaaSLayout component)
const [headerJsx, setHeaderJsx] = useState(SAAS_HEADER_JSX_SOURCE);
const [footerJsx, setFooterJsx] = useState(SAAS_FOOTER_JSX_SOURCE);

useEffect(() => {
  get<Record<string, string>>("jsx-pages").then(stored => {
    if (stored?.header) setHeaderJsx(stored.header);
    if (stored?.footer) setFooterJsx(stored.footer);
  });
}, []);
```

Render changes:
- `<JsxStringRenderer jsxString={SAAS_HEADER_JSX_SOURCE} />` becomes `<JsxStringRenderer jsxString={headerJsx} />`
- `<JsxStringRenderer jsxString={SAAS_FOOTER_JSX_SOURCE} />` becomes `<JsxStringRenderer jsxString={footerJsx} />`

No new exports, no API changes, no new files.

<!-- CODER_ONLY -->
## Tasks

1. In `src/app/templates/saas/layout.tsx`:
   - Add `import { useState, useEffect } from 'react';`
   - Add `import { get } from 'idb-keyval';`
   - Inside `SaaSLayout`, add `const [headerJsx, setHeaderJsx] = useState(SAAS_HEADER_JSX_SOURCE);` and `const [footerJsx, setFooterJsx] = useState(SAAS_FOOTER_JSX_SOURCE);`
   - Add `useEffect` that calls `get<Record<string, string>>("jsx-pages").then(stored => { if (stored?.header) setHeaderJsx(stored.header); if (stored?.footer) setFooterJsx(stored.footer); });` with empty dependency array.
   - Replace `jsxString={SAAS_HEADER_JSX_SOURCE}` with `jsxString={headerJsx}`.
   - Replace `jsxString={SAAS_FOOTER_JSX_SOURCE}` with `jsxString={footerJsx}`.
2. Verify `page.tsx` and `[slug]/page.tsx` already read from IDB correctly (no changes needed — just confirm the existing `get("jsx-pages")` calls are present and functional).
<!-- END_CODER_ONLY -->

## Acceptance criteria

- Given IDB `"jsx-pages"` contains `{ header: "<header>Custom</header>" }`, when `layout.tsx` mounts, then the header renders from the IDB value instead of `SAAS_HEADER_JSX_SOURCE`.
- Given IDB `"jsx-pages"` contains `{ footer: "<footer>Custom</footer>" }`, when `layout.tsx` mounts, then the footer renders from the IDB value instead of `SAAS_FOOTER_JSX_SOURCE`.
- Given IDB `"jsx-pages"` is empty or missing, when `layout.tsx` mounts, then the header and footer render from the static constants (no visual change from current behavior).
- Given IDB `"jsx-pages"` contains `{ header: "..." }` but no `footer` key, when `layout.tsx` mounts, then only the header updates; footer remains the static constant.
- Given the `?isolate=true` query param is set, when `layout.tsx` mounts, then neither header nor footer renders (existing behavior preserved).

## Verification

- In the browser: open the SaaS template preview. Open DevTools console and run `(await import('idb-keyval')).set('jsx-pages', { header: '<header><p>IDB Header</p></header>', footer: '<footer><p>IDB Footer</p></footer>' })`. Reload the page. The header and footer should render the IDB content.
- Clear IDB (`(await import('idb-keyval')).del('jsx-pages')`), reload — static fallback content should appear.
- Navigate to a sub-page (e.g., `/templates/saas/pricing`) — the layout header/footer should also reflect IDB content.
- Add `?isolate=true` to the URL — header and footer should not render regardless of IDB state.

<!-- TESTER_ONLY -->
<!-- END_TESTER_ONLY -->
