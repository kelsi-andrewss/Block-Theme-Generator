# Create JSX source constants for SaaS sub-pages

Story: story-1037
Agent: architect

## Context

Create a new `jsx-sources.ts` module that exports JSX string constants for all SaaS sub-pages (404, signup, pricing, docs, contact). These are template literal strings rendered by JsxStringRenderer, using WordPress CSS custom properties for theming. Gemini has generated the complete JSX for all 5 pages.

## What changes

| File | Change |
|---|---|
| `src/app/templates/saas/jsx-sources.ts` | New file: export SAAS_404_JSX_SOURCE, SAAS_SIGNUP_JSX_SOURCE, SAAS_PRICING_JSX_SOURCE, SAAS_DOCS_JSX_SOURCE, SAAS_CONTACT_JSX_SOURCE constants. Also re-export existing SAAS_HEADER_JSX_SOURCE, SAAS_FOOTER_JSX_SOURCE, SAAS_JSX_SOURCE from page.tsx for single import point. |

## Frontend Design (Gemini)

### SAAS_404_JSX_SOURCE
Full-height centered layout with decorative blur background, gradient "404" heading, descriptive text, and "Back to Home" / "Contact Support" CTAs.

### SAAS_SIGNUP_JSX_SOURCE
Centered card with glassmorphism effect, form fields (Name, Email, Password) rendered as styled div placeholders, primary CTA button, and sign-in link.

### SAAS_PRICING_JSX_SOURCE
3-column grid with Starter ($19), Professional ($49, highlighted with primary border + "Most Popular" badge), and Enterprise ($99) tiers. Each with feature checklist and CTA.

### SAAS_DOCS_JSX_SOURCE
Horizontal layout: 240px sticky sidebar with grouped navigation links, main article area with breadcrumbs, headings, tip callout box, and code block.

### SAAS_CONTACT_JSX_SOURCE
Grid layout: info column with Support/Sales contact cards, form column with glassmorphism card containing Name, Email, Message fields and Send button.

All pages use: `color-mix()` borders, `--wp--preset--color--*` CSS vars, consistent border-radius (1rem cards, 0.5rem inputs/buttons), and the SaaSFlow design language.

## Architecture (Claude)

- File is a plain TypeScript module (no 'use client') so it can be imported by both client components (page.tsx, [slug]/page.tsx) and server-side generators (saas-template.ts)
- Each constant is a template literal string compatible with JsxStringRenderer's Babel parser
- SVG icons are escaped using the same `esc()` pattern from page.tsx
- Re-exports from page.tsx create a single import point for downstream consumers

<!-- CODER_ONLY -->
## Read-only context

- `src/app/templates/saas/page.tsx` — existing JSX sources and esc() helper to match
- `src/components/JsxStringRenderer.tsx` — parser constraints for JSX string format
<!-- END_CODER_ONLY -->

<!-- CODER_ONLY -->
## Tasks

1. Create `src/app/templates/saas/jsx-sources.ts`
2. Add shared SVG icon constants (ICON_404, ICON_CHECK) using the esc() pattern from page.tsx
3. Add SAAS_404_JSX_SOURCE — full-height centered error page with gradient 404, decorative blur, two CTAs
4. Add SAAS_SIGNUP_JSX_SOURCE — centered auth card with form field placeholders, primary CTA, sign-in link
5. Add SAAS_PRICING_JSX_SOURCE — 3-tier grid (Starter/Pro/Enterprise) with feature checklists and CTAs
6. Add SAAS_DOCS_JSX_SOURCE — sidebar nav + article content with breadcrumbs, tip box, code block
7. Add SAAS_CONTACT_JSX_SOURCE — info cards + contact form with glassmorphism card
8. Re-export SAAS_HEADER_JSX_SOURCE, SAAS_FOOTER_JSX_SOURCE, SAAS_JSX_SOURCE from page.tsx
<!-- END_CODER_ONLY -->

## Acceptance criteria

- All 5 new JSX source constants are exported from jsx-sources.ts
- Each constant is a valid JSX template literal string parseable by JsxStringRenderer
- All styles use --wp--preset--color-- CSS custom properties (no hardcoded colors)
- Existing header/footer/front-page sources are re-exported for single import point

## Verification

- Import and render each constant in JsxStringRenderer — verify no parse errors
- Visual inspection: each page matches the SaaSFlow design language
