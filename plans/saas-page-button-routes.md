# SaaS template: fix global component routing

Story: (pending)
Agent: quick-fixer

## Context

Clicking Header/Footer global components in the workbench dropdown shows the front page instead of the isolated component, because the iframe URL derivation maps `parts/*` to the base URL.

## What changes

| File | Change |
|---|---|
| `src/app/app/page.tsx` | Update iframeSlug derivation: map `parts/header.html` → `header` and `parts/footer.html` → `footer` instead of returning `''` |
| `src/app/templates/saas/[slug]/page.tsx` | Add `header` and `footer` to TEMPLATE_MAP, mapping to SAAS_HEADER_JSX_SOURCE and SAAS_FOOTER_JSX_SOURCE |
| `src/app/templates/saas/page.tsx` | No changes needed — already renders front page correctly |

## Tasks

1. In page.tsx: change the iframeSlug IIFE to handle `parts/` prefix — strip `parts/` and `.html` to get the slug (e.g., `parts/header.html` → `header`)
2. In [slug]/page.tsx: import SAAS_HEADER_JSX_SOURCE and SAAS_FOOTER_JSX_SOURCE from jsx-sources, add `'header'` and `'footer'` entries to TEMPLATE_MAP

## Acceptance criteria

- Clicking Header in Global Components shows only the header in the preview
- Clicking Footer in Global Components shows only the footer in the preview
- All page buttons continue to work correctly

## Verification

- Click each dropdown button and confirm the iframe navigates to the correct route
