# Wire transpiler into generation pipeline

Story: story-907
Agent: architect

## Context

The generation pipeline currently produces hardcoded block markup for all templates. This story changes the front-page template to be AI-generated via JSX, transpiled to WordPress block markup, while keeping all other templates (index, single, page, archive, 404, search) hardcoded. It also adds skeleton page generation and enhanced blueprint building to the route.

Pipeline change:
```
Current: enrichment -> theme.json -> hardcoded templates -> parts -> validation -> package
New:     enrichment -> theme.json -> Gemini generates JSX (front-page only) -> transpileJSXToBlocks() -> skeleton pages generated -> blueprint enhanced -> validation -> package
```

Depends on: story-908 (JSX system prompt), the transpiler module (transpileJSXToBlocks), and skeleton page generator (both assumed to exist by the time this ships).

## What changes

| File | Change |
|---|---|
| `src/lib/generators/templates.ts` | Replace hardcoded front-page with AI-generated JSX -> transpiled block markup. Keep all other templates hardcoded. Add fallback to existing generic front-page on transpilation failure. |
| `src/app/api/generate/route.ts` | Import skeleton page generator and blueprint builder. After templates, generate skeleton pages and include them in the complete event payload. |

## Contract

New imports expected to exist (from sibling stories):
- `transpileJSXToBlocks(jsx: string): string` from `src/lib/transpiler/index.ts` — converts JSX string to WordPress block markup
- `generateSkeletonPages(archetype: ThemeArchetype, themeJson: object): Map<string, string>` from `src/lib/generators/skeleton-pages.ts` — produces standard content pages (about, contact, etc.) based on archetype
- `buildEnhancedBlueprint(...)` from wherever the blueprint builder lands — enhanced version of the current blueprint route logic

The JSX system prompt (story-908) will have already replaced `TEMPLATE_SYSTEM_PROMPT` in `block-markup.ts` to instruct Gemini to output JSX instead of raw block markup.

---

## Tasks — `src/lib/generators/templates.ts`

### 1. Add transpiler import

```ts
import { transpileJSXToBlocks } from "../transpiler";
```

### 2. Extract the generic front-page markup into a named constant

The existing `genericFrontPage` variable (currently declared inline inside `generateTemplates`) stays as-is. It becomes the fallback when AI generation or transpilation fails. No code change needed — it's already a `const` inside the function.

### 3. Replace front-page generation logic

Currently the front-page is selected by archetype:
```ts
const frontPageHtml = enrichedPrompt?.archetype?.id === "saas"
  ? SAAS_FRONT_PAGE_HTML
  : genericFrontPage;
templates.set("front-page.html", frontPageHtml);
```

Replace with AI-generation-then-transpile for all archetypes. The SaaS hardcoded template becomes a fallback, not the primary path.

New logic at the end of `generateTemplates`, replacing the front-page block:

```ts
// --- AI-generated front page ---
let frontPageHtml: string;
try {
  const frontPageSpec = TEMPLATE_SPECS.find(s => s.name === "front-page")!;
  const frontPagePrompt = buildTemplatePrompt(frontPageSpec, enrichedPrompt, themeJson);

  const jsxString = await provider.generateText(
    frontPagePrompt,
    TEMPLATE_SYSTEM_PROMPT,
    { temperature: frontPageSpec.temperature }
  );

  frontPageHtml = transpileJSXToBlocks(jsxString);
} catch (err) {
  console.warn(
    "[templates] Front-page AI generation/transpilation failed, using fallback:",
    err instanceof Error ? err.message : err
  );
  // Fall back to archetype-specific hardcoded template
  frontPageHtml = enrichedPrompt?.archetype?.id === "saas"
    ? SAAS_FRONT_PAGE_HTML
    : genericFrontPage;
}

templates.set("front-page.html", frontPageHtml);
```

Key decisions:
- **Only front-page gets AI generation.** The other 6 templates are structural (query loops, post content, search) and don't benefit from creative AI — their block markup is correct and stable as hardcoded strings.
- **Fallback preserves existing behavior.** SaaS archetype falls back to SAAS_FRONT_PAGE_HTML; everything else falls back to genericFrontPage. Zero regression if the AI path fails.
- **`generateTemplates` signature stays the same.** It already takes `provider` — no callers need updating.
- **TEMPLATE_SPECS and buildTemplatePrompt are already defined** in this file and used to be the primary generation path. They're still there, just unused until now. This wires them back in for front-page only.

