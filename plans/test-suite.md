# Tests

Story: story-861
Agent: unit-tester

## Context

Write tests covering the core logic: block markup validation, theme.json schema validation, design audit checks, ZIP packaging structure. Plus one integration test for the end-to-end generation flow. Tests run via Vitest (`npm test`).

## What changes

| File | Change |
|---|---|
| tests/validation.test.ts | Unit tests for block-validator.ts and design-audit.ts |
| tests/packer.test.ts | Unit tests for zip.ts and constants.ts (style.css, functions.php generation) |
| tests/generation.test.ts | Integration test for full generation pipeline (requires API key or mocked provider) |

## Read-only context

- `src/lib/validation/block-validator.ts` — block markup validation functions
- `src/lib/validation/design-audit.ts` — design audit functions
- `src/lib/packer/zip.ts` — ZIP packaging
- `src/lib/packer/constants.ts` — deterministic file generators
- `src/lib/schemas/theme-json.ts` — Zod schemas
- `src/lib/ai/provider.ts` — AIProvider interface (for mock)

## Tasks

1. Write `tests/validation.test.ts`:
   - Test `validateBlockMarkup`:
     - Valid markup passes (no errors)
     - Mismatched opening/closing delimiters produce error
     - `wp:html` block produces error
     - Invalid JSON in attributes produces error
     - Unknown block name produces warning
     - Self-closing blocks pass
     - Nested blocks pass
   - Test `auditThemeDesign`:
     - Perfect theme.json scores >= 90
     - White-on-white text fails contrast check
     - Body font < 16px fails typography check
     - Non-8px spacing values produce warnings
     - Score deductions are additive
   - Test `getContrastRatio`:
     - Black (#000000) on white (#ffffff) = 21:1
     - Same color = 1:1
     - Known mid-range pair matches expected ratio
2. Write `tests/packer.test.ts`:
   - Test `generateStyleCss`:
     - Contains "Theme Name:" header
     - Contains the provided theme name
     - Contains "Text Domain:" with the slug
   - Test `generateFunctionsPHP`:
     - Contains `add_theme_support('wp-block-styles')`
     - With fonts: contains `wp_enqueue_style`
     - Without fonts: minimal output
   - Test `packageTheme`:
     - ZIP contains style.css at root
     - ZIP contains templates/index.html
     - ZIP contains parts/header.html
     - ZIP contains theme.json
     - ZIP contains styles/dark.json
     - All files are inside a root directory named after theme slug
3. Write `tests/generation.test.ts`:
   - Integration test with a mock AIProvider:
     - Create a mock provider that returns predetermined JSON/text
     - Run the full pipeline: enrich → generate theme.json → templates → parts → patterns → validate → audit → package
     - Verify the output ZIP contains all expected files
     - Verify audit score is computed
     - Verify no wp:html blocks in any generated content

## Acceptance criteria

- All tests pass with `npm test`
- Block validator tests cover: valid markup, mismatched delimiters, wp:html detection, invalid JSON, unknown blocks
- Design audit tests cover: contrast ratio, typography, spacing, scoring
- Packer tests cover: style.css header, ZIP structure, directory naming
- Integration test covers: full pipeline with mock provider

## Verification

- Run `npm test` — all tests pass
- Run `npm test -- --coverage` — core validation and packer files have >80% coverage
