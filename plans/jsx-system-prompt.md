# Update Gemini system prompt for JSX generation

Story: story-908
Agent: quick-fixer

## Context

Update the AI system prompts to instruct Gemini to generate static JSX with WP-specific components instead of raw WordPress block markup. Include JSX examples for each WP component.

Files: src/lib/constants/block-markup.ts, src/lib/prompts/enrichment.ts

## What changes

| File | Change |
|---|---|
| `src/lib/constants/block-markup.ts` | Replace block markup syntax rules with JSX syntax rules. Replace block markup examples with JSX component examples. Update TEMPLATE_SYSTEM_PROMPT to instruct JSX output. |
| `src/lib/prompts/enrichment.ts` | Update enrichment prompts to request JSX layouts using WP components. Update example prompts. |

<!-- CODER_ONLY -->
## Tasks

1. Update `TEMPLATE_SYSTEM_PROMPT` in block-markup.ts to instruct Gemini to generate static JSX instead of block markup. Include rules: no useState/useEffect, no event handlers, static layout only, use WP-specific components for dynamic blocks.
2. Replace `BLOCK_MARKUP_EXAMPLES` with JSX equivalents showing how to use each WP component (TemplatePart, Query, PostTemplate, Navigation, etc.) and standard HTML elements with inline styles.
3. Update the negative constraint in enrichment.ts from "Do NOT use wp:html blocks" to "Generate static JSX only — no React hooks, no event handlers, no dynamic logic."
4. Add JSX component reference to the system prompt listing all available WP components with their props.
<!-- END_CODER_ONLY -->

## Acceptance criteria

- Given the updated system prompt, when Gemini generates a template, then the output is valid JSX (parseable by @babel/parser)
- Given the prompt examples, when a developer reads them, then each WP component usage is demonstrated with correct props
- Given the negative constraints, then no React runtime features (hooks, handlers) are mentioned as valid

## Verification

- Read the updated prompts and confirm JSX syntax rules are clear
- Verify all WP components from wp-components.ts are documented in the prompt
