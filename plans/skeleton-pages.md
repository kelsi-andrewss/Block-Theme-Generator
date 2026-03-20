# Build archetype-aware skeleton page generator

Story: story-905
Agent: architect

## Context

The front-page template and sample-content system exist, but the nav links they create (Pricing, Signup, About, etc.) point to pages that don't exist yet. `sample-content.ts` creates lightweight pages with 1-2 paragraphs -- enough for a blog post listing but not for a real page with visual structure. This generator produces full WordPress block markup pages per archetype, giving each skeleton page the kind of sectioned layout you'd see on a real site (pricing cards, contact forms, gallery grids, etc.). These pages are the content that gets inserted via `buildSampleContentPHP` -- the function output replaces the thin paragraph content currently in `ARCHETYPE_CONTENT`.

## What changes

| File | Change |
|---|---|
| `src/lib/generators/skeleton-pages.ts` | New file. Exports `generateSkeletonPages(archetypeId, themeColors)` returning `Map<string, SkeletonPage>`. Contains all page markup builders organized by archetype. |

## Design decisions

**Direct block markup, no AI generation.** Every page is a deterministic string template. The SaaS front page proved this approach works -- inline styles on core blocks render pixel-perfect and survive theme.json color changes via `var(--wp--preset--color--*)` tokens. AI generation adds latency, cost, and unpredictability for content that should be structurally identical across all themes of the same archetype.

**Color tokens only, no hex values.** All colors reference `var(--wp--preset--color--primary)`, `var(--wp--preset--color--secondary)`, etc. The `themeColors` parameter is available for edge cases (e.g., computing a readable contrast pair), but the block markup should use CSS custom properties so Global Styles color switching works.

**The themeColors parameter maps to WP preset slugs.** The input `{primary, secondary, accent, base, contrast}` maps directly to the `--wp--preset--color--{slug}` tokens already defined in theme.json. The markup references these via `var()`. The raw hex values are passed for potential computed styles (e.g., `color-mix`) but should not appear as hardcoded values in output markup.

**Pages don't include header/footer template parts.** These are page *content*, not templates. WordPress's `page.html` template wraps the content with header/footer. The skeleton pages produce what goes inside `<!-- wp:post-content /-->`.

<!-- CODER_ONLY -->
## Read-only context
- `src/lib/generators/saas-template.ts` -- reference for block markup patterns, inline style conventions, color token usage
- `src/lib/data/saas-features.ts` -- reference for data-driven markup generation pattern
- `src/lib/playground/sample-content.ts` -- current page content that this replaces; shows the slug/title conventions and the `ARCHETYPE_CONTENT` structure
- `src/lib/generators/templates.ts` -- shows how front-page.html and page.html are structured; confirms pages render inside `<!-- wp:post-content /-->`
- `src/lib/prompts/archetypes.ts` -- `ThemeArchetype` interface and `ARCHETYPES` array (currently only has `saas`; other archetypes will be added)

## Function signature

```typescript
interface ThemeColors {
  primary: string;    // hex, maps to --wp--preset--color--primary
  secondary: string;  // hex, maps to --wp--preset--color--secondary
  accent: string;     // hex, maps to --wp--preset--color--accent
  base: string;       // hex, maps to --wp--preset--color--base (background)
  contrast: string;   // hex, maps to --wp--preset--color--contrast (text)
}

interface SkeletonPage {
  title: string;
  slug: string;
  content: string;    // WordPress block markup
}

export function generateSkeletonPages(
  archetypeId: string,
  themeColors: ThemeColors
): Map<string, SkeletonPage>
```

The Map key is the slug (e.g., `"pricing"`, `"signup"`, `"about"`). The `content` field is raw WordPress block markup -- no `<!-- wp:template-part -->` wrappers.

## Archetype page definitions

### SaaS: 4 pages

