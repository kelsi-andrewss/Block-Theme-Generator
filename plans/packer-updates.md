# Packer Updates — story-900

## Goal
Replace the Tailwind CDN hack in `functions.php` with WordPress-native `wp_enqueue_block_style` for `core/group`, and pipe optional `customCss` through the zip packer so it lands as `assets/css/saas-sections.css` in the theme bundle.

---

## File: `src/lib/packer/constants.ts`

### 1. Add `hasCustomCss` to `ThemeMeta`

```ts
export interface ThemeMeta {
  name: string;
  slug: string;
  description: string;
  version: string;
  fontFamilies?: string[];
  hasCustomCss?: boolean;      // NEW
}
```

### 2. Rewrite `generateFunctionsPHP`

Remove the `wp_enqueue_scripts` / Tailwind CDN block entirely (lines 32-34 of current output). Replace it with a conditional `wp_enqueue_block_style` block that only emits when `meta.hasCustomCss` is true.

New logic after the `after_setup_theme` block:

```ts
if (meta.hasCustomCss) {
  lines.push("");
  lines.push(`add_action('init', function () {`);
  lines.push(`    wp_enqueue_block_style('core/group', [`);
  lines.push(`        'handle' => '${meta.slug}-saas-sections',`);
  lines.push(`        'src'    => get_theme_file_uri('assets/css/saas-sections.css'),`);
  lines.push(`        'path'   => get_theme_file_path('assets/css/saas-sections.css'),`);
  lines.push(`    ]);`);
  lines.push(`});`);
}
```

Key points:
- Hook is `init`, not `wp_enqueue_scripts` — required by `wp_enqueue_block_style`.
- `path` param causes WP to inline the CSS in `<head>` instead of adding a `<link>`, which is the performance-optimal behavior.
- CSS only loads on pages that contain a `core/group` block (i.e., every SaaS section page, but not random utility pages).
- The Tailwind CDN enqueue is deleted unconditionally — it was a dev scaffold and must not ship.

The Google Fonts enqueue stays on `wp_enqueue_scripts` — that's correct for external stylesheets.

---

## File: `src/lib/packer/zip.ts`

### 3. Add `customCss` to `ThemeFiles`

```ts
export interface ThemeFiles {
  themeJson: string;
  darkMode: string;
  templates: Map<string, string>;
  parts: Map<string, string>;
  patterns: Map<string, string>;
  meta: ThemeMeta;
  customCss?: string;          // NEW
}
```

### 4. Write `assets/css/saas-sections.css` in `packageTheme`

After the `stylesDir` block (line 43), add:

```ts
if (themeFiles.customCss) {
  const cssDir = root.folder("assets")!.folder("css")!;
  cssDir.file("saas-sections.css", themeFiles.customCss);
}
```

No other changes to `packageTheme`.

---

## Caller contract

Callers that populate `ThemeFiles` must:
1. Set `customCss` to the raw CSS string (the compiled SaaS section styles).
2. Set `meta.hasCustomCss = true` when `customCss` is provided.

The two fields are intentionally separate: `customCss` carries the payload, `hasCustomCss` controls PHP codegen. This avoids passing the full CSS blob into `generateFunctionsPHP` just to check truthiness.

---

## What is NOT in scope
- Generating the CSS content itself (that's the SaaS template generator's job).
- Changing `theme.json` or any template/part/pattern files.
- Handling multiple CSS files or per-block CSS beyond `core/group`.
