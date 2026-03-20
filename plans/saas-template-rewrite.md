# Rewrite saas-template.ts — core blocks with inline styles + SAAS_FEATURES

Story: story-898
Agent: architect

## Context

The current `SAAS_FRONT_PAGE_HTML` is a static template literal containing 10 `wp:html` blocks. These are opaque to the WordPress block editor and cannot receive Global Styles. The rewrite converts every `wp:html` block to core blocks (`wp:group`, `wp:heading`, `wp:paragraph`, `wp:columns`, `wp:column`, `wp:buttons`, `wp:button`, `wp:list`) while keeping all visual CSS as inline `style` attributes on HTML elements. WordPress renders HTML between block comments verbatim, so inline styles produce pixel-identical output. The Features section additionally becomes dynamic, iterating over the `SAAS_FEATURES` array.

## What changes

| File | Change |
|---|---|
| `src/lib/generators/saas-template.ts` | Import `SAAS_FEATURES` from `../data/saas-features.ts`. Convert `SAAS_FRONT_PAGE_HTML` from a plain string to a function-built template literal. Replace all 10 `wp:html` blocks with equivalent core block markup. Dynamically generate the Features grid from `SAAS_FEATURES`. |

<!-- CODER_ONLY -->
## Read-only context
- `src/lib/data/saas-features.ts` — feature data array with `title`, `description`, `wpIconSvg`, and `colorType` fields
- `presearch/.research-wp-blueprint-theme-gen-research.json` — research confirming inline styles on core block HTML render verbatim; `wp:html` is unnecessary

## Three-layer approach (critical)

WordPress block templates preserve HTML between block comments as-is. The conversion strategy:

1. **Core block comments** for structure — `wp:group`, `wp:heading`, `wp:paragraph`, `wp:columns`, `wp:column`, `wp:buttons`, `wp:button`, `wp:list`
2. **Inline `style` attributes** on HTML elements for all visual styling — identical CSS properties to the current `wp:html` version
3. **`className` only** for effects requiring external CSS (pseudo-elements `::before`/`::after`, `mask-image`, `-webkit-background-clip`, CSS grid layouts). These are handled by a separate `custom-css.ts` file.

Example pattern:
```
OLD: <!-- wp:html --><div style="position:absolute;...">...</div><!-- /wp:html -->
NEW: <!-- wp:group {"className":"saas-glow saas-glow--primary"} --><div class="wp-block-group saas-glow saas-glow--primary" style="position:absolute;top:50%;left:50%;..."></div><!-- /wp:group -->
```

## Color mapping for features

The `SAAS_FEATURES` array uses `colorType` values: `"primary"`, `"secondary"`, `"accent"`. The current template hardcodes different accent colors per feature (orange, purple, pink, blue). The rewrite must define a color map that resolves `colorType` to both icon background and icon foreground colors:

- `"primary"` → `background: color-mix(in srgb, var(--wp--preset--color--primary) 15%, transparent)`, `color: var(--wp--preset--color--primary)`
- `"secondary"` → `background: color-mix(in srgb, var(--wp--preset--color--secondary) 15%, transparent)`, `color: var(--wp--preset--color--secondary)`
- `"accent"` → `background: color-mix(in srgb, var(--wp--preset--color--primary) 10%, var(--wp--preset--color--secondary) 5%)`, `color: var(--wp--preset--color--secondary)` (or choose a single token — the key constraint is: no hardcoded hex colors; use only theme tokens so color switching works)

The old template used hardcoded hex values (`#ea580c`, `#9333ea`, `#db2777`, `#2563eb`) for accent features. These break when the user changes the color palette. Map all three `colorType` values to `--wp--preset--color--*` tokens.
<!-- END_CODER_ONLY -->

## Contract

- `SAAS_FRONT_PAGE_HTML: string` — exported template literal, zero `wp:html` blocks, all inline styles preserved on HTML elements
- The export signature does not change — still `export const SAAS_FRONT_PAGE_HTML`

<!-- CODER_ONLY -->
## Tasks

1. **Import SAAS_FEATURES** — Add `import { SAAS_FEATURES } from '../data/saas-features';` at the top of the file.

