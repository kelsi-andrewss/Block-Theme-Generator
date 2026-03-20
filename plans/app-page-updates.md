# Plan: Update app/page.tsx — premade SaaS header/footer + SSE + gallery

**Story**: 902
**File**: `src/app/app/page.tsx`

---

## 1. Fix missing `AuditResult` type import

**Line 29** uses `AuditResult` in the `GenerationResult` interface but it is never imported — pre-existing type error.

**Change**: Add to imports:
```ts
import type { AuditResult } from "@/lib/validation/design-audit";
```

---

## 2. Add `customCss` to `ThemeFilesData` interface

**Lines 19-25**: Add optional `customCss` field.

```ts
interface ThemeFilesData {
  themeJson: string;
  darkMode: string;
  templates: Record<string, string>;
  parts: Record<string, string>;
  patterns: Record<string, string>;
  customCss?: string;          // <-- new
}
```

Also update the empty initialization at **line 104** to include `customCss: ""`.

---

## 3. Handle `custom-css` SSE file events

**Lines 160-171**: Inside the `eventType === "files"` branch, add a new clause:

```ts
} else if (parsed.type === "custom-css") {
  setResult(prev => prev ? {
    ...prev,
    themeFiles: { ...prev.themeFiles, customCss: parsed.content }
  } : null);
}
```

Insert after the existing `dark-mode` handler (line 170).

---

## 4. Refactor premade SaaS `header.html` from `wp:html` to core blocks

**Line 339** (`"header.html"` value inside `handleSelectGalleryTheme`): Replace the single `wp:html` block wrapping a raw `<nav>` with proper WordPress core block comments that preserve the identical inline-styled HTML elements.

Key conversion rules:
- Outer nav wrapper -> `wp:group` with `tagName:"header"` and a `style` JSON attribute carrying the border-bottom, background, backdrop-filter, z-index
- Inner container div -> nested `wp:group` with constrained layout + max-width
- Flex row (logo / links / actions) -> `wp:group` with flex layout
- Logo link with icon div + text span -> `wp:group` containing `wp:paragraph` elements, each with inline styles on the HTML elements **kept as-is**
- Nav links -> `wp:paragraph` blocks, each wrapping an `<a>` with the existing inline styles
- Actions (Log in link + Get Started button) -> `wp:paragraph` for Log in, `wp:buttons` + `wp:button` for Get Started, all with original inline styles preserved

The inline styles on HTML elements (`style="..."`) stay exactly as they are today. The only change is replacing the outer `<!-- wp:html -->` / `<!-- /wp:html -->` wrapper with granular `<!-- wp:group -->`, `<!-- wp:paragraph -->`, `<!-- wp:buttons -->`, `<!-- wp:button -->` comment pairs.

---

## 5. Refactor premade SaaS `footer.html` from `wp:html` to core blocks

**Line 340** (`"footer.html"` value): Same conversion pattern as header.

Key conversion rules:
- Outer `<footer>` -> `wp:group` with `tagName:"footer"` and inline styles (border-top, background, padding, font-family)
- Inner max-width container -> nested `wp:group` with constrained layout
- Four-column flex layout -> `wp:group` with flex layout containing child `wp:group` blocks for each column
- Column headings -> `wp:heading` level 3 with inline styles
- Link lists -> `wp:paragraph` blocks wrapping `<a>` tags with original inline styles
- Brand description `<p>` -> `wp:paragraph`
- Bottom bar (copyright + social icons) -> `wp:group` with flex layout, `wp:paragraph` for copyright, `wp:group` for social SVG links
- Social icon SVGs -> `wp:paragraph` blocks wrapping `<a>` tags containing the SVGs

All inline styles on HTML elements remain unchanged.

---

## 6. Import `generateSaasCustomCss` and call it in `handleSelectGalleryTheme`

**Line 15 area**: Add import:
```ts
import { generateSaasCustomCss } from "@/lib/generators/custom-css";
```

**Inside `handleSelectGalleryTheme` (line 348 area)**: When building the result object, compute and include customCss for SaaS themes:

```ts
const customCss = theme.id === "saas" ? generateSaasCustomCss() : undefined;

setResult({
  themeFiles: {
    themeJson: JSON.stringify(theme.themeJson, null, 2),
    darkMode: JSON.stringify(theme.darkMode, null, 2),
    templates,
    parts,
    patterns: {},
    customCss,           // <-- new
  },
  // ... rest unchanged
});
```

---

## 7. Pass `customCss` to `ThemePreview` component

**Lines 635-641**: Add the `customCss` prop:

```tsx
<ThemePreview
  themeJson={result?.themeFiles.darkMode || result?.themeFiles.themeJson}
  templates={result?.themeFiles.templates}
  parts={result?.themeFiles.parts}
  patterns={result?.themeFiles.patterns}
  customCss={result?.themeFiles.customCss}   // <-- new
/>
```

> Note: ThemePreview's `ThemePreviewProps` interface will need `customCss?: string` added in a separate story/task covering that component. This plan only covers `page.tsx`.

---

## 8. Verification checklist

- [ ] `AuditResult` type error resolved
- [ ] `customCss` flows through SSE for AI-generated themes
- [ ] `customCss` is computed and injected for premade SaaS gallery themes
- [ ] Header renders identical visual output (same inline styles) but uses `wp:group`/`wp:paragraph`/`wp:buttons` instead of `wp:html`
- [ ] Footer renders identical visual output but uses core blocks instead of `wp:html`
- [ ] Gallery preview iframe (`/templates/saas`) is untouched — still the React page
- [ ] `handleDownload` and `handlePreview` both pass `customCss` through to `/api/package` via `result.themeFiles`
