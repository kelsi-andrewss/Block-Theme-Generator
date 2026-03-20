# Build JSX-to-WP block transpiler core

Story: story-903
Agent: architect

## Context

The AI generates JSX-like React markup for template previews (visible in the iframe on the SaaS template page and future templates). That JSX currently has no automated path to valid WordPress block markup — the saas-template.ts file is hand-authored block markup with inline styles. This transpiler bridges the gap: given a JSX string (the kind React renders in the preview iframe), produce the equivalent WordPress block comment markup. It does not need to handle every React feature — only the static structural subset that maps cleanly to core blocks.

The transpiler is the foundation for a pipeline where AI output (JSX) is automatically converted to a deployable WordPress block theme without hand-authoring block comments.

## What changes

| File | Change |
|---|---|
| `src/lib/transpiler/element-map.ts` | New file. Maps HTML/JSX element names to WordPress block names and their required attributes/wrapper HTML. |
| `src/lib/transpiler/style-map.ts` | New file. Converts CSS style objects (from JSX `style` props) into WordPress block JSON attributes (`style.spacing`, `style.color`, `style.typography`, `style.border`) and residual inline styles for anything unmappable. |
| `src/lib/transpiler/nesting-rules.ts` | New file. Enforces WordPress block nesting constraints — auto-wraps buttons in `wp:buttons`, list items in `wp:list`, columns in `wp:columns`. |
| `src/lib/transpiler/jsx-to-blocks.ts` | New file. Main entry point. Parses JSX string via `@babel/parser`, walks the AST recursively, applies element/style/nesting mappings, and emits complete WordPress block markup. |
| `package.json` | Add `@babel/parser` and `@babel/types` to dependencies. |

## Contract

### `transpileJSXToBlocks(jsx: string): string`

**Input**: A JSX string representing a single root element or fragment. This is static JSX — no state, hooks, or dynamic JS beyond template literal interpolation.

**Output**: A WordPress block markup string with:
- Proper `<!-- wp:blockname {"attrs"} -->` / `<!-- /wp:blockname -->` comment delimiters
- Correct inner HTML between delimiters (matching what WordPress expects)
- Block JSON attributes for styles that map to the block system
- Residual `style=""` attributes on HTML elements for CSS properties that don't map to block JSON
- Nesting rules enforced (buttons wrapped, list items wrapped, etc.)

**Errors**: Throws on unparseable JSX. Does not throw on unmapped elements — falls back to `wp:group`.

### `elementMap: Record<string, ElementMapping>`

Exported from `element-map.ts`. Each entry specifies:
- `blockName`: the WordPress block name (e.g., `"core/heading"`)
- `tagName`: the HTML tag to use in the inner HTML (e.g., `"h2"`)
- `cssClass`: the default WordPress CSS class (e.g., `"wp-block-heading"`)
- `selfClosing`: whether this is a self-closing block (e.g., `true` for `wp:separator`)
- `extractAttrs`: function to pull block JSON attributes from JSX props (e.g., heading level from the tag name)

### `convertStylesToBlockAttrs(styles: Record<string, string>): { blockAttrs: Record<string, unknown>; residualStyles: Record<string, string> }`

Exported from `style-map.ts`. Splits a JSX style object into block-JSON-mappable attributes and leftover inline styles.

### `applyNestingRules(blockName: string, parentBlockName: string | null): { wrappers: string[]; unwrappers: string[] }`

Exported from `nesting-rules.ts`. Returns any wrapper blocks that must be opened before and closed after the current block to satisfy WordPress nesting constraints.

<!-- CODER_ONLY -->
## Dependencies

Install before coding:
```bash
npm install @babel/parser @babel/types
```

`@babel/traverse` is NOT needed — we use a hand-rolled recursive walker. This avoids the heavyweight traverse dependency and gives us full control over the walk order (important for nesting rule enforcement).

## Read-only context

- `src/lib/constants/block-markup.ts` — `CORE_BLOCK_NAMES` array and `BLOCK_MARKUP_EXAMPLES` for reference on correct block comment format
- `src/lib/validation/block-validator.ts` — the validator that will check transpiler output; its regex patterns define the exact comment format we must emit
- `src/lib/generators/saas-template.ts` — real-world example of hand-authored block markup; the transpiler output for equivalent JSX should match this structure

## Tasks

### 1. Install dependencies

```bash
npm install @babel/parser @babel/types
```

Verify they appear in `package.json` dependencies (not devDependencies — these run at build time in the generator pipeline).

### 2. Implement element-map.ts

