# Documentation

Story: story-862
Agent: quick-fixer

## Context

Three deliverables required by the project spec: README, ADR, and "What I'd Do Next". These should reflect genuine product and architectural thinking, not boilerplate.

## What changes

| File | Change |
|---|---|
| README.md | Setup instructions, architecture overview, known limitations |
| docs/adr/0001-architecture.md | Key technical decisions and tradeoffs |

## Tasks

1. Write README.md with:
   - Project title and one-line description
   - Prerequisites (Node.js 18+, Gemini API key)
   - Quick start: `npm install` → create `.env` with API key → `npm run dev`
   - Architecture overview: prompt enrichment → multi-step generation → validation → packaging → preview
   - Diagram of the generation pipeline
   - How to swap AI providers (env var)
   - Known limitations
2. Write ADR (`docs/adr/0001-architecture.md`) covering:
   - Why multi-step generation over monolithic (reliability, per-file validation, retry)
   - Why Gemini 2.5 Flash (free tier, structured output, 1M context)
   - Why theme.json v3 (latest spec, explicit preset control)
   - Why block markup validation matters (AI produces plausible but structurally invalid markup)
   - Why prompt enrichment (vague prompts → "AI slop", specificity produces quality)
   - Why WordPress Playground for preview (zero server, in-browser, Blueprint API)
   - Security: user input sanitization in theme data, no arbitrary code execution
   - Design exploration: how flavor seeds prevent identical outputs
   - Alternatives considered: monolithic prompt, local models, classic theme generation
   - Trade-offs accepted: free tier rate limits (2 min generation), limited block vocabulary
3. Add "What I'd Do Next" section in the ADR:
   - Formal block validation pipeline (parse into AST, not regex)
   - Support for custom block patterns from the WordPress Pattern Directory
   - Multi-page iteration (modify individual sections post-generation)
   - Theme screenshot generation (headless browser capture)
   - Caching layer for repeated generations
   - Support for WooCommerce templates
   - CI pipeline with automated theme activation testing on real WordPress

## Acceptance criteria

- README includes working setup instructions (npm install, env setup, npm run dev)
- README includes architecture overview with pipeline description
- ADR covers at least 5 key decisions with alternatives and tradeoffs
- "What I'd Do Next" lists at least 5 concrete improvements
- No placeholder text or TODOs in final documents

## Verification

- Read through both documents for completeness and clarity
- Verify setup instructions match actual project configuration
