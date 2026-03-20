# Build JSX string renderer with WP-to-app var mapping bridge

Story: story-930
Agent: architect

## Context

The codebase has two parallel representations of each template page: (1) JSX source strings (e.g., `SAAS_JSX_SOURCE`, `SAAS_HEADER_JSX_SOURCE`) that use `--wp--preset--color--*` CSS vars and get transpiled to WP block markup at build/generation time, and (2) hand-written React JSX in `SaaSPage` that uses `--color-*` app-level vars for the live preview. These are maintained separately and drift. A `JsxStringRenderer` component would render the JSX source strings directly as React elements in the browser, eliminating the duplicated preview code. The WP-to-app var bridge (already proven at `page.tsx:317-320` as CSS custom property aliases on a wrapper div) makes the WP preset vars resolve correctly in the app's theming context.

## What changes

| File | Change |
|---|---|
| `src/components/JsxStringRenderer.tsx` | New client component. Accepts a `jsxString` prop, parses it into an AST using `@babel/parser` (already a project dependency, ~300KB parsed/gzipped, acceptable since this is a dev-facing preview tool not a production site), walks the AST recursively, and returns React elements. Implements the var bridge as CSS custom properties on a wrapper div. Handles JSX expression containers (`{"text"}`), inline HTML strings in expressions (via `dangerouslySetInnerHTML`), `style={{...}}` object syntax, `className`, and all standard HTML elements. WP components from `wp-components.ts` that have an `htmlTag` render as that tag; those without render as `div`. |

<!-- CODER_ONLY -->
## Read-only context
- `src/lib/transpiler/wp-components.ts` — WP component definitions with `htmlTag` fields; used to resolve custom component tags (e.g., `<Spacer>` -> `div`, `<Separator>` -> `hr`)
- `src/lib/transpiler/element-map.ts` — `isInlineTag()` for identifying inline elements; `INLINE_TAGS` set
- `src/app/templates/saas/page.tsx` — The JSX source strings (`SAAS_JSX_SOURCE`, `SAAS_HEADER_JSX_SOURCE`, `SAAS_FOOTER_JSX_SOURCE`) that this renderer will consume, plus the existing var bridge pattern at lines 317-320
- `src/components/TemplateProvider.tsx` — Exemplar for component conventions (`"use client"`, default export, `useState`/`useEffect`)
- `src/lib/transpiler/jsx-to-blocks.ts` — Existing Babel parsing of JSX strings (`parse()` call, `evaluateJSXValue()`, `extractProps()`) — reusable patterns, but this file targets WP block output not React elements, so it cannot be imported directly
<!-- END_CODER_ONLY -->

## Contract

```typescript
// src/components/JsxStringRenderer.tsx

interface JsxStringRendererProps {
  /** Raw JSX source string using WP preset vars (e.g., SAAS_JSX_SOURCE) */
  jsxString: string;
  /** Optional additional CSS custom properties to set on the wrapper */
  cssVars?: Record<string, string>;
}

/**
 * Parses a JSX source string and renders it as live React elements.
 * Sets CSS custom properties on a wrapper div to bridge WP preset
 * vars to the app's --color-* theming variables.
 */
export default function JsxStringRenderer(props: JsxStringRendererProps): React.ReactElement;
```

**Var bridge** — set these CSS custom properties on the outermost wrapper `div`:
```
--wp--preset--color--primary:   var(--color-primary-500)
--wp--preset--color--secondary: var(--color-secondary-500)
--wp--preset--color--contrast:  var(--color-text)
--wp--preset--color--base:      var(--color-bg)
```
This is a CSS-level bridge, not string replacement. `color-mix()` expressions and any other CSS functions referencing these vars resolve naturally via inheritance.

**AST-to-React mapping rules:**
1. HTML tags (`div`, `p`, `h1`, `a`, etc.) -> `React.createElement(tag, props, ...children)`
2. Tags starting with uppercase that exist in `WP_COMPONENTS` -> render as their `htmlTag` (or `div` if none)
3. Tags starting with uppercase not in `WP_COMPONENTS` -> render as `div`
4. `style={{...}}` object expressions -> parsed into `Record<string, string>` and passed as React `style` prop
5. `className` -> passed as `className` prop (React handles this natively)
6. JSX expression containers:
   - `{"plain text"}` -> text node
   - `{"<svg ...>...</svg>"}` (string containing HTML) -> render via `dangerouslySetInnerHTML` on a wrapping `span`
   - `{"<span style=\\"...\\">text</span>"}` (string containing HTML with escaped quotes) -> same, unescape then `dangerouslySetInnerHTML`
