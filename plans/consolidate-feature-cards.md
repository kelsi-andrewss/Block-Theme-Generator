# Consolidate feature card rendering into single data source and builder

Story: story-933
Agent: architect

## Context

`saas-features.ts` stores every feature icon twice: `iconSvg` (camelCase React-style) and `wpIconSvg` (kebab-case HTML/WP-style). The SVG path data is identical -- only attribute casing differs. The canonical format is **kebab-case** (WP-style) because: (a) the transpiler and JSX source strings already use kebab-case, (b) custom-css.ts needs kebab-case for CSS data URIs, (c) `dangerouslySetInnerHTML` in page.tsx renders raw HTML where kebab-case is native. A single `icon` field replaces both.

## What changes

| File | Change |
|---|---|
| `src/lib/data/saas-features.ts` | Replace `iconSvg` and `wpIconSvg` fields with single `icon` field containing the kebab-case SVG path markup. |
| `src/app/templates/saas/page.tsx` | Update `buildFeatureCardsJsx()` (line 25) to read `feature.icon` instead of `feature.wpIconSvg`. Update React preview (line 410) to read `feature.icon` instead of `feature.iconSvg` -- `dangerouslySetInnerHTML` renders raw HTML so kebab-case attributes work. |
| `src/lib/generators/saas-template.ts` | No changes needed -- it does not reference feature icon fields directly (it transpiles the JSX source string which already has icons interpolated by page.tsx). |

<!-- CODER_ONLY -->
## Read-only context
- `src/lib/generators/custom-css.ts` -- reads `feature.wpIconSvg` at line 18; will be updated to `feature.icon` by story-934, do NOT touch here
- `src/lib/generators/saas-template.ts` -- confirm it has no direct feature icon references (it doesn't)
<!-- END_CODER_ONLY -->

## Contract

```typescript
// src/lib/data/saas-features.ts
interface SaasFeature {
  title: string;
  description: string;
  icon: string;       // kebab-case SVG path markup, e.g. `<path stroke-linecap="round" ...>`
  colorType: "primary" | "secondary" | "accent";
}

export const SAAS_FEATURES: SaasFeature[];
```

<!-- CODER_ONLY -->
## Tasks

1. **saas-features.ts**: For each of the 6 feature objects, delete both `iconSvg` and `wpIconSvg` fields. Add a single `icon` field containing the kebab-case SVG path (the value that was in `wpIconSvg`).

2. **page.tsx line 25** (`buildFeatureCardsJsx`): Change `feature.wpIconSvg` to `feature.icon`.

3. **page.tsx line 410** (React preview): Change `feature.iconSvg` to `feature.icon`.

4. **saas-template.ts**: Verify no changes needed. It imports `SAAS_JSX_SOURCE` (which is built by page.tsx) and transpiles it. It never reads feature icon fields directly.

5. **Do NOT touch** `custom-css.ts` -- story-934 handles updating `feature.wpIconSvg` -> `feature.icon` there.

6. Run `npx tsc --noEmit` to confirm no type errors. The only expected breakage is in `custom-css.ts` line 18 (`feature.wpIconSvg` no longer exists) -- that is expected and resolved by story-934.
<!-- END_CODER_ONLY -->

## Acceptance criteria

- Given saas-features.ts is read, then each feature object has exactly three fields: `title`, `description`, `icon`, `colorType` -- no `iconSvg` or `wpIconSvg` fields exist.
- Given `icon` field values are inspected, then they contain kebab-case SVG attributes (`stroke-linecap`, `stroke-width`) not camelCase.
- Given `buildFeatureCardsJsx()` in page.tsx is called, then it reads `feature.icon` and the output is unchanged (same SVG paths, same kebab-case attributes).
- Given the React preview in page.tsx renders, then `dangerouslySetInnerHTML={{ __html: feature.icon }}` produces valid SVG (kebab-case is valid HTML).
- Given saas-template.ts is read, then it is unmodified (no feature icon references to update).

## Verification

- `grep -r "iconSvg\|wpIconSvg" src/lib/data/saas-features.ts` returns no results.
- `grep "feature\.icon" src/app/templates/saas/page.tsx` shows exactly 2 hits (line ~25 and ~410).
- `npx tsc --noEmit 2>&1 | grep -v custom-css` returns clean (custom-css.ts breakage is expected, resolved by story-934).
- Visual: Next.js dev server shows feature icons rendering identically in the SaaS template preview.

<!-- TESTER_ONLY -->
<!-- END_TESTER_ONLY -->
