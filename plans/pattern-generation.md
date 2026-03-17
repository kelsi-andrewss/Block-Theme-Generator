# Pattern generation

Story: story-856
Agent: architect

## Context

Generate 4-6 WordPress block patterns per theme based on the detected archetype. Patterns are PHP files with header metadata + block markup. They auto-register in WordPress when placed in the /patterns/ directory (since WP 6.0).

Pattern types per archetype:
- Portfolio: hero-image, gallery-grid, about-section, contact-form, testimonials
- SaaS: hero-cta, features-grid, pricing-table, testimonials, cta-banner
- Blog: hero-post, recent-posts, newsletter-signup, about-author, categories
- Restaurant: hero-banner, menu-section, about-us, gallery, reservation-cta
- Ecommerce: hero-product, featured-products, categories-grid, testimonials, newsletter
- Agency: hero-statement, services-grid, case-studies, team, contact
- Magazine: hero-featured, grid-articles, sidebar-widgets, newsletter, categories
- Creative: hero-fullscreen, portfolio-masonry, process-timeline, contact, about

## What changes

| File | Change |
|---|---|
| src/lib/generators/patterns.ts | `generatePatterns(enrichedPrompt, themeJson, provider): Promise<Map<string, string>>` — generates PHP pattern files with correct header metadata and block markup content |

## Contract

- `ARCHETYPE_PATTERNS: Record<string, PatternSpec[]>` — maps archetype ID to array of pattern specs (slug, title, categories, description)
- `PatternSpec` type — `{ slug: string, title: string, categories: string[], description: string, keywords: string[] }`
- `generatePatterns(enrichedPrompt: EnrichedPrompt, themeJson: ThemeJson, provider: AIProvider): Promise<Map<string, string>>` — returns `patterns/<slug>.php` → content
- `buildPatternPrompt(spec: PatternSpec, enrichedPrompt: EnrichedPrompt, themeJson: ThemeJson): { prompt: string, systemPrompt: string }`
- `formatPatternPHP(slug: string, spec: PatternSpec, themeSlug: string, blockMarkup: string): string` — wraps block markup in PHP file with correct header

## Tasks

1. Define `ARCHETYPE_PATTERNS` mapping in `patterns.ts`:
   - Each archetype gets 4-6 pattern specs with slug, title, categories, description, keywords
   - Slugs follow `{themeSlug}/{pattern-name}` format (e.g., `mytheme/hero-image`)
2. Implement `generatePatterns()`:
   - Get pattern specs from ARCHETYPE_PATTERNS based on detected archetype
   - For each pattern: call `provider.generateText()` with pattern-specific prompt
   - System prompt includes: block markup rules, "generate ONLY block markup, no PHP", no wp:html
   - Temperature: 0.8 (patterns are the most creative part)
   - Each call returns just the block markup content
3. Implement `formatPatternPHP()`:
   - Wraps the AI-generated block markup in the required PHP file format:
   ```php
   <?php
   /**
    * Title: {title}
    * Slug: {themeSlug}/{slug}
    * Categories: {categories}
    * Keywords: {keywords}
    * Description: {description}
    */
   ?>
   {block markup}
   ```
   - This is deterministic — no AI needed for the PHP wrapper
4. Generate a minimum of 4 and maximum of 6 patterns per theme

## Acceptance criteria

- Given a portfolio archetype, when `generatePatterns` is called, then it returns 4-6 patterns with correct PHP headers
- Given any generated pattern, when the PHP header is parsed, then Title, Slug, and Categories are present
- Given any generated pattern, when the block markup is scanned, then zero wp:html blocks are found
- Given the pattern slug, when checked, then it follows the `{themeSlug}/{pattern-name}` format

## Verification

- Unit test: formatPatternPHP produces valid PHP with correct header
- Unit test: ARCHETYPE_PATTERNS has entries for all 8 archetypes
- Integration test: generate patterns with real API, validate block markup
