# ADR 0001: Architecture Decisions for AI Block Theme Generator

**Status:** Accepted
**Date:** 2026-03-16

## Context

Building a web app that generates complete WordPress Block Themes from natural language descriptions. The system must produce valid, installable themes that pass WordPress theme requirements while giving users meaningful control over design output.

---

## Decision 1: Multi-step generation over monolithic

**Decision:** Break theme generation into focused sequential steps (theme.json, templates, template parts, patterns) rather than generating the entire theme in a single prompt.

**Why:** A single prompt asking for a complete theme (theme.json + 6 templates + 3 parts + N patterns) produces unreliable output. Models lose coherence over long structured outputs — blocks get malformed, JSON nesting breaks, and design tokens declared in theme.json don't match what templates reference. Sequential steps let us validate each artifact before proceeding, retry individual failures without regenerating everything, and keep each prompt focused on one concern.

**Trade-off:** More API calls means longer total generation time (~2 min on Gemini free tier vs. ~30 sec for a single call). Worth it — a theme that fails to activate in WordPress is worthless regardless of how fast it was generated.

## Decision 2: Gemini 2.5 Flash as default provider

**Decision:** Use Gemini 2.5 Flash as the default AI model.

**Why:** Free tier (10 RPM, 250K TPM) makes the project zero-cost to evaluate. 1M token context window handles large system prompts with theme.json specs and block markup examples. Native structured JSON output mode (`responseMimeType: "application/json"` + `responseJsonSchema`) eliminates the need to parse JSON from markdown code blocks. Quality is sufficient for block markup generation — the structured output is more important than raw reasoning ability here.

**Trade-off:** Rate limits on free tier force sequential generation with delays, resulting in ~2 min generation time. Paid tier or alternative providers (Claude, GPT-4) would be faster but add cost for evaluators.

## Decision 3: Provider-agnostic AI interface

**Decision:** Define a clean `AIProvider` interface with `generateJSON<T>()` and `generateText()` methods. Swap providers via the `AI_PROVIDER` environment variable.

```typescript
interface AIProvider {
  generateJSON<T>(prompt, systemPrompt, schema, options?): Promise<T>;
  generateText(prompt, systemPrompt, options?): Promise<string>;
}
```

**Why:** Reviewers should be able to use whatever API key they have. The interface is minimal — two methods, both taking a prompt and system prompt. Zod schema goes in, typed result comes out. No provider-specific concepts leak into the generation pipeline.

## Decision 4: Prompt enrichment over raw passthrough

**Decision:** Don't pass user prompts directly to the model. Run them through an enrichment pipeline that detects archetypes, fills design gaps, and injects flavor seeds.

**Why:** Vague prompts ("a clean modern website") produce generic, interchangeable themes — the AI slop problem. Research showed that theme quality depends more on prompt quality than model quality. The enrichment engine:
- **Detects archetypes** — "bakery site with online ordering" maps to the Restaurant archetype, which carries section lists, color palettes, typography pairings, and layout conventions
- **Fills gaps** — if the user didn't mention typography, the engine picks a font pairing that fits the archetype instead of letting the model default to Inter/system-ui
- **Injects flavor seeds** — randomized color harmony type + typography pairing + layout density so that running the same prompt twice produces different but coherent themes
- **Applies negative constraints** — "no Inter, no card grids, no generic hero" prevents common AI defaults

**Design exploration:** Named design styles (editorial, neobrutalist, cinematic) produce more distinctive results than adjective-based prompts ("bold and modern"). The archetype system encodes this: each archetype carries specific design conventions rather than abstract descriptors.

## Decision 5: WordPress theme.json v3

**Decision:** Target theme.json version 3 (WordPress 6.6+).

**Why:** Latest spec with explicit preset control via `settings.typography.defaultFontSizes: false` and `settings.spacing.defaultSpacingSizes: false`. This prevents WordPress from injecting its own presets that conflict with the generated theme's design system. Full FSE (Full Site Editing) support means templates and patterns are first-class — no PHP template hierarchy fallbacks needed.

## Decision 6: Block markup validation pipeline

**Decision:** Validate all generated block markup through a regex-based validator before including it in the theme.

**Why:** AI models generate plausible-looking but structurally invalid block markup. Common failures:
- Mismatched opening/closing delimiters (`<!-- wp:group -->` without `<!-- /wp:group -->`)
- Invalid JSON in block attributes
- Non-existent block names
- `wp:html` (Custom HTML) blocks that bypass the block editor's safety model

The validator checks delimiter pairs via a stack-based parser, validates block names against a core whitelist (80+ blocks), parses JSON attributes, and hard-rejects `wp:html` blocks. Errors trigger regeneration of the affected step.

**Why regex and not AST:** A proper block parser that builds an AST would be more robust (see "What I'd Do Next"), but regex-based delimiter matching catches the most common failure modes with minimal complexity. The validator has been reliable enough for the core block vocabulary we support.