**signup** -- "Sign Up"
- Section: centered heading "Create Your Account" + subtitle paragraph
- Form placeholder: `wp:group` styled as a card (border, border-radius, padding, background) containing:
  - Two `wp:group` "input" rows (styled as gray bordered rectangles with placeholder text via `wp:paragraph`)
  - A `wp:buttons` block with a primary-colored CTA "Create Account"
  - A `wp:paragraph` with "Already have an account? Sign in" text
- Bottom section: `wp:columns` with 3 trust signals (icon + short text each)

**pricing** -- "Pricing"
- Section heading: centered "Simple, Transparent Pricing" + subtitle
- Three-tier card layout using `wp:group` with `display:grid;grid-template-columns:repeat(auto-fit, minmax(300px, 1fr))` (same pattern as saas-template.ts pricing section)
- Starter ($19/mo), Professional ($49/mo, highlighted with primary border + "Most Popular" badge), Enterprise ($99/mo)
- Each card: plan name `wp:heading` h3, description `wp:paragraph`, price display, `wp:buttons` CTA, feature list with check SVGs
- Use the same card markup pattern from `saas-template.ts` pricing section but as standalone page content (no hero, no header/footer)

**documentation** -- "Documentation"
- Getting started guide layout
- Left-right two-column layout: sidebar nav (as a `wp:group` with stacked links) + main content area
- Main content: "Getting Started" `wp:heading` h1, step-by-step sections each with `wp:heading` h2 + `wp:paragraph` + optional code-like block (styled `wp:group` with monospace background)
- Steps: 1. "Install the SDK", 2. "Configure your project", 3. "Deploy your first app"
- Each step has a heading, explanatory paragraph, and a styled code block (`wp:group` with dark background, light text, monospace font, padding, border-radius)

**contact** -- "Contact Us"
- Two-column layout: form on left, info on right
- Form column: same styled-input pattern as signup (input-like groups + textarea-like taller group + submit button)
- Info column: heading "Get in Touch", paragraphs for email/phone/address, each with a small icon-like prefix

### Blog: 2 pages

**about** -- "About"
- Author-focused personal page
- Top section: `wp:columns` with author image placeholder (colored circle `wp:group`) + bio text (name as `wp:heading` h1, tagline as styled `wp:paragraph`, 2-3 paragraphs of bio)
- Mission section: `wp:separator`, `wp:heading` h2 "What This Blog Is About", `wp:paragraph` with mission description
- Bottom: `wp:group` with social/contact links as styled `wp:buttons`

**contact** -- "Contact"
- Simple centered layout
- Heading + subtitle paragraph
- Form placeholder (same card pattern: input-like groups for name, email, message textarea, submit button)
- Below form: `wp:paragraph` with "You can also reach me at hello@example.com"

### Portfolio: 2 pages

**projects** -- "Projects"
- Gallery grid layout
- Section heading: "Selected Work" `wp:heading` h1 + filter-like pills (styled `wp:buttons` row: "All", "Web", "Brand", "Print")
- Grid: `wp:group` with `display:grid;grid-template-columns:repeat(auto-fill, minmax(350px, 1fr));gap:2rem`
- 6 project cards, each a `wp:group` with:
  - Image placeholder: `wp:group` with aspect-ratio:4/3, background color using `color-mix(in srgb, var(--wp--preset--color--primary) N%, transparent)` varying per card
  - Project title `wp:heading` h3
  - Category tag `wp:paragraph` in small muted text
- Alternate the placeholder colors between primary and secondary tokens at different opacities

**hire-me** -- "Hire Me"
- Services + contact layout
- Top: `wp:heading` h1 "Let's Work Together" + `wp:paragraph` intro
- Services grid: `wp:columns` (3-col) with service cards -- each has an icon placeholder (`wp:group` colored circle), service name `wp:heading` h3, description `wp:paragraph`, starting price `wp:paragraph`
- Services: "Brand Identity", "Web Design", "Print Design"
- Bottom: contact form placeholder card (same pattern as other forms)

