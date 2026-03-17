# ZIP packaging and theme assembly

Story: story-858
Agent: architect

## Context

Assemble all generated files into a valid WordPress block theme directory structure and package as a downloadable ZIP. The style.css and functions.php files are generated deterministically (no AI) from the theme.json data.

WordPress block theme structure:
```
theme-name/
├── style.css           (required — theme registration metadata)
├── theme.json          (global settings/styles)
├── functions.php       (font enqueuing, minimal setup)
├── templates/
│   ├── index.html
│   ├── single.html
│   ├── page.html
│   ├── archive.html
│   ├── 404.html
│   ├── search.html
│   └── front-page.html
├── parts/
│   ├── header.html
│   └── footer.html
├── patterns/
│   ├── hero.php
│   └── ...
├── styles/
│   └── dark.json
└── README.txt
```

## What changes

| File | Change |
|---|---|
| src/lib/packer/zip.ts | `packageTheme(themeFiles: ThemeFiles): Promise<Blob>` — uses JSZip to create ZIP archive with correct directory structure |
| src/lib/packer/constants.ts | `generateStyleCss(themeName, description, version): string`, `generateFunctionsPHP(themeName, fonts): string`, `generateReadmeTxt(themeName, description): string` — deterministic file generators |

## Contract

- `ThemeFiles` type — `{ themeJson: string, darkMode: string, templates: Map<string, string>, parts: Map<string, string>, patterns: Map<string, string>, meta: ThemeMeta }`
- `ThemeMeta` type — `{ name: string, slug: string, description: string, version: string, fontFamilies?: string[] }`
- `packageTheme(themeFiles: ThemeFiles): Promise<Blob>` — returns ZIP blob
- `generateStyleCss(meta: ThemeMeta): string` — generates style.css with header comment
- `generateFunctionsPHP(meta: ThemeMeta): string` — generates functions.php for font enqueuing
- `generateReadmeTxt(meta: ThemeMeta): string` — generates README.txt with install instructions

## Tasks

1. Implement `generateStyleCss()` — WordPress theme header comment:
   ```css
   /*
   Theme Name: {name}
   Description: {description}
   Version: {version}
   Requires at least: 6.6
   Tested up to: 6.7
   Requires PHP: 7.4
   License: GNU General Public License v2 or later
   License URI: http://www.gnu.org/licenses/gpl-2.0.html
   Text Domain: {slug}
   */
   ```
2. Implement `generateFunctionsPHP()`:
   - If theme uses Google Fonts: enqueue them via `wp_enqueue_style`
   - If no external fonts: minimal functions.php with just text domain setup
   - Always include: `add_action('after_setup_theme', function() { add_theme_support('wp-block-styles'); })`
3. Implement `generateReadmeTxt()` — installation instructions for the downloaded theme
4. Implement `packageTheme()`:
   - Create JSZip instance
   - Add `style.css` at root
   - Add `theme.json` at root
   - Add `functions.php` at root
   - Add templates to `templates/` folder
   - Add parts to `parts/` folder
   - Add patterns to `patterns/` folder
   - Add dark mode to `styles/dark.json`
   - Add `README.txt` at root
   - Generate ZIP blob with `zip.generateAsync({ type: 'blob' })`
   - All files in a root directory named after the theme slug

## Acceptance criteria

- Given a complete set of theme files, when `packageTheme` is called, then a Blob is returned that contains all files in the correct directory structure
- Given the generated ZIP, when extracted, then `style.css` is at the root and contains the Theme Name header
- Given the generated ZIP, when extracted, then `templates/index.html` exists
- Given a theme using Google Fonts, when `generateFunctionsPHP` is called, then it includes wp_enqueue_style for the font URL
- Given the generated ZIP, when installed on WordPress 6.6+, then the theme activates without errors

## Verification

- Unit test: generateStyleCss produces valid header comment
- Unit test: packageTheme creates ZIP with correct file paths
- Unit test: ZIP contains all expected directories (templates/, parts/, patterns/, styles/)
