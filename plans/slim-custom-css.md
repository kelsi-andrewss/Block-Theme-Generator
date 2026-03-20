# Slim custom-css.ts

Story: story-899
Agent: architect

## Context

The current `custom-css.ts` is ~140 lines of CSS covering every visual property — padding, colors, borders, fonts, layout. The saas-template.ts already applies all of those via inline `style=""` attributes on blocks and `wp:html` elements. This CSS is dead weight that will fight with inline styles and Global Styles.

The rewrite strips it down to **only properties that inline styles cannot express**:
1. `::before` / `::after` pseudo-elements
2. `-webkit-background-clip: text` (gradient text effect)
3. `mask-image` / `-webkit-mask-image` (SVG icon masking)
4. `display: grid` + `grid-template-columns` with responsive `@media` breakpoints
5. Nothing else.

All selectors use `:root :where(.saas-*)` to lock specificity at 0-1-0, letting WordPress Global Styles win when users customize.

## What changes

| File | Change |
|---|---|
| `src/lib/generators/custom-css.ts` | Full rewrite — strip to ~60 lines covering only pseudo-elements, mask-image, background-clip, and grid layouts |

## Read files

| File | Why |
|---|---|
| `src/lib/data/saas-features.ts` | SVG path data for feature icon mask-image rules |

## Contract

- `generateSaasCustomCss(): string` — unchanged export signature, returns a CSS string
- `encodeSvgForDataUri(svg: string): string` — internal helper, unchanged
- `buildSvgDataUri(pathMarkup: string): string` — internal helper, unchanged

No new exports. No new dependencies. No changes to `saas-features.ts`.

## Specificity pattern

Every selector wraps in `:root :where(...)`:
```css
:root :where(.saas-gradient-span) { ... }
:root :where(.saas-check-list li)::before { ... }
```

