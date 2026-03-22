# Import and transpile all new JSX sources

Story: story-1040
Agent: architect

## Context

Import the new JSX source constants from jsx-sources.ts into saas-template.ts and transpile them to WP block markup. Update templates.ts to use the transpiled 404 blocks instead of the hardcoded fallback.

## What changes

| File | Change |
|---|---|
| `src/lib/generators/saas-template.ts` | Import new JSX sources (SAAS_404_JSX_SOURCE, SAAS_SIGNUP_JSX_SOURCE, SAAS_PRICING_JSX_SOURCE, SAAS_DOCS_JSX_SOURCE, SAAS_CONTACT_JSX_SOURCE) from jsx-sources.ts. Transpile each and export as SAAS_404_HTML, SAAS_SIGNUP_HTML, SAAS_PRICING_HTML, SAAS_DOCS_HTML, SAAS_CONTACT_HTML. Also update existing imports to use jsx-sources.ts instead of page.tsx. |
| `src/lib/generators/templates.ts` | Replace hardcoded 404.html template content with SAAS_404_HTML from saas-template.ts (only for saas archetype). |

<!-- CODER_ONLY -->
## Read-only context

- `src/app/templates/saas/jsx-sources.ts` — JSX source constants (created by story-1037)
- `src/lib/transpiler/jsx-to-blocks.ts` — transpileJSXToBlocks function
<!-- END_CODER_ONLY -->

<!-- CODER_ONLY -->
## Tasks

1. In saas-template.ts: change import path from `../../app/templates/saas/page` to `../../app/templates/saas/jsx-sources`
2. Add imports for the 5 new JSX source constants
3. Add transpile calls and exports: `export const SAAS_404_HTML = transpileJSXToBlocks(SAAS_404_JSX_SOURCE)` (and same for signup, pricing, docs, contact)
4. In templates.ts: import SAAS_404_HTML from saas-template.ts
5. In templates.ts: conditionally use SAAS_404_HTML for the 404.html template when archetype is saas
<!-- END_CODER_ONLY -->

## Acceptance criteria

- All 5 new HTML constants are exported from saas-template.ts
- 404.html template uses transpiled JSX content for saas archetype
- Existing front-page/header/footer transpilation continues to work

## Verification

- Import and log each HTML constant — verify non-empty WP block markup
- Generate a saas theme and confirm 404 template in the download matches the JSX preview
