# Add AI retry logic with negative constraints on validation failure

Story: story-950
Agent: architect

## Context

The generation route calls Gemini for theme.json, templates, and parts but has no retry logic. If Gemini returns malformed block markup, the error is collected and reported but never retried. ADR 0001 promised retry capability. Add a retry wrapper that passes validation errors back as negative constraints.

## What changes

| File | Change |
|---|---|
| `src/app/api/generate/route.ts` | Add a `retryWithConstraints()` helper that wraps AI generation calls. On validation failure, retry up to 2 more times, passing the validation errors as negative constraints in the prompt. Apply to `generateTemplates`, `generateParts`, and `generatePatterns` calls (lines 97-111). Do NOT retry `generateLightThemeJson` or `generateDarkMode` — these use Zod schema validation which catches structural issues, not markup issues. |

<!-- CODER_ONLY -->
## Read-only context

- `src/lib/validation/block-validator.ts` — validateBlockMarkup interface
- `src/lib/generators/templates.ts` — generateTemplates signature
- `src/lib/generators/parts.ts` — generateParts signature

## Tasks

1. Add a `retryWithConstraints` async helper at the top of the file:
   ```
   async function retryWithConstraints<T>(
     fn: (negativeConstraints?: string[]) => Promise<T>,
     validate: (result: T) => string[],
     maxRetries: number = 2
   ): Promise<{ result: T; errors: string[] }>
   ```
   On each iteration: call fn, validate result, if errors and retries remaining, pass errors as negativeConstraints to next call. Return final result + any remaining errors.

2. Wrap the `generateTemplates` call (line 97) with retryWithConstraints. The validate function runs `validateBlockMarkup` on each template and collects errors.

3. Wrap the `generateParts` call (line 102) similarly.

4. Wrap the `generatePatterns` call (line 107) similarly.

5. Update the SSE detail messages to indicate retry attempts: "Generating templates (retry 1/2)..." etc.
<!-- END_CODER_ONLY -->

## Contract

- `retryWithConstraints<T>(fn, validate, maxRetries?) -> Promise<{ result: T, errors: string[] }>` — Generic retry wrapper that feeds validation errors back as negative constraints

## Acceptance criteria

- Given Gemini returns invalid block markup on first attempt, when validation fails, then the route retries with errors as negative constraints
- Given max retries are exhausted, then the route proceeds with the best result and reports remaining errors
- Given Gemini returns valid markup on first attempt, then no retries occur

## Verification

- Build passes
- Generation stream still works end-to-end
- SSE events reflect retry attempts when they occur

<!-- TESTER_ONLY -->
<!-- END_TESTER_ONLY -->