Create `src/lib/transpiler/element-map.ts`.

```typescript
export interface ElementMapping {
  blockName: string;       // e.g. "core/heading" — used in wp:heading comment
  wpName: string;          // e.g. "heading" — the short name after wp:
  tagName: string;         // the HTML tag for inner HTML
  cssClass: string;        // default WP CSS class for the block
  selfClosing: boolean;    // true for hr, spacer, separator, img (no inner content)
  extractAttrs?: (props: Record<string, unknown>, tagName: string) => Record<string, unknown>;
}
```

Mappings:

| JSX element | wpName | tagName | cssClass | selfClosing | extractAttrs |
|---|---|---|---|---|---|
| `div`, `section`, `main`, `header`, `footer`, `aside`, `article` | `group` | same as JSX element | `wp-block-group` | false | `{ tagName }` when not `div` |
| `h1`-`h6` | `heading` | same | `wp-block-heading` | false | `{ level: N }` from tag |
| `p` | `paragraph` | `p` | — | false | — |
| `img` | `image` | `img` | `wp-block-image` | true | `{ url, alt }` from props |
| `button` | `button` | (wp:button has specific inner HTML structure) | `wp-block-button` | false | special handling — see nesting rules |
| `a` with `role="button"` or parent context | `button` | same as button | `wp-block-button` | false | — |
| `ul` | `list` | `ul` | — | false | `{ ordered: false }` |
| `ol` | `list` | `ol` | — | false | `{ ordered: true }` |
| `li` | `list-item` | `li` | — | false | — |
| `hr` | `separator` | `hr` | `wp-block-separator` | true | — |
| `figure` | `image` | `figure` | `wp-block-image` | false | — |
| `nav` | `navigation` | `nav` | `wp-block-navigation` | false | — |
| `blockquote` | `quote` | `blockquote` | `wp-block-quote` | false | — |
| unknown | `group` | `div` | `wp-block-group` | false | — |

Export `getElementMapping(tagName: string, props: Record<string, unknown>): ElementMapping` that handles the `a[role=button]` case and falls back to group for unknowns.

### 3. Implement style-map.ts

Create `src/lib/transpiler/style-map.ts`.

The function `convertStylesToBlockAttrs` takes a flat `Record<string, string>` (camelCase CSS property names from JSX, e.g. `{ backgroundColor: "#fff", padding: "2rem", fontSize: "1.25rem" }`) and returns:

```typescript
{
  blockAttrs: {
    style: {
      spacing: { padding: { top: "2rem", right: "2rem", bottom: "2rem", left: "2rem" } },
      color: { background: "#fff" },
      typography: { fontSize: "1.25rem" }
    }
  },
  residualStyles: {
    // anything that didn't map — preserved as inline style=""
  }
}
```

**Mapping rules:**

| CSS property (camelCase) | Block JSON path | Notes |
|---|---|---|
| `padding` | `style.spacing.padding` | Parse shorthand into `{ top, right, bottom, left }` |
| `paddingTop/Right/Bottom/Left` | `style.spacing.padding.top` etc. | Longhand takes precedence |
| `margin` | `style.spacing.margin` | Same shorthand parsing |
| `marginTop/Right/Bottom/Left` | `style.spacing.margin.top` etc. | — |
| `backgroundColor` | `style.color.background` | If value is `var(--wp--preset--color--<slug>)`, extract slug and set `backgroundColor` preset attribute instead |
| `color` | `style.color.text` | Same preset extraction |
| `fontSize` | `style.typography.fontSize` | If value matches a WP preset pattern, use preset slug |
| `fontWeight` | `style.typography.fontWeight` | — |
| `lineHeight` | `style.typography.lineHeight` | — |
| `fontFamily` | `style.typography.fontFamily` | — |
| `letterSpacing` | `style.typography.letterSpacing` | — |
| `textTransform` | `style.typography.textTransform` | — |
| `textDecoration` | `style.typography.textDecoration` | — |
| `borderRadius` | `style.border.radius` | — |
| `borderColor` | `style.border.color` | — |
| `borderWidth` | `style.border.width` | — |
| `borderStyle` | `style.border.style` | — |
| Everything else | residualStyles | `position`, `display`, `transform`, `filter`, `opacity`, `boxShadow`, `backdropFilter`, `gap`, `flexDirection`, `alignItems`, `justifyContent`, etc. |

**Preset extraction**: When a value is `var(--wp--preset--color--<slug>)`, instead of putting it in `style.color.background`, set it as a top-level block attribute:
- `backgroundColor` → `{ backgroundColor: "<slug>" }` (not nested under `style`)
- `color` → `{ textColor: "<slug>" }` (not nested under `style`)