## Decision 7: WordPress Playground for preview

**Decision:** Use WordPress Playground (WebAssembly) for in-browser theme preview instead of a server-side WordPress instance.

**Why:** Zero infrastructure. A full WordPress instance runs in the browser via WebAssembly — no Docker, no PHP, no MySQL. The Blueprint API accepts a theme ZIP blob and installs it into the Playground instance. Users see their generated theme running on real WordPress without any server-side setup.

**Trade-off:** Playground has limited plugin support and slower initial load than a native WordPress instance. Acceptable for theme preview — we don't need WooCommerce or other plugins running.

## Decision 8: Automated design audit

**Decision:** Score generated themes on measurable design quality criteria (0-100).

**Checks:**
- WCAG AA contrast ratios between text/background color pairs
- Typography scale coherence (consistent ratio between heading levels)
- 8px grid adherence for spacing values
- Color harmony analysis (complementary, analogous, triadic relationships)

**Why:** Users can't easily assess whether a generated theme meets accessibility standards or follows sound design principles. A numeric score with itemized results gives confidence in output quality and highlights specific issues to address. This also serves as a feedback signal for prompt enrichment — low-scoring outputs indicate the enrichment pipeline needs adjustment.

---

## Alternatives Considered

| Alternative | Why rejected |
|---|---|
| **Monolithic single-prompt generation** | Unreliable for large structured output. Models lose coherence, produce malformed JSON, and can't self-correct mid-generation. |
| **Local models (Ollama/llama.cpp)** | Free and private, but block markup quality is insufficient. Open models struggle with the precise delimiter syntax WordPress requires. |
| **Classic PHP theme generation** | Simpler format but doesn't leverage FSE capabilities. Block themes are the present and future of WordPress theming. |
| **Template-based approach (no AI)** | Predictable output but no real customization. Users could just download an existing theme from the directory. The whole point is bespoke generation. |

## Security Considerations

- **Prompt injection** — User input is used in AI prompts. Input is sanitized before inclusion in system prompts to prevent injection of conflicting instructions.
- **No executable PHP** — Generated themes contain no arbitrary PHP. The only PHP is pattern file headers (`<?php /** * Title: ... */`) and a minimal `functions.php` for theme setup. No `eval()`, no file operations, no database access.
- **Theme slug sanitization** — Slugs are restricted to alphanumeric characters and hyphens. No path traversal, no special characters.
- **No server-side storage** — Generated themes exist only in the browser session. Nothing is written to disk or stored in a database.

---

## What I'd Do Next

Priority improvements given more time, ordered by impact:

1. **Formal block validation AST** — Replace the regex-based delimiter parser with a proper block parser that builds an abstract syntax tree. This would catch nesting constraint violations (e.g., `wp:button` outside `wp:buttons`), validate attribute schemas per block type against the block.json spec, and enable structural transformations like auto-wrapping orphaned blocks in groups.

2. **WordPress Pattern Directory integration** — Pull popular patterns from the WordPress Pattern Directory as few-shot examples for generation. Real-world patterns teach the model idiomatic block markup better than system prompt instructions. Could also seed the prompt enrichment pipeline with patterns that match the detected archetype.

3. **Section-level iteration** — After initial generation, let users regenerate individual sections (just the header, just the hero pattern) without rebuilding the entire theme. This requires tracking which design tokens each section depends on and preserving them across regeneration. Dramatically improves the edit loop — currently a single bad section means regenerating everything.

4. **Theme screenshot generation** — Use Puppeteer or Playwright to capture a screenshot of the theme running in WordPress Playground. This screenshot goes into the theme's `screenshot.png` for the WordPress admin appearance panel. Currently the theme installs without a preview image.

5. **Caching layer** — Cache generated themes by a hash of the enriched prompt (post-enrichment, so flavor seeds are included in the hash). Same enriched prompt = instant ZIP download instead of 2-minute generation. Invalidate on model version changes.

6. **WooCommerce template support** — Add product, cart, checkout, and shop archive templates for the ecommerce archetype. Requires adding WooCommerce blocks to the whitelist and teaching the generation pipeline about WooCommerce-specific template hierarchy.

7. **CI-based theme testing** — Automated pipeline that installs generated themes on a real WordPress instance (via wp-env), runs the Theme Check plugin, validates activation without errors, and checks for PHP notices/warnings. Catches issues that block markup validation alone misses.

8. **Custom typography upload** — Let users upload font files or select from the Google Fonts catalog, with automatic `@font-face` generation in theme.json `fontFamilies`. Currently limited to fonts the model knows about.

9. **Multi-language support** — Generate themes with RTL stylesheet support and translation-ready strings wrapped in `__()` / `_e()` functions. Requires adding a `languages/` directory to the ZIP with a `.pot` template file.

10. **Block pattern library** — Surface generated patterns in WordPress's Pattern Library interface so users can mix and match patterns from different generated themes. Requires a pattern registry API and persistent storage.
