# Define WP-specific JSX components

Story: story-904
Agent: architect

## Context

The JSX-to-blocks transpiler (story-905) needs a registry of WordPress block components it can recognize in JSX AST output. This file defines that registry: a `WP_COMPONENTS` map keyed by JSX component name, where each entry describes how to convert a JSX element into WordPress block markup. This is the data layer — no parsing logic, no AST walking. Pure mapping definitions consumed by `jsx-to-blocks.ts`.

Depends on: nothing (leaf dependency — no imports from other new files)
Depended on by: story-905 (`jsx-to-blocks.ts`), story-908 (system prompt references these component names)

## What changes

| File | Change |
|---|---|
| `src/lib/transpiler/wp-components.ts` | New file. Exports `WP_COMPONENTS` map, `WPComponentDef` type, and `PropMapping` type. |

## Types

```ts
/** How a JSX prop maps to a WordPress block JSON attribute */
interface PropMapping {
  /** Key in the block's JSON attributes object. Defaults to the prop name if omitted. */
  attr: string;
  /** Coerce the string prop value before writing to JSON.
   *  "number" → parseFloat, "boolean" → value === "true" or prop presence means true,
   *  "string" → no coercion (default) */
  type: "string" | "number" | "boolean";
}

interface WPComponentDef {
  /** Full WordPress block name, e.g. "core/template-part" */
  blockName: string;
  /** If true, renders as <!-- wp:blockname {attrs} /--> with no closing delimiter or inner HTML.
   *  If false, renders opening + inner blocks/content + closing. */
  selfClosing: boolean;
  /** Maps JSX prop names to block attribute entries.
   *  Key = JSX prop name, Value = PropMapping or shorthand string (attr name, type defaults to "string").
   *  Props not in this map are ignored by the transpiler. */
  propsToAttributes: Record<string, PropMapping | string>;
  /** If true, children of this JSX element are recursively transpiled as inner blocks
   *  (placed between the opening and closing block comments). */
  innerBlocksAllowed: boolean;
  /** Optional: HTML tag name to use for the wrapper element between the block comments.
   *  Most blocks don't need this — only blocks like Spacer that require a specific HTML element. */
  htmlTag?: string;
  /** Optional: static attributes always merged into the block JSON (e.g. Query's default query shape). */
  defaultAttributes?: Record<string, unknown>;
}
```

## The WP_COMPONENTS map

```ts
export const WP_COMPONENTS: ReadonlyMap<string, WPComponentDef>
```

Entries:

### TemplatePart
- blockName: `"core/template-part"`
- selfClosing: `true`
- propsToAttributes: `{ slug: "slug", tagName: "tagName" }`
- innerBlocksAllowed: `false`

### Query
- blockName: `"core/query"`
- selfClosing: `false`
- propsToAttributes:
  - `perPage` → `{ attr: "query.perPage", type: "number" }`
  - `inherit` → `{ attr: "query.inherit", type: "boolean" }`
  - `postType` → `{ attr: "query.postType", type: "string" }`
  - `order` → `{ attr: "query.order", type: "string" }`
  - `orderBy` → `{ attr: "query.orderBy", type: "string" }`
- innerBlocksAllowed: `true`
- htmlTag: `"div"`
- defaultAttributes: `{ "queryId": 0, "query": { "perPage": 10, "pages": 0, "offset": 0, "postType": "post", "order": "desc", "orderBy": "date", "inherit": true } }`

Note on nested attribute paths (`query.perPage`): the transpiler will use dot notation to deep-set into the attributes object. The `defaultAttributes` provides the base `query` shape; props override individual keys within it.

### PostTemplate
- blockName: `"core/post-template"`
- selfClosing: `false`
- propsToAttributes: `{}`
- innerBlocksAllowed: `true`

### PostTitle
- blockName: `"core/post-title"`
- selfClosing: `true`
- propsToAttributes:
  - `isLink` → `{ attr: "isLink", type: "boolean" }`
  - `level` → `{ attr: "level", type: "number" }`
- innerBlocksAllowed: `false`

### PostDate
- blockName: `"core/post-date"`
- selfClosing: `true`
- propsToAttributes: `{}`
- innerBlocksAllowed: `false`