### 4. Make generateTemplates async-aware for the AI call

`generateTemplates` is already `async` and returns `Promise<Map<string, string>>`. The new `await provider.generateText(...)` call fits naturally. No signature change.

### 5. Keep TEMPLATE_SPECS and buildTemplatePrompt

These are already defined in the file (lines 14-181). They were originally written for AI generation of all templates but the function was later switched to hardcoded markup. This story re-activates them for the front-page spec only. Do not remove the other specs — they may be activated later.

---

## Tasks — `src/app/api/generate/route.ts`

### 6. Add imports

```ts
import { generateSkeletonPages } from "@/lib/generators/skeleton-pages";
```

### 7. Add skeleton page generation step

After the `Promise.all` block (line 111) and before the validation step (line 114), add:

```ts
// Step 8: Skeleton pages
send("step", { step: "skeleton-pages", status: "active", detail: "Generating content pages..." });
const skeletonPages = generateSkeletonPages(enriched.archetype, themeJson);
send("files", { type: "skeleton-pages", files: mapToObject(skeletonPages) });
send("step", {
  step: "skeleton-pages",
  status: "done",
  detail: `${skeletonPages.size} content pages generated`,
});
```

Renumber the existing validation step comment from "Step 8" to "Step 9" and custom CSS from "Step 9" to "Step 10".

### 8. Include skeleton pages in validation

Add skeleton pages to the `allMarkup` map so they get validated too:

```ts
const allMarkup = new Map([...templates, ...parts, ...skeletonPages]);
```

### 9. Include skeleton pages in complete payload

Add `skeletonPages` to the `themeFiles` object in the `send("complete", ...)` call:

```ts
send("complete", {
  themeFiles: {
    themeJson: JSON.stringify(themeJson, null, 2),
    darkMode: JSON.stringify(darkMode, null, 2),
    templates: mapToObject(templates),
    parts: mapToObject(parts),
    patterns: mapToObject(patterns),
    skeletonPages: mapToObject(skeletonPages),
    customCss,
  },
  // ... rest unchanged
});
```

### 10. Update SSE step messaging for templates

The templates step now involves an AI call for front-page, so update the status detail:

```ts
send("step", { step: "templates", status: "active", detail: "Generating page layouts (AI-powered front page)..." });
```

---

## What NOT to change

- **Do NOT make index/single/page/archive/404/search AI-generated.** They are structural templates with correct, stable block markup. AI generation adds latency and failure risk for no benefit.
- **Do NOT modify the blueprint route** (`src/app/api/blueprint/route.ts`). The enhanced blueprint builder will be a separate module imported here; the route itself may change in a later story.
- **Do NOT remove SAAS_FRONT_PAGE_HTML or the saas-template.ts import.** They're the fallback for SaaS archetypes when AI generation fails.
- **Do NOT change the AIProvider interface or the generateText signature.** The existing interface already supports what we need.
- **Do NOT change parts.ts, patterns.ts, or custom-css.ts.** Those are unrelated to this integration.

## Acceptance criteria

- Given a generation request, when Gemini returns valid JSX for the front-page, then `transpileJSXToBlocks` converts it and the result is set as `front-page.html`
- Given a generation request, when Gemini or transpilation throws, then the hardcoded fallback template is used and generation completes without error
- Given any archetype, when `generateTemplates` completes, then all 7 templates (index, single, page, archive, 404, search, front-page) are present in the returned Map
- Given a generation request, when the pipeline completes, then `skeletonPages` appears in the complete event payload
- Given skeleton pages are generated, when validation runs, then skeleton page markup is included in the validation pass

## Verification

- Call `generateTemplates` with a mock provider that returns JSX; confirm `front-page.html` contains transpiled block markup (not JSX)
- Call `generateTemplates` with a mock provider that throws; confirm `front-page.html` contains the hardcoded fallback
- Call the generate route end-to-end; confirm the SSE stream includes `skeleton-pages` file events and the complete payload contains `skeletonPages`
- Confirm the other 6 templates are identical to their current hardcoded values (no regression)
