import { getThemeById, getWpPalette } from "../theme-colors";

export interface ThemeMeta {
  name: string;
  slug: string;
  description: string;
  version: string;
  fontFamilies?: string[];
  hasCustomCss?: boolean;
}

export function generateStyleCss(meta: ThemeMeta): string {
  return `/*
Theme Name: ${meta.name}
Description: ${meta.description}
Version: ${meta.version}
Requires at least: 6.6
Tested up to: 6.7
Requires PHP: 7.4
License: GNU General Public License v2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Text Domain: ${meta.slug}
*/
`;
}

export function generateFunctionsPHP(meta: ThemeMeta): string {
  const lines: string[] = [
    "<?php",
    "",
    `add_action('after_setup_theme', function () {`,
    `    add_theme_support('wp-block-styles');`,
    `});`,
  ];

  if (meta.hasCustomCss) {
    lines.push("");
    lines.push(`add_action('wp_enqueue_scripts', function () {`);
    lines.push(`    wp_enqueue_style('${meta.slug}-saas-sections', get_theme_file_uri('assets/css/saas-sections.css'), array(), '${meta.version}');`);
    lines.push(`});`);
    lines.push("");
    lines.push(`add_action('wp_head', function () {`);
    lines.push(`    echo '<script src="https://cdn.tailwindcss.com"></script>';`);
    lines.push(`});`);
  }

  const googleFonts = (meta.fontFamilies ?? []).filter(
    (f) => !isSystemFont(f)
  );

  if (googleFonts.length > 0) {
    const families = googleFonts
      .map((f) => f.replace(/ /g, "+"))
      .join("&family=");
    const url = `https://fonts.googleapis.com/css2?family=${families}&display=swap`;

    lines.push("");
    lines.push(`add_action('wp_enqueue_scripts', function () {`);
    lines.push(
      `    wp_enqueue_style('${meta.slug}-google-fonts', '${url}', [], null);`
    );
    lines.push(`});`);
  }

  lines.push("");
  lines.push(`add_action('after_switch_theme', function () {`);
  lines.push(`    if (get_option('page_on_front')) return;`);
  lines.push(`    $home = wp_insert_post(array('post_title' => 'Home', 'post_status' => 'publish', 'post_type' => 'page'));`);
  lines.push(`    if ($home && !is_wp_error($home)) {`);
  lines.push(`        update_option('show_on_front', 'page');`);
  lines.push(`        update_option('page_on_front', $home);`);
  lines.push(`    }`);
  lines.push(`});`);
  lines.push("");
  return lines.join("\n");
}

export function generateReadmeTxt(meta: ThemeMeta): string {
  return `=== ${meta.name} ===

== Description ==

${meta.description}

== Installation ==

1. Download the ZIP file.
2. In your WordPress admin, go to Appearance > Themes > Add New > Upload Theme.
3. Upload the ZIP file and click "Install Now".
4. Activate the theme.

== Requirements ==

- WordPress 6.6 or later
- PHP 7.4 or later

== License ==

GNU General Public License v2 or later
http://www.gnu.org/licenses/gpl-2.0.html
`;
}

export interface ThemeFilesData {
  themeJson: string;
  darkMode: string;
  templates: Record<string, string>;
  parts: Record<string, string>;
  patterns: Record<string, string>;
  customCss?: string;
  skeletonPages?: Record<string, { title: string; slug: string; content: string }>;
}

export interface ThemeMetaInput {
  themeName: string;
  displayName: string;
  description: string;
}

export interface IframeState {
  isDarkMode: boolean;
  activeThemeId: string;
  activeFontId: string;
  colors: { primary?: Record<number, string>; secondary?: Record<number, string> } | null;
}

export function applyThemeOverrides(
  themeFiles: ThemeFilesData,
  state: IframeState | null
): ThemeFilesData {
  if (!state) return themeFiles;

  let themeJsonStr = themeFiles.themeJson;
  try {
    const parsed = JSON.parse(themeJsonStr);

    const theme = getThemeById(state.activeThemeId);
    if (theme) {
      parsed.settings = parsed.settings || {};
      parsed.settings.color = parsed.settings.color || {};
      parsed.settings.color.palette = getWpPalette(theme, state.isDarkMode);
    }

    if (state.isDarkMode && themeFiles.darkMode) {
      const dark = JSON.parse(themeFiles.darkMode);
      if (dark.styles?.color) {
        parsed.styles = parsed.styles || {};
        parsed.styles.color = dark.styles.color;
      }
    }

    if (state.activeFontId) {
      const fontFamilies = parsed.settings?.typography?.fontFamilies;
      if (Array.isArray(fontFamilies)) {
        const fontMap: Record<string, string> = {
          sans: "Inter, ui-sans-serif, system-ui, sans-serif",
          serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
          mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        };
        const activeFontFamily = fontMap[state.activeFontId] || fontMap["sans"];

        const heading = fontFamilies.find((f: any) => f.slug === "heading");
        if (heading) heading.fontFamily = activeFontFamily;

        const body = fontFamilies.find((f: any) => f.slug === "body");
        if (body) body.fontFamily = activeFontFamily;
      }
    }

    themeJsonStr = JSON.stringify(parsed, null, 2);
  } catch {
    // If theme.json is unparseable, return as-is
  }

  return { ...themeFiles, themeJson: themeJsonStr };
}

