# Prompt enrichment engine

Story: story-853
Agent: architect

## Context

The core UX differentiator: take sparse user input ("photography portfolio, dark mode") and expand it into a rich, detailed design brief that produces impressive, non-generic themes. Research shows named design styles, specific color values, and font choices dramatically outperform vague descriptors.

Three subsystems:
1. **Archetype detection** — classify user input into a site type with known design conventions
2. **Gap analysis** — identify missing design dimensions and suggest smart defaults
3. **Flavor seeds** — inject controlled randomness so two identical inputs produce different themes

## What changes

| File | Change |
|---|---|
| src/lib/prompts/archetypes.ts | Define 8 theme archetypes (portfolio, saas, blog, restaurant, ecommerce, agency, magazine, creative) with structural patterns, section inventories, design conventions, and example enrichments |
| src/lib/prompts/enrichment.ts | Implement `enrichPrompt(userInput: string): EnrichedPrompt` — detects archetype, analyzes gaps across 7 dimensions (audience, aesthetic, palette, typography, sections, interactions, reference), applies flavor seeds, injects negative constraints |
| src/lib/prompts/templates.ts | 8-10 starter prompt templates users can pick from. Each is a complete design brief for a specific archetype+style combination (e.g., "Editorial Photography Portfolio", "Neobrutalist SaaS Landing Page") |

## Contract

- `ThemeArchetype` type — `{ id: string, name: string, sections: string[], designConventions: object, structuralHints: object, colorSuggestions: object[], typographySuggestions: object[] }`
- `EnrichedPrompt` type — `{ original: string, archetype: ThemeArchetype, gaps: GapAnalysis, enrichedDescription: string, flavorSeed: FlavorSeed, negativeConstraints: string[] }`
- `GapAnalysis` type — `{ audience: Gap, aesthetic: Gap, palette: Gap, typography: Gap, sections: Gap, interactions: Gap, reference: Gap }` where `Gap = { specified: boolean, suggestion: string }`
- `FlavorSeed` type — `{ colorHarmony: 'analogous' | 'complementary' | 'triadic' | 'split-complementary', typoPairingStyle: 'serif-sans' | 'display-mono' | 'geometric-humanist', layoutDensity: 'airy' | 'balanced' | 'compact' }`
- `enrichPrompt(userInput: string): EnrichedPrompt` — main entry point
- `detectArchetype(input: string): ThemeArchetype` — keyword/pattern matching
- `analyzeGaps(input: string, archetype: ThemeArchetype): GapAnalysis` — check 7 dimensions
- `generateFlavorSeed(): FlavorSeed` — random selection from valid combinations
- `STARTER_TEMPLATES: StarterTemplate[]` — exportable array of pre-built prompts

## Tasks

1. Define the 8 archetype data structures in `archetypes.ts`:
   - Each archetype includes: display name, keywords for detection, required sections (e.g., portfolio needs hero+gallery+about+contact), design conventions (e.g., portfolio = image-first, minimal nav), color suggestions (3-4 palette options per archetype), typography suggestions (2-3 font pairings per archetype)
   - Keyword matching: "photo", "portfolio", "gallery" → portfolio; "saas", "startup", "pricing", "app" → saas; etc.
2. Implement gap analysis in `enrichment.ts`:
   - Parse user input for presence of: audience mentions, named aesthetic/mood, color references (hex, color names, "dark"/"light"), typography mentions (font names, "serif"/"sans"), section/page mentions, interaction mentions, reference mentions ("like X", "similar to")
   - For each gap: provide a smart default based on the detected archetype + flavor seed
3. Implement flavor seed generation:
   - Random selection from: 4 color harmony types, 3 typography pairing styles, 3 layout densities
   - Seed ensures two identical inputs can produce different themes
4. Create starter templates in `templates.ts`:
   - Minimum 8 templates covering different archetype+style combinations
   - Each template is a complete design brief following the 5-part structure: brand context, visual direction, structure, functional specs, negative constraints
   - Named design styles: editorial, cinematic, neobrutalist, minimal, glassmorphism, luxurious, playful, organic
5. Implement `enrichPrompt()` orchestrator:
   - Detect archetype → analyze gaps → generate flavor seed → compose enriched description
   - Enriched description is the actual text sent to Gemini: combines user intent + archetype structure + gap-filled defaults + flavor variation + negative constraints ("no Custom HTML blocks, no Inter font, no generic card grids")

## Acceptance criteria

- Given "photography blog dark mode", when `enrichPrompt` is called, then archetype is "portfolio" or "blog", gaps for palette and typography are filled, and enrichedDescription is >200 chars
- Given "SaaS landing page with pricing", when `detectArchetype` is called, then archetype is "saas"
- Given the same input twice, when `generateFlavorSeed` is called each time, then at least one dimension differs (probabilistic — may need multiple runs)
- Given no user input about fonts, when gap analysis runs, then a typography suggestion is provided based on archetype
- STARTER_TEMPLATES has at least 8 entries, each with a non-empty enrichedDescription

## Verification

- Unit test: archetype detection for all 8 types with sample inputs
- Unit test: gap analysis correctly identifies missing dimensions
- Unit test: starter templates are all structurally valid