2. **Define a color resolver** — Create a local `const COLOR_MAP` or inline helper that maps `colorType` (`"primary"` | `"secondary"` | `"accent"`) to `{ iconBg: string, iconColor: string }` using only `var(--wp--preset--color--*)` tokens. No hardcoded hex values.

3. **Hero glow backgrounds** (lines 8-11) — Replace `wp:html` with two `wp:group` blocks. Each gets `className` for any external CSS needs and all positioning/filter/opacity as inline styles:
   - Primary glow: `<!-- wp:group {"className":"saas-glow saas-glow--primary"} --><div class="wp-block-group saas-glow saas-glow--primary" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:800px;height:800px;background-color:var(--wp--preset--color--primary);opacity:0.15;filter:blur(120px);border-radius:50%;pointer-events:none;z-index:0"></div><!-- /wp:group -->`
   - Secondary glow: same pattern, `top:0;right:0` positioning, secondary color.

4. **'Introducing SaaSFlow 2.0' pill** (lines 16-21) — Replace `wp:html` with `wp:group` containing `wp:paragraph`. The outer `wp:group` gets `className: "saas-badge"` for the `::before` pseudo-element (the green dot). All layout styles (inline-flex, gap, padding, border-radius, border, backdrop-filter, background-color) stay as inline `style` on the `<div>`. The dot `<span>` is part of the inner HTML of the `wp:paragraph`. The badge text `<span>` is also inside the paragraph.

5. **Mock UI Preview** (lines 43-54) — Replace `wp:html` with nested `wp:group` blocks:
   - Outer group: margin-top, max-width, position:relative
   - Window frame group: border-radius, border, background, backdrop-filter, box-shadow, overflow
   - Title bar group (`className: "saas-browser-bar"`): height, border-bottom, display:flex, align-items, padding, gap, background. The three dots need `className` for pseudo-element rendering OR can be three nested `wp:group` blocks with inline styles (border-radius:50%, width/height:12px, background-color). Prefer inline — three small `wp:group` blocks for the dots.
   - Image group: `wp:image` or `wp:group` with background-image inline style, aspect-ratio, etc.

6. **Logos section** (lines 66-74) — Replace `wp:html` with a `wp:group` using `className: "saas-logos-grid"` for the flex layout (or inline the flex styles: `display:flex;flex-wrap:wrap;justify-content:center;gap:4rem;opacity:0.5;filter:grayscale(100%)`). Each logo is a nested `wp:group` with inline flex styles. The number badge inside each logo is another nested `wp:group` with inline styles.

7. **Features grid** (lines 96-147) — This is the dynamic section. Replace the single `wp:html` block with:
   - Outer `wp:group` with `className: "saas-features-grid"` for `display:grid;grid-template-columns:repeat(auto-fit, minmax(300px, 1fr))` (CSS grid needs className for the external stylesheet since `grid-template-columns` with `repeat(auto-fit, ...)` is complex).
   - Use `${SAAS_FEATURES.map((feature, i) => { ... }).join('\n')}` to generate each feature card.
   - Each card is a `wp:group` with all card styles inline (padding, border-radius, border, background, box-shadow).
   - Icon container: nested `wp:group` with `className: "saas-feature-icon"` for mask-image rendering, plus inline styles for dimensions, border-radius, margin, colors from the color map.
   - SVG icon: rendered inline using `feature.wpIconSvg` inside the icon container's HTML.
   - Title: `wp:heading` level 3 with inline font-size, font-weight, margin.
   - Description: `wp:paragraph` with inline color, font-size, line-height.

8. **Testimonials section** (lines 157-206) — Three `wp:html` blocks to convert:
   - **Background glow** (line 158): Same pattern as task 3 — `wp:group` with `className` and inline styles.
   - **Quote block** (lines 169-181): Convert to `wp:group` blocks. The quote SVG stays as inline HTML within a `wp:group`. The quote text becomes a `wp:paragraph`. The author info becomes a `wp:group` with flex layout containing an image `wp:group` (background-image inline) and a text `wp:group` with `wp:heading` level 4 + `wp:paragraph`.
   - **Stats grid** (lines 187-206): Outer `wp:group` with `className: "saas-stats-grid"` for the 2-column CSS grid. Each stat card is a `wp:group` with inline styles (background, backdrop-filter, padding, border-radius, border). The stat value is a `wp:heading` or `wp:paragraph` with inline font-size/weight/color. The label is a `wp:paragraph`. The offset cards (translateY) use inline `transform`.

