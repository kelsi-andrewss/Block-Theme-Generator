# Template and part generation

Story: story-855
Agent: architect

## Context

Generate WordPress block markup for template files (index.html, single.html, page.html, archive.html, 404.html, search.html, front-page.html) and template parts (header.html, footer.html). Each gets its own focused Gemini API call with the theme.json for color/font context and block markup reference examples.

Critical constraint: NO `wp:html` (Custom HTML) blocks. All content must use native WordPress block syntax.

Key block markup rules (from research):
- Opening: `<!-- wp:blockname {"attr":"val"} -->`, Closing: `<!-- /wp:blockname -->`
- Self-closing (dynamic): `<!-- wp:blockname /-->`
- Core blocks use `wp:` prefix (no namespace): wp:paragraph, wp:heading, wp:group, etc.
- JSON attributes in opening comment must be valid JSON
- Template parts referenced via: `<!-- wp:template-part {"slug":"header","tagName":"header"} /-->`
- Query Loop: `<!-- wp:query {"query":{"perPage":10,"inherit":true}} -->`

## What changes

| File | Change |
|---|---|
| src/lib/generators/templates.ts | `generateTemplates(enrichedPrompt, themeJson, provider): Promise<Map<string, string>>` — generates all template files, one API call per template |
| src/lib/generators/parts.ts | `generateParts(enrichedPrompt, themeJson, provider): Promise<Map<string, string>>` — generates header.html and footer.html |
| src/lib/constants/block-markup.ts | Reference constants: CORE_BLOCK_NAMES whitelist, example block markup snippets for system prompts, per-template structural guides |

## Contract

- `CORE_BLOCK_NAMES: string[]` — whitelist of valid core block names (group, paragraph, heading, image, cover, columns, column, query, post-template, post-title, post-content, post-featured-image, post-excerpt, post-date, post-author, post-terms, navigation, page-list, site-title, site-logo, site-tagline, template-part, spacer, separator, buttons, button, search, list, list-item, quote, code, video, audio, row, stack)
- `BLOCK_MARKUP_EXAMPLES: Record<string, string>` — correct markup examples for each common block
- `TEMPLATE_STRUCTURES: Record<string, TemplateStructure>` — per-archetype structural guides for each template type
- `generateTemplates(enrichedPrompt: EnrichedPrompt, themeJson: ThemeJson, provider: AIProvider): Promise<Map<string, string>>` — returns filename → markup content
- `generateParts(enrichedPrompt: EnrichedPrompt, themeJson: ThemeJson, provider: AIProvider): Promise<Map<string, string>>` — returns filename → markup content
- `buildTemplatePrompt(templateName: string, enrichedPrompt: EnrichedPrompt, themeJson: ThemeJson): { prompt: string, systemPrompt: string }`

## Tasks

1. Define block markup constants in `block-markup.ts`:
   - `CORE_BLOCK_NAMES`: complete whitelist of all core blocks used in themes
   - `BLOCK_MARKUP_EXAMPLES`: correct examples for key blocks — group with constrained layout, columns, cover with background, query loop with post-template, navigation, template-part reference, buttons, spacer
   - `TEMPLATE_STRUCTURES`: per-template structural guides (e.g., index.html needs header part → query loop → footer part; single.html needs header → post-title → post-featured-image → post-content → footer)
2. Implement `generateTemplates()`:
   - Templates to generate: index.html, single.html, page.html, archive.html, 404.html, search.html, front-page.html
   - Each template gets its own API call via `provider.generateText()`
   - System prompt includes: block markup rules, CORE_BLOCK_NAMES whitelist, relevant BLOCK_MARKUP_EXAMPLES, "You MUST NOT use wp:html blocks"
   - User prompt includes: enriched description, theme.json color/font context, archetype structural hints for this specific template
   - Temperature: 0.7 for creative templates (front-page), 0.5 for structural templates (index, archive)
3. Implement `generateParts()`:
   - Parts: header.html (site-title/logo, navigation), footer.html (site info, copyright)
   - System prompt same as templates + specific part guidance
   - Header must include: wp:site-title or wp:site-logo, wp:navigation
   - Footer must include: wp:paragraph with copyright, optional wp:navigation for footer links
4. Each generated template must start with `<!-- wp:template-part {"slug":"header","tagName":"header"} /-->` and end with `<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->` (except header.html and footer.html themselves)

## Acceptance criteria

- Given an enriched prompt and theme.json, when `generateTemplates` is called, then it returns Map with at least 7 entries (index, single, page, archive, 404, search, front-page)
- Given any generated template content, when scanned for "wp:html", then zero matches are found
- Given any generated template (except parts), when checked, then it starts with a header template-part reference and ends with a footer template-part reference
- Given the header.html part, when checked, then it contains wp:site-title or wp:site-logo and wp:navigation
- All block names in generated markup appear in CORE_BLOCK_NAMES

## Verification

- Unit test: CORE_BLOCK_NAMES contains all expected blocks
- Unit test: BLOCK_MARKUP_EXAMPLES are syntactically valid (matching open/close comments)
- Integration test: generate templates with real API and validate against block-validator
