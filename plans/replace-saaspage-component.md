# Replace SaaSPage native React component with JSX string renderer

Story: story-931
Agent: architect

## Context

`src/app/templates/saas/page.tsx` contains two things: (1) JSX source strings (lines 1-308) that the transpiler consumes to produce WP block markup, and (2) a 300-line native React component `SaaSPage` (lines 310-614) that duplicates every section (hero, logos, features, testimonials, pricing, CTA) using `--color-*` app variables for the live preview. Any content change must be made in both places, and they drift. This story deletes the native component and replaces it with a thin wrapper that renders `SAAS_JSX_SOURCE` through `JsxStringRenderer`, making the JSX source string the single source of truth for both the transpiler and the preview.

## What changes

| File | Change |
|---|---|
| `src/app/templates/saas/page.tsx` | Delete the entire `SaaSPage` component (lines 310-614). Replace with a ~15-line component that: (a) sets the WP-to-app CSS variable bridge on a wrapper div, (b) renders `<JsxStringRenderer jsxString={SAAS_JSX_SOURCE} />` inside it. Add `'use client'` directive at top of file (JsxStringRenderer uses `dangerouslySetInnerHTML` which requires client rendering). Add import for `JsxStringRenderer`. |

<!-- CODER_ONLY -->
## Read-only context
- `src/components/JsxStringRenderer.tsx` -- interface: `<JsxStringRenderer jsxString={string} />`; created by story-930
- `src/lib/data/saas-features.ts` -- the `SAAS_FEATURES` array; already imported at line 1; consumed by `buildFeatureCardsJsx()` at line 22 which interpolates into `SAAS_JSX_SOURCE` at line 178
- `src/lib/generators/saas-template.ts` -- imports the named exports `SAAS_JSX_SOURCE`, `SAAS_HEADER_JSX_SOURCE`, `SAAS_FOOTER_JSX_SOURCE`; must not break
- `src/app/templates/saas/layout.tsx` -- wraps the page with TemplateProvider, NativeIframeController, outer div with bg/text vars, nav, main, footer; the new SaaSPage renders inside the `{children}` slot of `<main>`
- `plans/unified-header-footer.md` -- sibling story uses same JsxStringRenderer pattern for header/footer in layout.tsx
<!-- END_CODER_ONLY -->

## Contract

```typescript
// page.tsx default export — unchanged signature, new implementation
export default function SaaSPage(): JSX.Element

// Named exports — UNCHANGED, not touched by this story
export const SAAS_HEADER_JSX_SOURCE: string
export const SAAS_FOOTER_JSX_SOURCE: string
export const SAAS_JSX_SOURCE: string
```

The CSS variable bridge applied on the wrapper div:

```typescript
const WP_VAR_BRIDGE: Record<string, string> = {
  '--wp--preset--color--primary': 'var(--color-primary-500)',
  '--wp--preset--color--secondary': 'var(--color-secondary-500)',
  '--wp--preset--color--contrast': 'var(--color-text)',
  '--wp--preset--color--base': 'var(--color-bg)',
};
```

These are the only four WP preset color tokens used in `SAAS_JSX_SOURCE`, `SAAS_HEADER_JSX_SOURCE`, and `SAAS_FOOTER_JSX_SOURCE`. The bridge makes them resolve to the app's design-token CSS variables so the preview renders correctly.

<!-- CODER_ONLY -->
## Tasks

1. Add `'use client';` as the first line of the file (JsxStringRenderer manipulates DOM via dangerouslySetInnerHTML; the page needs client rendering).
2. Add import: `import JsxStringRenderer from '@/components/JsxStringRenderer';`
3. Extract the var bridge into a module-level constant `WP_VAR_BRIDGE` (the four mappings from lines 317-320).
4. Delete the entire `SaaSPage` function body (lines 310-614) and replace with:
   ```tsx
   export default function SaaSPage() {
     return (
       <div style={{
         display: 'flex',
         flexDirection: 'column',
         minHeight: '100vh',
         // @ts-expect-error CSS custom properties
         ...WP_VAR_BRIDGE,
         backgroundColor: 'var(--color-bg)',
         color: 'var(--color-text)',
       }}>
         <JsxStringRenderer jsxString={SAAS_JSX_SOURCE} />
       </div>
     );
   }
   ```
5. Do NOT modify anything above line 309. The JSX source strings, COLOR_MAP, buildFeatureCardsJsx, esc(), SVG constants, and featuresJsx variable all stay untouched -- they are consumed by the transpiler pipeline and by the template string interpolation.
6. Verify that the existing `SAAS_FEATURES` import (line 1) and `buildFeatureCardsJsx()` call (line 39) still work. They feed `${featuresJsx}` at line 178 in SAAS_JSX_SOURCE. No changes needed -- the data flow is: `SAAS_FEATURES` -> `buildFeatureCardsJsx()` -> `featuresJsx` -> template literal interpolation into `SAAS_JSX_SOURCE` -> `JsxStringRenderer` renders it.
7. Run `npx tsc --noEmit` to verify no type errors (the `@ts-expect-error` comment suppresses the CSS custom property spread).
<!-- END_CODER_ONLY -->

## Acceptance criteria

- Given the SaaS template preview loads at `/templates/saas`, when the page renders, then the body content (hero through CTA) is rendered by `JsxStringRenderer` consuming `SAAS_JSX_SOURCE` -- not by hand-written React markup.
- Given `page.tsx` is read, then no native React markup exists below the JSX source string exports -- only the thin `SaaSPage` wrapper with `JsxStringRenderer`.
- Given the preview renders, then all WP preset color tokens (`--wp--preset--color--primary`, `--secondary`, `--contrast`, `--base`) resolve correctly via the CSS variable bridge, producing the same visual output as the previous native component.
- Given `saas-template.ts` imports `SAAS_JSX_SOURCE`, `SAAS_HEADER_JSX_SOURCE`, `SAAS_FOOTER_JSX_SOURCE`, then those imports still work and the transpiler pipeline is unaffected.
- Given `SAAS_FEATURES` data changes, then both the preview (via JsxStringRenderer) and the WP block output (via transpiler) reflect the change from the single `SAAS_JSX_SOURCE` source.

## Verification

- `npx tsc --noEmit` passes with no errors
- `npm run dev` and navigate to `/templates/saas` -- page renders hero, logo bar, features, testimonials, pricing, and CTA sections
- Visual diff: screenshot before/after should be near-identical (minor rendering differences from JsxStringRenderer's HTML parsing vs native React are acceptable)
- `grep -c 'SAAS_FEATURES.map' src/app/templates/saas/page.tsx` returns 0 (the native feature loop is gone)
- The file's line count drops from ~614 to ~320 (source strings + thin component)

<!-- TESTER_ONLY -->
<!-- END_TESTER_ONLY -->
