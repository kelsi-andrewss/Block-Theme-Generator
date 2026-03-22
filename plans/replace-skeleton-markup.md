# Replace WP block markup in skeleton-pages.ts with transpiled JSX content

Story: story-1041
Agent: architect

## Context

The skeleton pages (signup, pricing, contact) currently have handwritten WP block markup that's disconnected from the JSX preview. Replace with transpiled content from the same JSX sources so preview and download match.

## What changes

| File | Change |
|---|---|
| `src/lib/generators/skeleton-pages.ts` | Import SAAS_SIGNUP_HTML, SAAS_PRICING_HTML, SAAS_CONTACT_HTML, SAAS_DOCS_HTML from saas-template.ts. Replace the `content` field of saasSignup, saasPricing, saasContact skeleton pages with the transpiled HTML. Add a new saasDocs skeleton page entry if not already present. |

<!-- CODER_ONLY -->
## Read-only context

- `src/lib/generators/saas-template.ts` — transpiled HTML exports (created by story-1040)
<!-- END_CODER_ONLY -->

<!-- CODER_ONLY -->
## Tasks

1. Import SAAS_SIGNUP_HTML, SAAS_PRICING_HTML, SAAS_CONTACT_HTML, SAAS_DOCS_HTML from `./saas-template`
2. Replace saasSignup.content with SAAS_SIGNUP_HTML
3. Replace saasPricing.content with SAAS_PRICING_HTML
4. Replace saasContact.content with SAAS_CONTACT_HTML
5. Replace saasDocs.content with SAAS_DOCS_HTML (or add if missing)
<!-- END_CODER_ONLY -->

## Acceptance criteria

- Skeleton page content for signup, pricing, contact, docs uses transpiled JSX-derived blocks
- Generated WordPress theme download includes pages matching the JSX preview
- No hardcoded WP block markup remains for these 4 skeleton pages

## Verification

- Generate a SaaS theme, download ZIP, inspect page templates — content should match JSX preview