9. **Pricing section** (lines 225-289) — Two `wp:html` blocks:
   - **Toggle** (lines 225-230): Replace with `wp:group` containing `wp:buttons`. The toggle container is a `wp:group` with inline-flex, padding, background, border-radius, border. Each option is a `wp:button` with appropriate inline styles. The "Annually -20%" uses a nested `<span>` inside the button text.
   - **Pricing cards** (lines 234-289): Outer `wp:group` with `className: "saas-pricing-grid"` for CSS grid layout. Each plan card is a `wp:group` with all inline styles. Inside each card:
     - Plan name: `wp:heading` level 3
     - Description: `wp:paragraph`
     - Price: `wp:group` containing a `wp:paragraph` with `<span>` elements for price and period
     - CTA: `wp:buttons` with a `wp:button`
     - Feature list: `wp:list` with inline `list-style:none` and check SVGs inside `<li>` elements
     - "Most Popular" badge on Pro card: `wp:group` with absolute positioning inline styles

10. **Assemble and export** — Build `SAAS_FRONT_PAGE_HTML` by concatenating all sections. The template structure:
    ```
    const heroGlows = `...`;
    const heroBadge = `...`;
    const heroContent = `...`; // heading, paragraph, buttons — these are already core blocks, keep as-is
    const heroPreview = `...`;
    const logosSection = `...`;
    const featuresGrid = SAAS_FEATURES.map(...).join('\n');
    const featuresSection = `...${featuresGrid}...`;
    const testimonialsSection = `...`;
    const pricingSection = `...`;
    const ctaSection = `...`; // already core blocks, keep as-is

    export const SAAS_FRONT_PAGE_HTML = `<!-- wp:template-part ... -->
    ...all sections...
    <!-- wp:template-part ... -->`;
    ```
    Alternatively, keep it as one template literal with the `${...}` interpolation only for the features loop — whichever reads cleaner. The coder should decide on structure.
<!-- END_CODER_ONLY -->

## Acceptance criteria

- Given the exported `SAAS_FRONT_PAGE_HTML`, when searched for `wp:html`, then zero matches found
- Given the exported `SAAS_FRONT_PAGE_HTML`, when searched for `wp:group`, then at least 30 matches found (replacing ~10 `wp:html` blocks expands to many nested groups)
- Given the template, when rendered in WordPress, then inline styles on every element produce identical visual output to the current `wp:html` version — same positioning, colors, filters, transforms, spacing
- Given the Features section, when `SAAS_FEATURES` array is modified (items added/removed/reordered), then the generated HTML reflects the change without any template edits
- Given any feature card, when the color palette is changed, then the icon background and icon color update via `var(--wp--preset--color--*)` tokens — no hardcoded hex values remain in the features grid
- Given the Testimonials stats grid, when rendered, then the alternating `translateY(1.5rem)` offset is preserved on the 2nd and 4th stat cards
- Given the Pricing section Professional card, when rendered, then the "Most Popular" badge, primary border, box-shadow, and `translateY(-1rem)` lift are all present via inline styles
- Given the template, when TypeScript compilation runs, then zero type errors
- Given the file, the export signature remains `export const SAAS_FRONT_PAGE_HTML` (string type, not a function)

## Verification

1. **Zero wp:html check**: `grep -c "wp:html" src/lib/generators/saas-template.ts` should return `0`
2. **TypeScript compiles**: `npx tsc --noEmit src/lib/generators/saas-template.ts` passes
3. **Visual diff**: Load the SaaS template page in the app's iframe preview — compare against the current version. Every section (hero, logos, features, testimonials, pricing, CTA) should look identical
4. **Dynamic features**: Temporarily add a 7th item to `SAAS_FEATURES`, confirm a 7th card appears in the preview
5. **Color switching**: Change the primary/secondary colors in the app's color picker, confirm feature icons and glow backgrounds update accordingly
