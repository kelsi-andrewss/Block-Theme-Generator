# Theme.json generation with light and dark mode

Story: story-854
Agent: architect

## Context

Generate a complete, valid WordPress theme.json v3 from the enriched prompt. This is the design foundation — colors, typography, spacing, layout — that all templates and patterns reference. Also generates a dark mode style variation at `styles/dark.json`.

Uses Gemini's structured JSON output mode with a Zod schema to guarantee valid JSON. The schema enforces WordPress theme.json v3 structure.

Key WordPress theme.json v3 facts (from research):
- Version must be `3` (requires WP 6.6+)
- In v3, theme fontSizes/spacingSizes merge with defaults (set `defaultFontSizes: false` to override)
- Top-level keys: version, settings, styles, customTemplates, templateParts, patterns
- Settings subsections: color (palette, gradients), typography (fontSizes, fontFamilies), spacing, layout (contentSize, wideSize)
- Styles: background, color, typography, spacing — can be scoped per-block under `blocks`

## What changes

| File | Change |
|---|---|
| src/lib/schemas/theme-json.ts | Zod schema for WordPress theme.json v3 — validates structure, enforces required fields, types color palette entries, typography entries, layout dimensions |
| src/lib/generators/theme-json.ts | `generateThemeJson(enrichedPrompt: EnrichedPrompt, provider: AIProvider): Promise<ThemeJsonResult>` — builds focused prompt, calls provider.generateJSON with schema, also generates dark mode variant |

## Contract

- `ThemeJsonSchema` — Zod schema for theme.json v3 validation
- `DarkModeSchema` — Zod schema for style variation (subset of theme.json: just styles)
- `ThemeJsonResult` type — `{ themeJson: ThemeJson, darkMode: DarkModeStyles }`
- `generateThemeJson(enrichedPrompt: EnrichedPrompt, provider: AIProvider): Promise<ThemeJsonResult>`
- `buildThemeJsonPrompt(enrichedPrompt: EnrichedPrompt): string` — constructs the Gemini prompt
- `buildDarkModePrompt(themeJson: ThemeJson, enrichedPrompt: EnrichedPrompt): string`

## Tasks

1. Define Zod schema for theme.json v3 in `theme-json.ts`:
   - `version: z.literal(3)`
   - `settings.color.palette: z.array(z.object({ slug, color, name }))`
   - `settings.typography.fontFamilies: z.array(z.object({ fontFamily, name, slug, fontFace? }))`
   - `settings.typography.fontSizes: z.array(z.object({ size, slug, name, fluid? }))`
   - `settings.spacing.spacingSizes: z.array(z.object({ size, slug, name }))`
   - `settings.layout: z.object({ contentSize, wideSize })`
   - `settings.appearanceTools: z.literal(true)`
   - `styles.color: z.object({ background, text })`
   - `styles.typography: z.object({ fontFamily, fontSize, lineHeight })`
   - `styles.blocks` — per-block style overrides
   - `templateParts: z.array(z.object({ area, name, title }))`
   - `customTemplates: z.array(z.object({ name, title, postTypes })).optional()`
2. Implement `generateThemeJson()`:
   - Build prompt that includes: enriched description, archetype design conventions, color palette from flavor seed, typography scale, layout preferences
   - Call `provider.generateJSON(prompt, systemPrompt, ThemeJsonSchema, { temperature: 0.7 })`
   - System prompt includes: WordPress theme.json v3 spec summary, example theme.json from TT25, instruction to use `defaultFontSizes: false` and `defaultSpacingSizes: false`
   - Validate result with Zod schema
3. Implement dark mode variant generation:
   - Takes the generated theme.json as input context
   - Generates a style variation that inverts/adjusts colors for dark mode
   - Output goes to `styles/dark.json` — subset of theme.json (just `version` + `styles` + `settings.color`)
   - Call `provider.generateJSON` with DarkModeSchema
4. Include `templateParts` declarations for header (area: "header") and footer (area: "footer") in every generated theme.json

## Acceptance criteria

- Given an enriched prompt for a photography portfolio, when `generateThemeJson` is called, then the result contains a valid theme.json with version 3, at least 4 palette colors, at least 3 font sizes, and contentSize/wideSize defined
- Given a generated theme.json, when dark mode variant is generated, then it has different background/text colors that invert the light mode scheme
- Given any output, when validated against ThemeJsonSchema, then Zod parse succeeds without errors
- templateParts array always includes header and footer entries

## Verification

- Unit test: ThemeJsonSchema validates a known-good theme.json (from TT25)
- Unit test: ThemeJsonSchema rejects theme.json with missing required fields
- Integration test: with real API key, generate theme.json and validate
