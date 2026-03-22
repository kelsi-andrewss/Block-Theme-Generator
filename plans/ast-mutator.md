# Recast-based deterministic AST mutation

Story: story-1078
Agent: architect

## Context

The iteration loop currently sends full JSX back through Gemini and receives full JSX back. This is fragile — Gemini can silently reformat or drop code on every round-trip, and there's no way to apply a surgical change to a single element.

Recast solves this by parsing JSX into a Babel AST while preserving the original source positions, then reprinting *only modified* nodes. Unchanged nodes are reprinted verbatim from the original source (`recast.print(recast.parse(source)).code === source`). This makes AST mutation deterministic: a `set_style` edit on one element cannot corrupt an unrelated sibling.

This file is the bridge between story-1077 (structured edit intents from Gemini) and story-1079 (IDB persistence). Gemini emits edit intents, `applyAstMutation` applies them to the JSX source, the result is persisted.

## What changes

| File | Change |
|---|---|
| `package.json` | Add `recast` dependency |
| `src/lib/transpiler/ast-mutator.ts` | New file — `applyAstMutation` + `EditIntent` types |
| `src/lib/transpiler/ast-mutator.test.ts` | Unit tests for all mutation scenarios |

<!-- CODER_ONLY -->
## Read-only context

- `src/lib/transpiler/jsx-to-blocks.ts` — existing Babel parse pattern (`parse(source, { sourceType: 'module', plugins: ['jsx'] })`), `evaluateJSXValue`, `extractProps` helpers. The mutator should use recast's `parse` with the same Babel options for consistency.
- `src/lib/transpiler/style-map.ts` — `camelToKebab`-style utility conventions. Style property names in JSX are camelCase; the mutator works with camelCase keys.
- `src/lib/schemas/theme-json.ts` — Zod schema conventions for this project. EditIntent schema should follow the same `z.object().passthrough()` pattern if a Zod schema is needed, but plain TypeScript types are fine since these intents are already validated at the API boundary (story-1077).
- `vitest.config.ts` — node environment, globals enabled, `@/` alias resolves to `./src`.
- `tsconfig.json` — strict mode, ES2022 target, `@/*` path alias.
<!-- END_CODER_ONLY -->

## Contract

```typescript
/**
 * Mutation types that can target a single JSX element by data-uid.
 * Schema aligned with story-1077's API response shape (discriminant = `kind`).
 */
export type EditIntent =
  | { kind: 'style'; uid: string; styles: Record<string, string> }
  | { kind: 'text'; uid: string; textContent: string }
  | { kind: 'attribute'; uid: string; attributes: Record<string, string | null> }
  | { kind: 'html'; uid: string; html: string };

/**
 * Apply structured edit intents to a JSX source string.
 * Returns the modified source with only the targeted nodes changed;
 * all other formatting, comments, and whitespace are preserved verbatim.
 *
 * Throws if the source fails to parse.
 * Silently skips intents whose uid is not found (Gemini may reference
 * elements that were removed in a prior edit within the same batch).
 */
export function applyAstMutation(source: string, intents: EditIntent[]): string;
```

**Implementation notes:**
- Parse with `recast.parse(source, { parser: { parse(src) { return babelParse(src, { sourceType: 'module', plugins: ['jsx'], tokens: true }); } } })`. Recast requires tokens for exact reprinting.
- Traverse with `@babel/traverse` (already a dependency) to find JSXOpeningElement nodes with a `data-uid` attribute matching the intent's `uid`.
- For `style`: locate the `style` JSXAttribute. If it's `style={{ ... }}`, iterate the `styles` record and find or insert each property in the ObjectExpression. If no `style` attribute exists, create one with all properties. Empty string value means remove the property.
- For `attribute`: iterate the `attributes` record. For each key, find or create the JSXAttribute on the opening element. `null` value means remove the attribute. Handle string vs expression values.
- For `text`: replace all JSXText/JSXExpressionContainer children of the element with a single JSXText node containing the `textContent`.
- For `html`: parse the replacement HTML/JSX string into an AST fragment with recast, then replace the entire JSXElement node.
- Print with `recast.print(ast).code`.

<!-- CODER_ONLY -->
## Tasks

