# Blueprint enhancement: skeleton pages, menus, and site options

Story: story-906
Agent: architect

## Context

The current Blueprint (`src/app/api/blueprint/route.ts`) does three things: login, installTheme, setSiteOptions (stylesheet + template). That is the minimum for the theme to activate, but the Playground site has no pages, no navigation menu, and every internal link in the template markup (buttons, nav items) points at nothing.

`src/lib/playground/sample-content.ts` already knows how to generate a `runPHP` script that creates posts/pages, a nav menu, and sets the static front page. But that PHP is never included in the Blueprint steps — it exists in isolation, unused by the bundle pipeline.

This module bridges the gap. It reads the generated block markup, extracts internal link targets, cross-references them against the archetype's sample content, and emits the additional Blueprint steps needed to make the Playground site feel like a real site on first load.

## What changes

| File | Change |
|---|---|
| `src/lib/playground/blueprint-builder.ts` | **New.** Core module: link extraction, page step generation, menu step generation, and Blueprint composition |
| `src/app/api/blueprint/route.ts` | Call `buildEnhancedBlueprint` instead of hand-coding the steps array; accept `archetypeId` in request body |

## Design decisions

### Why not just call `buildSampleContentPHP` as a single runPHP step?
It already produces a monolith PHP script, but that script is not driven by the actual template markup. If the template has a "Pricing" link but the archetype content map has no "Pricing" page, the link is dead. This module makes page creation data-driven: it starts from what the markup actually links to, then fills in content from the archetype map (or generates a skeleton stub if no match exists).