`:root` adds existence (specificity 0-0-0 from `:where` content + 0-1-0 from `:root`... actually `:root` is a pseudo-class so it's 0-1-0). The `:where()` wrapper zeros out the interior selector. Net result: 0-1-0 for every rule, which any Global Styles `body .wp-block-*` selector (0-2-0+) beats.

## What stays (exhaustive list)

### Pseudo-elements (3 rules)

1. **`.saas-badge::before`** — green dot indicator before badge text
   ```css
   :root :where(.saas-badge)::before {
     content: '';
     display: block;
     width: 8px;
     height: 8px;
     border-radius: 50%;
     background-color: var(--wp--preset--color--primary);
   }
   ```

2. **`.saas-browser-toolbar::before`** — three macOS traffic-light dots via radial-gradient
   ```css
   :root :where(.saas-browser-toolbar)::before {
     content: '';
     display: flex;
     width: 52px;
     height: 12px;
     background: radial-gradient(circle 6px at 6px 6px, rgba(248,113,113,0.8) 5px, transparent 6px),
                 radial-gradient(circle 6px at 26px 6px, rgba(251,191,36,0.8) 5px, transparent 6px),
                 radial-gradient(circle 6px at 46px 6px, rgba(74,222,128,0.8) 5px, transparent 6px);
   }
   ```

3. **`.saas-pricing-card--popular::before`** — "Most Popular" badge ribbon
   ```css
   :root :where(.saas-pricing-card--popular)::before {
     content: 'Most Popular';
     position: absolute;
     top: -0.5rem;
     left: 50%;
     transform: translateX(-50%);
     background-color: var(--wp--preset--color--primary);
     color: var(--wp--preset--color--base);
     font-size: 0.75rem;
     font-weight: 700;
     padding: 0.25rem 0.75rem;
     border-radius: 9999px;
     text-transform: uppercase;
     letter-spacing: 0.05em;
   }
   ```

### Gradient text clipping (1 rule)

4. **`.saas-gradient-span`** — `-webkit-background-clip: text` cannot be set inline in most browsers
   ```css
   :root :where(.saas-gradient-span) {
     background: linear-gradient(to right, var(--wp--preset--color--primary), var(--wp--preset--color--secondary));
     -webkit-background-clip: text;
     -webkit-text-fill-color: transparent;
     background-clip: text;
   }
   ```

### Mask-image SVG icons (8 rules)

5. **`.saas-feature-icon::after`** — base pseudo-element for feature icons (content + dimensions)
   ```css
   :root :where(.saas-feature-icon)::after {
     content: '';
     display: block;
     width: 24px;
     height: 24px;
   }
   ```

6. **`.saas-feature-icon--{0..5}::after`** — 6 individual mask-image rules, one per feature, generated from `SAAS_FEATURES[i].wpIconSvg`
   ```css
   :root :where(.saas-feature-icon--0)::after {
     -webkit-mask-image: url("data:image/svg+xml,...");
     mask-image: url("data:image/svg+xml,...");
     -webkit-mask-size: contain;
     mask-size: contain;
     -webkit-mask-repeat: no-repeat;
     mask-repeat: no-repeat;
   }
   ```

7. **`.saas-quote-mark::before`** — quote SVG via mask-image
   ```css
   :root :where(.saas-quote-mark)::before {
     content: '';
     display: block;
     width: 100%;
     height: 100%;
     background-color: currentColor;
     -webkit-mask-image: url("data:image/svg+xml,...");
     mask-image: url("data:image/svg+xml,...");
     -webkit-mask-size: contain;
     mask-size: contain;
   }
   ```

8. **`.saas-check-list li::before`** — check mark SVG via mask-image
   ```css
   :root :where(.saas-check-list li)::before {
     content: '';
     display: block;
     width: 1.25rem;
     height: 1.25rem;
     flex-shrink: 0;
     background-color: #22c55e;
     -webkit-mask-image: url("data:image/svg+xml,...");
     mask-image: url("data:image/svg+xml,...");
     -webkit-mask-size: contain;
     mask-size: contain;
   }
   ```

9. **`.saas-pricing-card--popular .saas-check-list li::before`** — override check color for popular card
   ```css
   :root :where(.saas-pricing-card--popular .saas-check-list li)::before {
     background-color: var(--wp--preset--color--primary);
   }
   ```

### CSS Grid layouts (3 rules + 1 media query)

10. **`.saas-features-grid`**
    ```css
    :root :where(.saas-features-grid) {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }
    ```

11. **`.saas-stats-grid`**
    ```css
    :root :where(.saas-stats-grid) {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
    ```

12. **`.saas-pricing-grid`**
    ```css
    :root :where(.saas-pricing-grid) {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }
    ```

13. **Responsive breakpoint**
    ```css
    @media (max-width: 768px) {
      :root :where(.saas-features-grid),
      :root :where(.saas-pricing-grid),
      :root :where(.saas-stats-grid) {
        grid-template-columns: 1fr;
      }
    }
    ```

## What gets deleted (everything else from v1)

Every rule not listed above is removed. Specifically:
- `.saas-hero-section` — padding/overflow/margin-top are inline
- `.saas-glow`, `.saas-glow--*` — position/size/filter are inline
- `.saas-hero-content` — z-index/text-align inline
- `.saas-badge` (non-pseudo) — display/padding/border/bg inline
- `.saas-gradient-text` — max-width/margin inline
- `.saas-browser-frame` — border/radius/shadow inline
- `.saas-browser-toolbar` (non-pseudo) — height/border/flex inline
- `.saas-browser-frame img` — aspect-ratio/object-fit inline
- `.saas-logos-section`, `.saas-logos-label`, `.saas-logo-bar`, `.saas-logo-item`, `.saas-logo-number` — all inline
- `.saas-section-label` — color/font inline
- `.saas-feature-card`, `.saas-feature-card h3`, `.saas-feature-card p` — padding/border/bg inline
- `.saas-feature-icon` (non-pseudo) — dimensions/border-radius/flex inline
- `.saas-feature-icon--primary/secondary/accent` (non-pseudo) — bg-color inline
- `.saas-stats-section` — bg-color/color/padding inline
- `.saas-stat-card`, `.saas-stat-card--offset` — padding/border/transform inline
- `.saas-stat-value`, `.saas-stat-value--*` — font-size/font-weight/color inline
- `.saas-stat-label` — color/font inline
- `.saas-quote` — position inline
- `.saas-quote-mark` (non-pseudo) — position/dimensions inline
- `.saas-quote-text` — font-size/line-height inline
- `.saas-quote-avatar`, `.saas-quote-role` — dimensions/border/color inline
- `.saas-pricing-card`, `.saas-pricing-card--popular` (non-pseudo) — padding/border/shadow inline
- `.saas-pricing-name`, `.saas-pricing-name--primary` — font/color inline
- `.saas-pricing-desc`, `.saas-pricing-price`, `.saas-pricing-price span` — font/color inline
- `.saas-pricing-cta`, `.saas-pricing-cta--*` — display/padding/border inline
- `.saas-check-list` (non-pseudo) — list-style/flex inline
- `.saas-check-list li` (non-pseudo) — display/flex/gap inline
- `.saas-cta-section` — padding/gradient inline
- `.saas-footer`, `.saas-footer-*` — all inline
- Responsive rules for `.saas-logo-bar`, `.saas-footer-grid`, `.saas-pricing-card--popular transform`, `.saas-stat-card--offset transform` — these either don't use grid classes or the transform reset can be handled inline

## Tasks

1. **Keep helpers unchanged** — `encodeSvgForDataUri` and `buildSvgDataUri` stay as-is at top of file.

2. **Rewrite `generateSaasCustomCss` body** — build the CSS string from exactly these sections in order:
   - Comment header: `/* SaaS Template — pseudo-elements, masks, grids only */`
   - Pseudo-element rules (badge dot, browser dots, popular badge)
   - Gradient text clip rule
   - Feature icon base `::after` + per-feature mask-image rules (loop over `SAAS_FEATURES`)
   - Quote mark mask-image rule
   - Check list mask-image rules (base + popular override)
   - Grid layout rules (features, stats, pricing)
   - Single `@media (max-width: 768px)` block collapsing all grids to `1fr`

3. **Apply `:root :where()` wrapper to every selector** — including inside the media query.

4. **Verify nothing else** — the output must contain zero `padding`, zero `margin` (except pseudo-element positioning like the popular badge), zero `color` declarations (except pseudo-element content colors and mask background-colors), zero `font-size`/`font-weight`/`border`/`background-color` (except within pseudo-element rules where they're structurally required). The only non-pseudo properties allowed outside pseudo-elements are `background` + `-webkit-background-clip` on gradient-span and `display: grid` + `grid-template-columns` + `gap` on grid containers.

## Estimated size

~80 lines of CSS output (down from ~140). The TypeScript file itself will be ~70 lines.

## Integration note

This file is not yet imported anywhere. A future story will wire `generateSaasCustomCss()` into either `theme.json`'s `css` property or an enqueued stylesheet via `functions.php`. That's out of scope here — this story only produces the correct, minimal CSS string.
