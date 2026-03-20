# story-901 — Wire customCss through generate/package routes + ThemePreview

Depends on story-900 (adds `customCss?: string` to `ThemeFiles` and writes it to ZIP).

## Files touched

| File | Change |
|---|---|
| `src/app/api/generate/route.ts` | Import `generateSaasCustomCss`, call it when archetype is `saas`, include result in `complete` SSE payload |
| `src/app/api/package/route.ts` | Accept `customCss` from request body, pass it through to `packageTheme` |
| `src/components/ThemePreview.tsx` | Add `customCss` prop, inject into iframe `<style>` tag alongside existing styles |

## 1. `src/app/api/generate/route.ts`

### 1a. Import

Add at top with the other generator imports:

```ts
import { generateSaasCustomCss } from "@/lib/generators/custom-css";
```

### 1b. Generate CSS after validation, before `send("complete", ...)`

Between the validation step (line ~140) and the `send("complete", ...)` call (line ~143), add:

```ts
// Step 9: Custom CSS (archetype-specific)
const customCss = enriched.archetype.id === "saas"
  ? generateSaasCustomCss()
  : undefined;
```

`enriched.archetype.id` is already available from step 1. No new data fetching needed.
`generateSaasCustomCss` is pure/synchronous — no await.

### 1c. Include in complete payload

Add `customCss` to the `themeFiles` object inside `send("complete", ...)`:

```ts
send("complete", {
  themeFiles: {
    themeJson: JSON.stringify(themeJson, null, 2),
    darkMode: JSON.stringify(darkMode, null, 2),
    templates: mapToObject(templates),
    parts: mapToObject(parts),
    patterns: mapToObject(patterns),
    customCss,               // <-- new
  },
  // ... rest unchanged
});
```

`customCss` will be `undefined` for non-saas archetypes and omitted from the JSON by `JSON.stringify`.

### 1d. Update `ThemeFilesData` in `page.tsx`

Add `customCss?: string` to the `ThemeFilesData` interface (~line 19-25) so TypeScript accepts the new field from the SSE payload.

---

## 2. `src/app/api/package/route.ts`

### 2a. Extend body type

Add `customCss` as optional in the destructured body type:

```ts
const { themeFiles, meta } = body as {
  themeFiles: {
    themeJson: string;
    darkMode: string;
    templates: Record<string, string>;
    parts: Record<string, string>;
    patterns: Record<string, string>;
    customCss?: string;        // <-- new
  };
  meta: { ... };
};
```

### 2b. Pass to packageTheme

Add `customCss` to the object passed to `packageTheme`:

```ts
const zipBlob = await packageTheme({
  // ... existing fields ...
  customCss: themeFiles.customCss,   // <-- new (undefined if absent)
});
```

Story-900 will have already added `customCss?: string` to the `ThemeFiles` interface by the time this ships.

---

## 3. `src/components/ThemePreview.tsx`

### 3a. Add prop

```ts
export interface ThemePreviewProps {
  themeJson?: string;
  templates?: Record<string, string>;
  parts?: Record<string, string>;
  patterns?: Record<string, string>;
  customCss?: string;             // <-- new
}
```

Destructure in function signature:

```ts
export default function ThemePreview({ themeJson, templates, parts, customCss }: ThemePreviewProps) {
```

### 3b. Inject into iframe

In the `useEffect` that builds `doc`, add `customCss` as a second `<style>` block AFTER the existing one and AFTER the Tailwind CDN script tag. The Tailwind CDN stays — it provides CSS reset/normalization for the in-app preview.

```ts
const doc = `
<!DOCTYPE html>
<html>
  <head>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      ${cssVars}
      ${baseCss}
    </style>
    ${customCss ? `<style>${customCss}</style>` : ""}
  </head>
  <body>
    ${rawHtml}
  </body>
</html>
`;
```

Add `customCss` to the `useEffect` dependency array:

```ts
}, [themeJson, templates, parts, customCss]);
```

### 3c. Wire prop at call site

In `src/app/app/page.tsx` where `<ThemePreview>` is rendered (~line 635):

```tsx
<ThemePreview
  themeJson={result?.themeFiles.darkMode || result?.themeFiles.themeJson}
  templates={result?.themeFiles.templates}
  parts={result?.themeFiles.parts}
  patterns={result?.themeFiles.patterns}
  customCss={result?.themeFiles.customCss}
/>
```

---

## Data flow summary

```
generate/route.ts
  enriched.archetype.id === "saas" → generateSaasCustomCss() → string
  ↓ SSE "complete" event: themeFiles.customCss

page.tsx (client)
  setResult(parsed) → result.themeFiles.customCss
  ├─→ <ThemePreview customCss={...} />  (preview iframe gets <style> block)
  └─→ POST /api/package body.themeFiles.customCss
        ↓
        package/route.ts → packageTheme({ customCss }) → ZIP (story-900 handles writing to assets/css/)
```

## What NOT to change

- Do NOT remove the Tailwind CDN `<script>` tag from ThemePreview — it provides CSS reset/normalization for the in-app preview iframe. Removing it from `functions.php` is story-900's job.
- Do NOT modify `src/lib/packer/zip.ts` or `src/lib/packer/constants.ts` — those are story-900's files.