### Restaurant: 3 pages

**menu** -- "Menu"
- Category-based food menu layout
- `wp:heading` h1 "Our Menu" centered + `wp:paragraph` subtitle about seasonal ingredients
- 3 menu categories, each as a `wp:group` section:
  - Category heading: `wp:heading` h2 (e.g., "Starters", "Mains", "Desserts")
  - `wp:separator` styled thin
  - Menu items: each is a `wp:group` with `display:flex;justify-content:space-between` containing item name (`wp:heading` h3 or bold `wp:paragraph`) + price (`wp:paragraph`), with a description `wp:paragraph` below
- Starters: 4 items ($12-16 range)
- Mains: 4 items ($24-38 range)
- Desserts: 3 items ($10-14 range)
- Bottom note: `wp:paragraph` italic about dietary accommodations

**reservations** -- "Reservations"
- Booking form placeholder
- `wp:heading` h1 "Reserve a Table" + `wp:paragraph` about the dining experience
- `wp:columns` two-column: form on left (date, time, party size, name, phone as input-like groups + submit button), info on right (hours, location, policies as structured `wp:paragraph` blocks)
- Hours section: days + times listed
- Special events note: `wp:group` styled as a callout card with primary background tint

**about** -- "Our Story"
- Restaurant story + team page
- Hero-like top section: `wp:heading` h1 "Our Story" + `wp:paragraph` origin story (2-3 paragraphs about the chef, the philosophy, the space)
- `wp:separator`
- Team section: `wp:heading` h2 "Meet the Team" + `wp:columns` with 3 team member cards (photo placeholder circle, name `wp:heading` h3, role `wp:paragraph`)
- Values section: `wp:heading` h2 "Our Philosophy" + `wp:columns` with 3 value cards (e.g., "Locally Sourced", "Seasonal Menu", "Zero Waste")

## Shared markup patterns

Extract these as local helper functions to avoid repetition:

### `styledInput(label: string, wide?: boolean): string`
Generates a form input placeholder -- a `wp:group` with border, border-radius, padding, background, containing a `wp:paragraph` with muted placeholder text. When `wide` is true, use `min-height: 120px` for textarea-like appearance.

### `formCard(inputs: string[], buttonText: string): string`
Wraps inputs in a card-styled `wp:group` (border, border-radius, padding, background-color) and appends a `wp:buttons` block.

### `sectionHeading(title: string, subtitle?: string): string`
Centered `wp:heading` h2 + optional `wp:paragraph` subtitle with standard spacing.

### `pricingCard(opts: { name, description, price, period, features, highlighted?, badge? }): string`
Reusable pricing tier card. Matches the saas-template.ts pattern: border, border-radius, padding, feature list with check SVGs. When `highlighted`, uses primary border + box-shadow + translateY lift + badge.

## Inline style conventions (match saas-template.ts)

- Border colors: `color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)`
- Muted text: `color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)`
- Card background: `color-mix(in srgb, var(--wp--preset--color--contrast) 3%, transparent)` or `var(--wp--preset--color--base)`
- Section padding: `padding-top:4rem;padding-bottom:4rem` or `6rem` for major sections
- Content max-width: use `wp:group` with `{"layout":{"type":"constrained"}}` or inline `max-width`
- Grid layouts: inline `display:grid;grid-template-columns:repeat(auto-fit, minmax(Npx, 1fr));gap:2rem`
- Check mark SVG: `<svg style="width:1.25rem;height:1.25rem;color:#22c55e" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`

## Tasks

1. **Create the file** `src/lib/generators/skeleton-pages.ts` with the `ThemeColors` and `SkeletonPage` interfaces and the `generateSkeletonPages` function export.

2. **Implement shared helpers** -- `styledInput`, `formCard`, `sectionHeading`, `pricingCard` as module-private functions. Each returns a string of WordPress block markup.

