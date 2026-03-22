# Create Next.js dynamic route for SaaS sub-pages

Story: story-1038
Agent: architect

## Context

Create a dynamic route at `src/app/templates/saas/[slug]/page.tsx` that maps URL slugs to JSX source constants and renders them via JsxStringRenderer. The parent layout already wraps children with header and footer.

## What changes

| File | Change |
|---|---|
| `src/app/templates/saas/[slug]/page.tsx` | New file: dynamic route component that resolves slug to JSX source from jsx-sources.ts and renders via JsxStringRenderer. Falls back to 404 page for unknown slugs. |

## Frontend Design (Gemini)

- Component uses `useParams()` to extract slug from URL
- TEMPLATE_MAP object maps slugs to JSX source constants
- Unknown slugs fall back to SAAS_404_JSX_SOURCE
- WP_VAR_BRIDGE injects CSS custom property mappings at root div
- 'use client' directive required for JsxStringRenderer's Babel parser hooks

## Architecture (Claude)

- Import all JSX sources from `../jsx-sources`
- Slug map: { "404": SAAS_404_JSX_SOURCE, "signup": SAAS_SIGNUP_JSX_SOURCE, "pricing": SAAS_PRICING_JSX_SOURCE, "docs": SAAS_DOCS_JSX_SOURCE, "contact": SAAS_CONTACT_JSX_SOURCE }
- The parent layout.tsx already renders header + {children} + footer, so this component only renders the page body
- No need for the WP_VAR_BRIDGE here — the parent layout/TemplateProvider already handles CSS variable injection

<!-- CODER_ONLY -->
## Read-only context

- `src/app/templates/saas/layout.tsx` — parent layout that wraps with header/footer
- `src/app/templates/saas/page.tsx` — existing front-page component pattern to follow
- `src/components/JsxStringRenderer.tsx` — renderer component
<!-- END_CODER_ONLY -->

<!-- CODER_ONLY -->
## Tasks

1. Create `src/app/templates/saas/[slug]/page.tsx` with 'use client' directive
2. Import JSX source constants from `../jsx-sources`
3. Create TEMPLATE_MAP mapping slugs to source constants
4. Implement component: extract slug from useParams(), resolve JSX source, render via JsxStringRenderer
5. Fall back to SAAS_404_JSX_SOURCE for unknown slugs
<!-- END_CODER_ONLY -->

## Acceptance criteria

- Navigating to `/templates/saas/pricing` renders the pricing page JSX
- Navigating to `/templates/saas/404` renders the 404 page JSX
- Navigating to `/templates/saas/invalid-slug` renders the 404 page JSX
- All sub-pages render within the SaaS layout (header + footer wrapping)

## Verification

- Visit each slug URL in the browser and confirm correct content renders
- Confirm header/footer appear on all sub-pages