1. Add `recast` to dependencies: `npm install recast`.
2. Create `src/lib/transpiler/ast-mutator.ts`:
   - Export the `EditIntent` discriminated union type.
   - Implement `applyAstMutation(source, intents)`:
     a. Parse source with recast using Babel parser options (match `jsx-to-blocks.ts` config + `tokens: true`).
     b. Build a `Map<string, NodePath>` by traversing all JSXOpeningElement nodes, extracting `data-uid` attribute values.
     c. Iterate intents. For each, look up the target NodePath from the map. Skip if not found.
     d. Dispatch to handler by `intent.kind`:
        - `handleStyle(path, styles)` — iterate `Record<string, string>`, mutate or create style ObjectProperties
        - `handleAttribute(path, attributes)` — iterate record, mutate or create JSXAttributes (null = remove)
        - `handleText(path, textContent)` — replace children
        - `handleHtml(path, html)` — parse fragment, replace node
     e. Return `recast.print(ast).code`.
3. Create `src/lib/transpiler/ast-mutator.test.ts` with vitest:
   - Test identity: `applyAstMutation(source, [])` returns source unchanged.
   - Test `set_style` on element with existing style.
   - Test `set_style` on element with no style attribute (creates one).
   - Test `set_attribute` updating an existing attribute.
   - Test `set_attribute` adding a new attribute.
   - Test `set_text` replacing text content.
   - Test `set_text` on element with mixed children (inline elements + text).
   - Test `replace_element` swapping an entire element.
   - Test that unmatched UIDs are silently skipped.
   - Test that non-targeted siblings are reprinted verbatim (byte-for-byte).
   - Test multiple intents applied in sequence to the same source.
<!-- END_CODER_ONLY -->

## Acceptance criteria

- Given a JSX string and an empty intents array, when `applyAstMutation` is called, then the returned string is identical to the input (recast identity guarantee).
- Given a JSX element with `data-uid="abc"` and `style={{ color: 'red' }}`, when a `set_style` intent targets uid `"abc"` with `property: 'color'` and `value: 'blue'`, then the returned JSX contains `color: 'blue'` on that element and all other source text is unchanged.
- Given a JSX element with `data-uid="abc"` and no `style` attribute, when a `set_style` intent targets uid `"abc"`, then a `style={{ property: value }}` attribute is created on that element.
- Given a `set_attribute` intent for attribute `className` with value `"new-class"`, when applied to an element with `data-uid` matching the intent, then the `className` attribute is updated (or added) to `"new-class"`.
- Given a `set_text` intent with `text: "Hello"`, when applied to a `<p data-uid="x">Old text</p>`, then the result is `<p data-uid="x">Hello</p>`.
- Given a `replace_element` intent with valid JSX markup, when applied, then the entire target element is replaced and surrounding elements are untouched.
- Given an intent targeting a `uid` that does not exist in the source, when `applyAstMutation` is called, then the intent is silently skipped and the source is returned unchanged.
- Given multiple intents targeting different UIDs in a single call, when applied, then all targeted elements are mutated and non-targeted elements are preserved verbatim.

## Verification

- `npm run test -- src/lib/transpiler/ast-mutator.test.ts` — all tests pass.
- `npx tsc --noEmit` — no type errors in the new file.
- Manual spot-check: parse a multi-element JSX string, apply one `set_style` intent, diff the input and output to confirm only the targeted property changed.

<!-- TESTER_ONLY -->
## Test file

`src/lib/transpiler/ast-mutator.test.ts`

### Setup

```typescript
import { describe, it, expect } from 'vitest';
import { applyAstMutation } from './ast-mutator';
```

No mocks needed — this is pure string-in, string-out.

### Test scenarios

1. **Identity (no-op)**: `applyAstMutation(source, [])` === `source`
2. **set_style — update existing property**: Input has `style={{ color: 'red' }}`, intent sets `color` to `'blue'`. Assert output contains `color: 'blue'` (not `'red'`).
3. **set_style — add property to existing style**: Input has `style={{ color: 'red' }}`, intent sets `fontSize` to `'16px'`. Assert output contains both properties.
4. **set_style — create style attribute**: Input has no `style`. Intent adds `backgroundColor: '#fff'`. Assert `style={{ backgroundColor: '#fff' }}` appears.
5. **set_attribute — update existing**: `className="old"` becomes `className="new"`.
6. **set_attribute — add new**: Element has no `aria-label`, intent adds one.
7. **set_attribute — boolean value**: Intent sets `disabled` to `true`. Assert `disabled={true}` or `disabled`.
8. **set_text — simple**: `<p data-uid="x">old</p>` becomes `<p data-uid="x">new</p>`.
9. **replace_element**: Entire `<div data-uid="x">...</div>` is replaced with `<section>...</section>`.
10. **Unknown UID skipped**: Intent targets `uid: "nonexistent"`, source returned unchanged.
11. **Sibling preservation**: Two sibling elements, intent targets one. Assert the other is byte-for-byte identical via substring check.
12. **Multiple intents**: Two intents targeting different UIDs. Both mutations visible in output.
<!-- END_TESTER_ONLY -->
