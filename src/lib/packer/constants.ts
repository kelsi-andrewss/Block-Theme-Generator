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