Export a helper `extractPresetSlug(value: string): string | null` that returns the slug if the value matches `var(--wp--preset--color--*)` or `var(--wp--preset--font-size--*)`, else null.

Also export `parseShorthandSpacing(value: string): { top: string; right: string; bottom: string; left: string }` for padding/margin shorthand.

### 4. Implement nesting-rules.ts

Create `src/lib/transpiler/nesting-rules.ts`.

```typescript
export interface NestingAction {
  // Wrapper blocks to open BEFORE the current block
  wrapBefore: WrapperBlock[];
  // Wrapper blocks to close AFTER the current block (in reverse order)
  wrapAfter: WrapperBlock[];
}

export interface WrapperBlock {
  wpName: string;
  attrs: Record<string, unknown>;
  openTag: string;   // the HTML open tag between block comments
  closeTag: string;  // the HTML close tag
}
```

Rules:

| Block | Required parent | Auto-wrap |
|---|---|---|
| `button` | `buttons` | Wrap with `<!-- wp:buttons --><div class="wp-block-buttons">` ... `</div><!-- /wp:buttons -->` |
| `list-item` | `list` | Wrap with `<!-- wp:list --><ul>` ... `</ul><!-- /wp:list -->` |
| `column` | `columns` | Wrap with `<!-- wp:columns --><div class="wp-block-columns">` ... `</div><!-- /wp:columns -->` |

Export `getNestingAction(blockWpName: string, parentWpName: string | null): NestingAction`.

The function checks if the current block requires a parent that isn't present. If the parent is already the correct wrapper, return empty arrays.

Additionally, handle the **wp:button inner HTML structure**. A `wp:button` block has specific inner HTML:
```html
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button">Button Text</a></div>
```
This is NOT a normal tag-to-tag mapping. Export a `isSpecialBlock(wpName: string): boolean` and `renderSpecialBlock(wpName: string, children: string, attrs: Record<string, unknown>, styles: string): string` for blocks that need custom inner HTML rendering.

### 5. Implement jsx-to-blocks.ts

Create `src/lib/transpiler/jsx-to-blocks.ts`.

**High-level flow:**

```
parseJSX(input) → AST
walkNode(ast.program.body[0]) → block markup string
  for each JSXElement:
    1. resolve element mapping (element-map)
    2. extract props → split into block attrs (style-map) + residual styles + other HTML attrs
    3. check nesting rules → inject wrappers if needed
    4. emit opening block comment: <!-- wp:{name} {JSON.stringify(blockAttrs)} -->
    5. emit opening HTML tag with CSS class + residual style + other attrs
    6. recurse into children
    7. emit closing HTML tag
    8. emit closing block comment: <!-- /wp:{name} -->
  for JSXText:
    - trim whitespace, emit raw text
  for JSXExpressionContainer:
    - evaluate static expressions (string literals, template literals)
    - skip dynamic expressions (emit empty string with a warning comment)
  for JSXFragment:
    - recurse into children without emitting a wrapper block
```

**Parsing:**

```typescript
import { parse } from '@babel/parser';

function parseJSX(jsx: string): AST {
  return parse(jsx, {
    sourceType: 'module',
    plugins: ['jsx'],
  });
}
```

The AST uses `@babel/types` for type checking — import `* as t from '@babel/types'` and use `t.isJSXElement()`, `t.isJSXText()`, etc.

**Prop extraction:**

For each JSXElement, iterate `node.openingElement.attributes`:
- `JSXAttribute` with `name.name === "style"` → parse the JSX expression into a `Record<string, string>`, then run through `convertStylesToBlockAttrs`
- `JSXAttribute` with `name.name === "className"` → add to the HTML tag's class attribute; also check for WP-specific class patterns (e.g., `has-text-align-center` → extract `textAlign` block attr)
- `JSXAttribute` with `name.name === "src"` (for img) → extract into block attrs as `url`
- `JSXAttribute` with `name.name === "alt"` → extract into block attrs
- `JSXAttribute` with `name.name === "href"` (for a/button) → extract into block attrs as `url`
- All other attributes → preserve as HTML attributes on the inner element

**Style prop parsing:**

The JSX `style` prop is typically `style={{ backgroundColor: 'red', padding: '2rem' }}`. In the AST this is a `JSXExpressionContainer` containing an `ObjectExpression`. Walk the ObjectExpression's properties to build the `Record<string, string>`.

**Block comment emission:**