7. `${VARIABLE}` template interpolations -> already resolved before the renderer sees the string (template literals are evaluated at module load time in `page.tsx`)
8. Self-closing tags (`<br>`, `<img>`, `<hr>`) -> self-closing React elements

<!-- CODER_ONLY -->
## Tasks

1. Create `src/components/JsxStringRenderer.tsx` with `"use client"` directive.
2. Import `parse` from `@babel/parser` and `* as t` from `@babel/types`. Import `WP_COMPONENTS` from `@/lib/transpiler/wp-components`.
3. Implement a `parseJsxString(jsxString: string): t.File` function that calls `parse(jsxString, { sourceType: 'module', plugins: ['jsx'] })`. Wrap in try/catch; on error, return a fallback `<div>` with an error message.
4. Implement `astToReact(node: t.Node): React.ReactNode` recursive function:
   - `JSXElement` -> determine tag name, extract props, recurse children, return `React.createElement(resolvedTag, propsObj, ...children)`
   - `JSXFragment` -> `React.createElement(React.Fragment, null, ...children)`
   - `JSXText` -> trimmed string (skip if empty after trim)
   - `JSXExpressionContainer` with `StringLiteral` -> if the string starts with `<`, render via `dangerouslySetInnerHTML` on a `span`; otherwise render as text
   - `JSXExpressionContainer` with `TemplateLiteral` (no expressions) -> same logic as string literal
   - `JSXExpressionContainer` with `JSXEmptyExpression` -> null
   - `ObjectExpression` in a style attribute -> recursively evaluate into a plain JS object (reuse the `evaluateJSXValue` pattern from `jsx-to-blocks.ts`)
5. Implement `resolveTag(tagName: string): string` — if tag starts with uppercase, look up in `WP_COMPONENTS`; return `htmlTag ?? 'div'`. Otherwise return tag as-is.
6. Implement `extractPropsFromAST(attributes: t.JSXAttribute[]): Record<string, unknown>` — iterate attributes, handle `StringLiteral` values, `JSXExpressionContainer` values (object expressions for `style`, string/number literals for others). Handle boolean attributes (value === null means `true`).
7. In the component body: call `parseJsxString`, call `astToReact` on the root expression, wrap result in a `div` with the var bridge CSS custom properties set via `style`.
8. Memoize the parse result with `useMemo` keyed on `jsxString` to avoid re-parsing on every render.
9. Handle hydration: wrap the rendered output in a client-only guard (`useEffect` + `useState` to set `mounted = true`, render null on server) since Babel parsing is client-only and the output would differ between SSR and CSR.
<!-- END_CODER_ONLY -->

## Acceptance criteria

- Given a `jsxString` containing `SAAS_HEADER_JSX_SOURCE`, when rendered inside a page with `--color-primary-500` etc. set, then the header displays with correct theme colors resolved through the CSS var bridge.
- Given a `jsxString` containing `{"text"}` expression containers, when rendered, then the text appears as visible content.
- Given a `jsxString` containing `{"<svg ...>...</svg>"}` HTML string expressions, when rendered, then the SVG renders as visible DOM elements (via `dangerouslySetInnerHTML`).
- Given a `jsxString` containing `style={{fontSize:"1.25rem",fontWeight:"700"}}`, when rendered, then the element has those inline styles applied.
- Given a `jsxString` containing `color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)` in a style value, when rendered, then the browser resolves it correctly because `--wp--preset--color--contrast` is set on an ancestor wrapper div.
- Given an invalid/unparseable `jsxString`, when rendered, then a visible error fallback is shown instead of a crash.
- Given Next.js SSR, when the page initially loads, then no hydration mismatch occurs (component renders null on server, mounts client-only).

## Verification

- `npx tsc --noEmit` passes for the new file
- Manual: import `JsxStringRenderer` in a test page, pass `SAAS_HEADER_JSX_SOURCE` as `jsxString`, confirm the header renders identically to the hand-written version in the SaaS page
- Manual: pass `SAAS_JSX_SOURCE` (the full body), confirm all sections render with correct colors, layout, and SVG icons
- Inspect the wrapper div in DevTools and confirm `--wp--preset--color--primary` etc. are set as CSS custom properties pointing to `var(--color-primary-500)` etc.

<!-- TESTER_ONLY -->
<!-- END_TESTER_ONLY -->
