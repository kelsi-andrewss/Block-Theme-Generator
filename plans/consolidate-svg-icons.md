# Consolidate SVG icon representations into single canonical source

Story: story-934
Agent: quick-fixer

## Context

custom-css.ts currently reads `wpIconSvg` from saas-features.ts to build CSS data URIs. After story-933 consolidates the feature data to a single `icon` field (using WP-attribute-style SVG paths), this file needs to consume that canonical field instead. The quote-mark and check-mark SVGs hardcoded in custom-css.ts are standalone — they stay in this file since they're CSS-only concerns not shared elsewhere.

## What changes

| File | Change |
|---|---|
| `src/lib/generators/custom-css.ts` | Change `feature.wpIconSvg` references to `feature.icon` (the consolidated canonical field from story-933). No other changes — the SVG encoding and CSS mask logic stays identical. |

<!-- CODER_ONLY -->
## Tasks

1. Update the `featureIconRules` map callback (line 18) to read `feature.icon` instead of `feature.wpIconSvg`.
2. Verify the `buildSvgDataUri` function still works with the canonical SVG path format (it should — the paths are identical, just the field name changed).
3. No changes needed for quoteMarkSvg or checkMarkSvg — these are CSS-only concerns.
<!-- END_CODER_ONLY -->

## Acceptance criteria

- Given custom-css.ts is read, then no references to `wpIconSvg` exist
- Given generateSaasCustomCss() is called, then the generated CSS is byte-identical to previous output (same SVG paths, just sourced from `icon` field)

## Verification

- Build passes with no type errors
- Generated CSS output unchanged

<!-- TESTER_ONLY -->
<!-- END_TESTER_ONLY -->