### PostExcerpt
- blockName: `"core/post-excerpt"`
- selfClosing: `true`
- propsToAttributes: `{}`
- innerBlocksAllowed: `false`

### PostContent
- blockName: `"core/post-content"`
- selfClosing: `true`
- propsToAttributes: `{}`
- innerBlocksAllowed: `false`

### PostFeaturedImage
- blockName: `"core/post-featured-image"`
- selfClosing: `true`
- propsToAttributes:
  - `isLink` → `{ attr: "isLink", type: "boolean" }`
  - `align` → `"align"`
- innerBlocksAllowed: `false`

### Navigation
- blockName: `"core/navigation"`
- selfClosing: `true` (default — transpiler overrides to `false` if children present)
- propsToAttributes:
  - `layout` → `"layout"` (value is a JSON object: `{ type: "flex", justifyContent: "..." }`)
- innerBlocksAllowed: `true`

Navigation is a special case: it renders self-closing when it has no children (WordPress auto-populates from menus), but wraps children when NavigationLink elements are provided. The transpiler checks `children.length` to decide.

### SiteTitle
- blockName: `"core/site-title"`
- selfClosing: `true`
- propsToAttributes:
  - `level` → `{ attr: "level", type: "number" }`
- innerBlocksAllowed: `false`

### SiteLogo
- blockName: `"core/site-logo"`
- selfClosing: `true`
- propsToAttributes:
  - `width` → `{ attr: "width", type: "number" }`
- innerBlocksAllowed: `false`

### Search
- blockName: `"core/search"`
- selfClosing: `true`
- propsToAttributes:
  - `showLabel` → `{ attr: "showLabel", type: "boolean" }`
  - `buttonText` → `"buttonText"`
  - `placeholder` → `"placeholder"`
- innerBlocksAllowed: `false`

### QueryPagination
- blockName: `"core/query-pagination"`
- selfClosing: `false`
- propsToAttributes: `{}`
- innerBlocksAllowed: `true`
- htmlTag: `"div"`

### QueryNoResults
- blockName: `"core/query-no-results"`
- selfClosing: `false`
- propsToAttributes: `{}`
- innerBlocksAllowed: `true`

### Spacer
- blockName: `"core/spacer"`
- selfClosing: `false` (has an HTML element, not self-closing in WP markup)
- propsToAttributes:
  - `height` → `"height"`
- innerBlocksAllowed: `false`
- htmlTag: `"div"` (renders `<div style="height:Xpx" aria-hidden="true" class="wp-block-spacer"></div>`)

### Separator
- blockName: `"core/separator"`
- selfClosing: `false` (has `<hr>` element)
- propsToAttributes: `{}`
- innerBlocksAllowed: `false`
- htmlTag: `"hr"`

### Buttons
- blockName: `"core/buttons"`
- selfClosing: `false`
- propsToAttributes:
  - `layout` → `"layout"`
- innerBlocksAllowed: `true`
- htmlTag: `"div"`

### Button
- blockName: `"core/button"`
- selfClosing: `false`
- propsToAttributes:
  - `url` → `"url"`
  - `className` → `"className"`
  - `backgroundColor` → `"backgroundColor"`
  - `textColor` → `"textColor"`
- innerBlocksAllowed: `false`
- htmlTag: `"div"` (renders `<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="...">text</a></div>`)

Button is a special case: JSX children become the `<a>` text content, not inner blocks.

## Prop type coercion rules

The transpiler applies coercion based on `PropMapping.type`:

| type | JSX source | Block JSON output |
|---|---|---|
| `"string"` | `prop="value"` | `"value"` |
| `"number"` | `prop="10"` or `prop={10}` | `10` (via `parseFloat`) |
| `"boolean"` | `prop` (bare), `prop={true}`, `prop="true"` | `true`. `prop={false}` or `prop="false"` → `false`. |

Props with `type: "string"` that receive a JSX expression (`prop={someObject}`) pass the expression's literal value as a JSON value (for `layout` props that take object shapes). The transpiler resolves JSX object expressions to JSON.

## Design decisions

1. **`core/` prefix in blockName**: Using the full namespaced name (`core/template-part`) rather than the shorthand (`template-part`). The transpiler strips `core/` when emitting block comments (WordPress uses `wp:template-part`, not `wp:core/template-part`). The full name is stored for unambiguous lookup and potential future third-party block support.