```typescript
function emitBlockComment(wpName: string, attrs: Record<string, unknown>): string {
  const attrStr = Object.keys(attrs).length > 0 ? ` ${JSON.stringify(attrs)}` : '';
  return `<!-- wp:${wpName}${attrStr} -->`;
}

function emitBlockClose(wpName: string): string {
  return `<!-- /wp:${wpName} -->`;
}

function emitSelfClosingBlock(wpName: string, attrs: Record<string, unknown>): string {
  const attrStr = Object.keys(attrs).length > 0 ? ` ${JSON.stringify(attrs)}` : '';
  return `<!-- wp:${wpName}${attrStr} /-->`;
}
```

**Self-closing blocks**: If the element mapping says `selfClosing: true`, emit a self-closing block comment and skip children.

**className merging**: The block's default `cssClass` (from element-map) is always included. Any `className` from JSX props is appended. If the combined className contains WP-specific classes like `has-text-align-center`, extract the alignment as a block attr (`textAlign: "center"`) and still include the class in the HTML.

**Empty block attrs**: When the attrs object is empty (`{}`), omit the JSON entirely from the comment — emit `<!-- wp:paragraph -->` not `<!-- wp:paragraph {} -->`.

### 6. Handle special block structures

Some WordPress blocks have inner HTML that doesn't follow a simple tag-wrapping pattern:

**wp:button:**
```
<!-- wp:button {"attrs"} -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" style="...">Button Text</a></div>
<!-- /wp:button -->
```
The `<div>` wrapper and `<a>` inner element are required. The transpiler must detect `<button>` or `<a role="button">` in JSX and emit this structure.

**wp:image:**
```
<!-- wp:image {"url":"...","alt":"..."} -->
<figure class="wp-block-image"><img src="..." alt="..." /></figure>
<!-- /wp:image -->
```

**wp:list + wp:list-item:**
```
<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>Item text</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->
```
Each `<li>` maps to `wp:list-item` nested inside the `wp:list`.

Build a `specialBlocks` map in `nesting-rules.ts` with render functions for these cases.
<!-- END_CODER_ONLY -->

## Acceptance criteria

- Given a JSX string `<div><h1>Hello</h1><p>World</p></div>`, `transpileJSXToBlocks` returns valid block markup with `wp:group` wrapping `wp:heading` (level 1) and `wp:paragraph`
- Given JSX with inline styles `<div style={{ padding: '2rem', backgroundColor: 'var(--wp--preset--color--primary)' }}>`, the output block comment contains `{"backgroundColor":"primary","style":{"spacing":{"padding":{"top":"2rem","right":"2rem","bottom":"2rem","left":"2rem"}}}}` and the HTML div has no residual padding/backgroundColor in its `style=""` attribute
- Given a `<button>Click me</button>` JSX element, the output includes `wp:buttons` wrapping `wp:button` with the correct `<div class="wp-block-button"><a class="wp-block-button__link wp-element-button">Click me</a></div>` inner HTML
- Given a `<ul><li>A</li><li>B</li></ul>` JSX element, the output is `wp:list` wrapping two `wp:list-item` blocks
- Given `<img src="photo.jpg" alt="A photo" />`, the output is a self-closing-style `wp:image` block with `{"url":"photo.jpg","alt":"A photo"}` in the comment
- Given `<hr />`, the output is `<!-- wp:separator /-->` (self-closing)
- Given unknown element `<CustomThing>content</CustomThing>`, the output falls back to `wp:group` with a `<div>` wrapper
- Given styles that don't map to block JSON (e.g., `position: 'absolute'`, `transform: 'translateY(-1rem)'`), those styles appear in the residual `style=""` attribute on the HTML element
- Given the output of `transpileJSXToBlocks`, `validateBlockMarkup` from `block-validator.ts` returns `{ valid: true }` with zero errors
- TypeScript compiles with zero errors (`npx tsc --noEmit`)

## Verification

1. **Unit tests**: Write tests for each module — `element-map`, `style-map`, `nesting-rules`, and the main `transpileJSXToBlocks` — covering every acceptance criterion above
2. **Validator integration**: Pass transpiler output through `validateBlockMarkup` and assert zero errors
3. **Round-trip visual check**: Transpile a representative JSX snippet (similar to the hero section of saas-template), compare output to the hand-authored block markup in `saas-template.ts` — structural equivalence, not string equality
4. **TypeScript compilation**: `npx tsc --noEmit` passes with all four new files
5. **No regressions**: `npm run build` passes; existing tests pass via `npm run test`