3. **Implement SaaS pages** -- `buildSaasPages(colors: ThemeColors): Map<string, SkeletonPage>` returning entries for `signup`, `pricing`, `documentation`, `contact`. Use the pricing card pattern from saas-template.ts as the reference for the pricing page.

4. **Implement Blog pages** -- `buildBlogPages(colors: ThemeColors): Map<string, SkeletonPage>` returning entries for `about`, `contact`.

5. **Implement Portfolio pages** -- `buildPortfolioPages(colors: ThemeColors): Map<string, SkeletonPage>` returning entries for `projects`, `hire-me`.

6. **Implement Restaurant pages** -- `buildRestaurantPages(colors: ThemeColors): Map<string, SkeletonPage>` returning entries for `menu`, `reservations`, `about`.

7. **Wire the dispatcher** -- `generateSkeletonPages` switches on `archetypeId` and calls the appropriate builder. Unknown archetypes fall back to Blog pages (matching `sample-content.ts` fallback convention).

8. **Fallback for unregistered archetypes** -- The `ARCHETYPES` array currently only has `saas`, but `ARCHETYPE_CONTENT` in sample-content.ts has content for portfolio, blog, restaurant, ecommerce, agency, magazine, creative. Build skeleton pages for the four archetypes specified in the story (SaaS, Blog, Portfolio, Restaurant). Other archetypes fall back to Blog pages. This can be extended later.
<!-- END_CODER_ONLY -->

## Contract

- `generateSkeletonPages(archetypeId: string, themeColors: ThemeColors): Map<string, SkeletonPage>` -- pure function, no side effects, no async, no AI calls
- `SkeletonPage` has `title: string`, `slug: string`, `content: string` (block markup)
- Map keys are slugs
- All color references use `var(--wp--preset--color--*)` tokens -- zero hardcoded hex values in output markup (except the green check SVG `#22c55e` which is a universal UI convention)
- Output block markup uses only core blocks: `wp:group`, `wp:heading`, `wp:paragraph`, `wp:columns`, `wp:column`, `wp:buttons`, `wp:button`, `wp:separator`, `wp:list`, `wp:spacer`
- No `wp:html` blocks
- No `wp:template-part` references (this is page content, not a template)

## Acceptance criteria

- Given `generateSkeletonPages("saas", colors)`, returns a Map with keys `signup`, `pricing`, `documentation`, `contact`
- Given `generateSkeletonPages("blog", colors)`, returns a Map with keys `about`, `contact`
- Given `generateSkeletonPages("portfolio", colors)`, returns a Map with keys `projects`, `hire-me`
- Given `generateSkeletonPages("restaurant", colors)`, returns a Map with keys `menu`, `reservations`, `about`
- Given `generateSkeletonPages("unknown-archetype", colors)`, returns the Blog page set as fallback
- Given any returned page content, when searched for `wp:html`, zero matches found
- Given any returned page content, when searched for `wp:template-part`, zero matches found
- Given any returned page content, when searched for hardcoded hex color values (excluding `#22c55e` check SVG), zero matches found
- Given the pricing page for SaaS, the markup contains three tier cards with plan names, prices, feature lists, and CTA buttons
- Given the menu page for Restaurant, the markup contains categorized food items with names, descriptions, and prices
- Given the projects page for Portfolio, the markup contains a grid of 6 project cards with placeholder images
- TypeScript compiles with zero errors: `npx tsc --noEmit`

## Verification

1. **Import check**: `import { generateSkeletonPages } from './skeleton-pages'` resolves without error
2. **TypeScript compiles**: `npx tsc --noEmit` passes
3. **Archetype coverage**: Call the function for each of the 4 archetypes, verify the expected slugs appear in the returned Map
4. **No wp:html**: Search all returned content strings for `wp:html` -- zero matches
5. **Color token compliance**: Search all returned content for `/#[0-9a-fA-F]{3,8}/` -- only the check SVG green should match