2. **selfClosing is a default, not absolute**: Navigation demonstrates the pattern — `selfClosing: true` means "self-closing when no children." The transpiler treats `selfClosing && children.length === 0` as the actual self-closing condition. Components with `selfClosing: false` always emit open+close delimiters.

3. **No standard HTML elements in this map**: `<div>`, `<p>`, `<h1>`-`<h6>`, `<img>`, `<a>`, `<ul>`, `<ol>`, `<li>`, `<section>`, `<header>`, `<footer>`, `<nav>`, `<span>` are handled by a separate HTML-to-block mapping in the transpiler. Standard HTML elements map to `wp:group`, `wp:paragraph`, `wp:heading`, `wp:image`, etc. based on tag name. That logic lives in `jsx-to-blocks.ts`, not here.

4. **Dot-notation for nested attributes**: Query's props like `perPage` map to `query.perPage` inside the block JSON. This keeps the JSX API flat (`<Query perPage={10}>`) while producing the nested JSON WordPress expects (`{"query":{"perPage":10}}`). The transpiler implements a `deepSet` utility for this.

5. **defaultAttributes provides base shapes**: For blocks like Query where WordPress expects a full `query` object even when most fields use defaults, `defaultAttributes` provides the base. JSX props override individual fields via deep merge.

<!-- CODER_ONLY -->
## Tasks

1. Create `src/lib/transpiler/wp-components.ts`. Export the `PropMapping` and `WPComponentDef` interfaces, then build the `WP_COMPONENTS` map as a `new Map<string, WPComponentDef>()` with all 18 entries listed above.

2. For shorthand string values in `propsToAttributes` (e.g. `slug: "slug"`), the coder should normalize them to `PropMapping` at construction time or leave as strings and have the transpiler normalize at read time. Recommendation: leave as strings — keeps the definition concise. The transpiler normalizes `string` shorthands to `{ attr: value, type: "string" }` when reading.

3. Add a `getComponentDef(tagName: string): WPComponentDef | undefined` helper export — just a `WP_COMPONENTS.get(tagName)` wrapper. This gives the transpiler a single import rather than reaching into the Map directly, and is the seam for future extension (custom block plugins, etc).

4. Add a `isWPComponent(tagName: string): boolean` export — `WP_COMPONENTS.has(tagName)`. The transpiler uses this in its AST walk to branch between "WordPress block component" and "standard HTML element."

## Implementation notes

- The file has zero runtime dependencies — no imports. Pure data + types.
- The map is `ReadonlyMap` to prevent mutation after construction.
- Keep entries in the same order as the table in the story description for reviewability.
- Use `as const` or `satisfies` on object literals where it helps TypeScript infer literal types for `blockName`.
<!-- END_CODER_ONLY -->

## Acceptance criteria

- Given the exported `WP_COMPONENTS`, when iterated, then it contains exactly 18 entries matching the table in the story description
- Given `getComponentDef("Query")`, when called, then it returns a def with `blockName: "core/query"` and `innerBlocksAllowed: true`
- Given `getComponentDef("div")`, when called, then it returns `undefined` (standard HTML elements are not WP components)
- Given `isWPComponent("PostTitle")`, when called, then it returns `true`
- Given `isWPComponent("span")`, when called, then it returns `false`
- Given every entry's `propsToAttributes`, when a `type: "number"` mapping is present, then the corresponding WordPress block actually expects a numeric JSON value for that attribute
- Given every entry's `propsToAttributes`, when a `type: "boolean"` mapping is present, then the corresponding WordPress block actually expects a boolean JSON value
- Given the file, when `npx tsc --noEmit` runs, then zero type errors

## Verification

1. `npx tsc --noEmit` — passes with no errors
2. Unit test: import `WP_COMPONENTS`, verify `.size === 18`
3. Unit test: `getComponentDef("TemplatePart")` returns `{ blockName: "core/template-part", selfClosing: true, ... }`
4. Unit test: `isWPComponent("Query")` → `true`, `isWPComponent("div")` → `false`
5. Unit test: Query's `defaultAttributes.query.perPage` === `10`