export async function buildThemeFileMap(
  themeFiles: ThemeFilesData,
  meta: ThemeMetaInput
): Promise<Record<string, string | Blob | ArrayBuffer>> {
  const slug = meta.themeName;
  const themeMeta: ThemeMeta = {
    name: meta.displayName,
    slug,
    description: meta.description,
    version: "1.0.0",
  };

  const hasCustomCss = !!themeFiles.customCss;

  const fontFamilies: string[] = [];
  try {
    const tj = JSON.parse(themeFiles.themeJson);
    const families = tj?.settings?.typography?.fontFamilies;
    if (Array.isArray(families)) {
      for (const f of families) {
        if (f.name) fontFamilies.push(f.name);
      }
    }
  } catch {}

  const fullMeta: ThemeMeta = { ...themeMeta, fontFamilies, hasCustomCss };

  const fileMap: Record<string, string | Blob | ArrayBuffer> = {
    "style.css": generateStyleCss(fullMeta),
    "theme.json": themeFiles.themeJson,
    "functions.php": generateFunctionsPHP(fullMeta),
    "README.txt": generateReadmeTxt(fullMeta),
  };

  for (const [name, content] of Object.entries(themeFiles.templates)) {
    if (content) fileMap[`templates/${name}`] = content;
  }

  for (const [name, content] of Object.entries(themeFiles.parts)) {
    if (content) fileMap[`parts/${name}`] = content;
  }

  for (const [name, content] of Object.entries(themeFiles.patterns)) {
    if (content) fileMap[`patterns/${name}`] = content;
  }

  if (themeFiles.darkMode) {
    fileMap["styles/dark.json"] = themeFiles.darkMode;
  }

  if (themeFiles.customCss) {
    fileMap["assets/css/saas-sections.css"] = themeFiles.customCss;
  }

  if (themeFiles.skeletonPages) {
    for (const [, page] of Object.entries(themeFiles.skeletonPages)) {
      if (page.content) fileMap[`templates/page-${page.slug}.html`] = page.content;
    }
  }

  // Hunt for all local images, fetch them, buffer them into the zip, and rewrite their URLs
  // so that the WordPress Playground and native WP installs can resolve them locally inside the theme.
  const imageRegex = /\/images\/templates\/([a-zA-Z0-9_.-]+)/g;
  const foundImages = new Set<string>();

  for (const [path, content] of Object.entries(fileMap)) {
    if (typeof content === "string" && (path.startsWith("templates/") || path.startsWith("parts/") || path.startsWith("patterns/"))) {
      let modifiedContent = content;
      let match;
      while ((match = imageRegex.exec(content)) !== null) {
        foundImages.add(match[1]);
      }
      modifiedContent = content.replace(imageRegex, `/wp-content/themes/${slug}/assets/images/$1`);
      fileMap[path] = modifiedContent;
    }
  }

  if (typeof window !== "undefined" && foundImages.size > 0) {
    await Promise.all(
      Array.from(foundImages).map(async (filename) => {
        try {
          const res = await fetch(`/images/templates/${filename}`);
          if (res.ok) {
            const buffer = await res.arrayBuffer();
            fileMap[`assets/images/${filename}`] = buffer;
          }
        } catch (e) {
          console.error("Failed to bundle image:", filename, e);
        }
      })
    );
  }

  return fileMap;
}

const SYSTEM_FONTS = new Set([
  "system-ui",
  "sans-serif",
  "serif",
  "monospace",
  "cursive",
  "fantasy",
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Georgia",
  "Courier New",
  "Verdana",
  "Tahoma",
  "Trebuchet MS",
]);

function isSystemFont(name: string): boolean {
  return SYSTEM_FONTS.has(name);
}
