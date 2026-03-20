# Replace Tailwind SaaS preview with inline-styles single source of truth

Story: (pending)
Agent: quick-fixer

## Context

Two separate representations of the SaaS design (Tailwind page.tsx for preview, hand-written JSX string for transpiler) have drifted apart causing broken WP output. Unify into one inline-styles React component that serves both preview and transpiler.

## What changes

| File | Change |
|---|---|
| `src/app/templates/saas/page.tsx` | REWRITE: Convert from Tailwind classes to inline style={{}} objects. Keep exact same HTML structure (all 6 sections with centering wrapper divs). Export `SAAS_JSX_SOURCE` string containing the JSX body for the transpiler. Use WP preset color vars. |
| `src/lib/generators/saas-front-page-jsx.ts` | DELETE this file entirely |
| `src/lib/generators/saas-template.ts` | Update: import `SAAS_JSX_SOURCE` from `../../app/templates/saas/page` instead of `generateSaasFrontPageJsx` from deleted file. Pass to `transpileJSXToBlocks(SAAS_JSX_SOURCE)`. |
| `src/app/app/page.tsx` | Update import if it references the deleted file (currently imports SAAS_FRONT_PAGE_HTML from saas-template.ts — this stays, just verify) |

## Tasks

1. Read the CURRENT `src/app/templates/saas/page.tsx` (Tailwind version) — this is the structural source of truth. Count every wrapper div, every section, every className.
2. Read `src/lib/generators/saas-front-page-jsx.ts` to understand the WP color vars and SVG patterns used.
3. Read `src/lib/data/saas-features.ts` to understand feature data interpolation.
4. Rewrite `page.tsx`:
   - Convert every Tailwind class to its inline style equivalent using style={{}} objects
   - Use dark-theme colors directly (the WP theme is dark): backgrounds use #09090b, #18181b, rgba(39,39,42,...); text uses #fff, #a1a1aa, etc.
   - Use WP preset vars for brand colors: `var(--wp--preset--color--primary)`, `var(--wp--preset--color--secondary)`, `var(--wp--preset--color--contrast)`, `var(--wp--preset--color--base)`
   - Use `color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)` for muted text
   - Keep ALL wrapper divs: every section must have `<div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 2rem" }}>` centering wrapper
   - Pricing cards: `display: "flex", flexDirection: "column"`, buttons `display: "block", width: "100%"`, feature list wrapper `flex: "1"`
   - Replace `<Link>` with `<a>` tags
   - Remove all: className, hover:, dark:, md:, responsive prefixes, transition-*, animate-*, group-hover
   - Import SAAS_FEATURES for the features section
   - Export the React component as default
   - Also export `SAAS_JSX_SOURCE: string` — a template literal containing the SAME JSX structure but as a string (for the transpiler). This string must use the same inline styles, same nesting, same content. For dynamic features: interpolate SAAS_FEATURES into the string.
5. Delete `src/lib/generators/saas-front-page-jsx.ts`
6. Update `src/lib/generators/saas-template.ts`: change import to `import { SAAS_JSX_SOURCE } from '../../app/templates/saas/page'` and `export const SAAS_FRONT_PAGE_HTML = transpileJSXToBlocks(SAAS_JSX_SOURCE)`
7. Verify: `npx tsc --noEmit` (filter pre-existing errors in GeneratorForm/NativeControls)
8. Verify: `npx tsx -e "import { SAAS_FRONT_PAGE_HTML } from './src/lib/generators/saas-template'; console.log(SAAS_FRONT_PAGE_HTML.substring(0,300));"` — must print valid WP block markup

## Acceptance criteria

- `page.tsx` renders in browser with inline styles (no Tailwind classes anywhere)
- `SAAS_JSX_SOURCE` string produces valid WP block markup when run through transpiler
- `saas-front-page-jsx.ts` no longer exists
- All 6 sections present: hero, logos, features, testimonials, pricing, CTA
- Every section has a centering wrapper div with max-width and margin:0 auto
- TypeScript compiles

## Verification

- `npx tsc --noEmit` passes (ignoring pre-existing GeneratorForm/NativeControls errors)
- Sanity check transpiler output
- `npm run build` succeeds