### Link extraction scope
We only care about internal paths — `href` values starting with `/` or `#`, and `home_url()` references in the PHP-style menu items. External URLs (https://...) are left alone. Anchor-only links (`#features`, `#pricing`) get mapped to section anchors on the front page, not separate pages — no step needed for those.

### Blueprint step ordering
Steps execute sequentially. Order matters:
1. `login` — required first
2. `installTheme` + `setSiteOptions` — theme must be active before content references theme features
3. `runPHP` (site identity) — blogname, blogdescription
4. `runPHP` (delete defaults) — remove "Hello World" post and "Sample Page"
5. `runPHP` (create pages) — one wp_insert_post per page
6. `runPHP` (set front page) — show_on_front = page, page_on_front = slug
7. `runPHP` (create nav menu) — wp_create_nav_menu + wp_update_nav_menu_item per link + set_theme_mod

We could batch 3-7 into one large runPHP step (like sample-content.ts does), but separate steps are easier to debug and reorder. The Blueprint runner handles ordering — no performance penalty since it is sequential anyway.

**Decision: use a single combined runPHP step.** Despite the debuggability argument above, Playground Blueprint bundles passed via data URI are size-constrained. Each additional step adds JSON overhead. More importantly, the PHP operations are interdependent (front page assignment needs the page ID from insert), so a single script with local variables is cleaner than multiple isolated scripts. This matches the pattern already established in `sample-content.ts`.

## Contract

### Types

```typescript
interface InternalLink {
  label: string;   // visible text (button label, nav item text)
  path: string;    // normalized path, e.g. "/pricing"
}

interface SkeletonPage {
  title: string;
  slug: string;
  content: string; // block markup — from archetype content map if available, otherwise minimal stub
}

interface BlueprintStep {
  step: string;
  [key: string]: unknown;
}

interface Blueprint {
  $schema: string;
  landingPage: string;
  preferredVersions: { php: string; wp: string };
  steps: BlueprintStep[];
}
```

### Functions

**`extractInternalLinks(markup: string): InternalLink[]`**

Parses all `href="..."` values from the block markup HTML. Filters to internal paths only (starts with `/`, or relative paths without protocol). Extracts the adjacent text content as the label. Deduplicates by path. Excludes anchor-only links (`#section`).

Regex strategy: scan for `<a [^>]*href="([^"]*)"[^>]*>([^<]*)` — captures href and the immediately following text node. This is sufficient for block markup where link text is always a direct child text node (no nested elements inside `<a>` in WordPress button blocks).

**`resolveSkeletonPages(links: InternalLink[], archetypeId: string): SkeletonPage[]`**

For each extracted link path, checks whether the archetype's `ARCHETYPE_CONTENT[archetypeId].posts` has a matching page (by slug comparison). If yes, uses that content. If no match, generates a minimal stub page:
```html
<!-- wp:paragraph -->
<p>This page is under construction.</p>
<!-- /wp:paragraph -->
```
Returns the deduplicated list. Excludes the front page (path `/`) since it uses the template's own front-page.html.

**`buildContentPHP(pages: SkeletonPage[], siteTitle: string, siteTagline: string, menuLinks: InternalLink[]): string`**

Generates a single PHP script (same pattern as `buildSampleContentPHP`) that:
1. Requires wp-load.php
2. Deletes default content (post 1, page 2)
3. Sets site identity options
4. Inserts each page via wp_insert_post
5. Sets the first page as static front page
6. Creates nav menu, adds menu items, assigns to `primary` location

This replaces `buildSampleContentPHP` for the Blueprint path — same logic, but driven by the resolved skeleton pages instead of the hardcoded archetype arrays.

**`buildEnhancedBlueprint(themeSlug: string, archetypeId: string, templateMarkup: string): Blueprint`**

Orchestrator. Calls extractInternalLinks, resolveSkeletonPages, buildContentPHP, then assembles the full Blueprint object:
```typescript
{
  $schema: "https://playground.wordpress.net/blueprint-schema.json",
  landingPage: "/",
  preferredVersions: { php: "8.2", wp: "latest" },
  steps: [
    { step: "login", username: "admin", password: "password" },
    { step: "installTheme", themeData: { resource: "bundled", path: "theme.zip" } },
    { step: "setSiteOptions", options: { stylesheet: themeSlug, template: themeSlug } },
    { step: "runPHP", code: "<generated PHP>" },
  ]
}
```

## Tasks

1. Create `src/lib/playground/blueprint-builder.ts` with all four functions above
2. Import and use `ARCHETYPE_CONTENT` from `sample-content.ts` (export it if not already exported — it is currently module-scoped but not exported)
3. Update `src/app/api/blueprint/route.ts`:
   - Accept `archetypeId` and `templateMarkup` (the front page HTML) in the request body alongside `zipBase64` and `meta`
   - Replace the inline blueprint construction with a call to `buildEnhancedBlueprint`
   - Keep the bundle zip logic (blueprint.json + theme.zip) unchanged
4. Update the caller in `src/app/app/page.tsx` to pass `archetypeId` and the front-page template markup in the blueprint request body

## Edge cases

- **No internal links in markup:** The template has no `<a href="/...">` at all. `extractInternalLinks` returns empty, `resolveSkeletonPages` returns empty, the runPHP step still runs (sets site identity, creates menu with zero items). No crash.
- **Archetype ID not found:** Falls back to `blog` archetype content, same as `sample-content.ts` does today.
- **Duplicate slugs:** Two buttons both link to `/pricing`. `extractInternalLinks` deduplicates by path, so only one page is created.
- **Button with no href:** Block markup buttons without an `href` attribute (e.g. the SaaS template's CTA buttons currently have no href). These are skipped by the regex — no `href` captured means no link extracted. This is correct behavior; these are decorative/placeholder buttons.

## Acceptance criteria

- Given a SaaS template with buttons labeled "Start for free" and "View Documentation" (currently no hrefs), when the blueprint is generated, then site identity is set and a nav menu is created with items from the archetype's menuItems array
- Given template markup containing `href="/pricing"`, when the archetype has a Pricing page, then that page is created in WordPress with the archetype's content
- Given template markup containing `href="/custom-page"` with no archetype match, when the blueprint runs, then a stub page is created at that slug
- Given the enhanced blueprint is loaded in Playground, when the user clicks a nav menu link, then the page loads with content (not a 404)

## Verification

- Unit test: `extractInternalLinks` with sample block markup containing mixed internal/external/anchor links
- Unit test: `resolveSkeletonPages` with known archetype and mix of matching/non-matching slugs
- Manual test: generate a SaaS theme, open in Playground, verify nav menu works and pages have content
