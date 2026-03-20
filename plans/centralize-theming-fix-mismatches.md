# Centralize theming: fix all 5 mismatches between iframe and WP output

Story: (pending)
Agent: quick-fixer

## Context

Three color systems (THEME_COLORS shades, wpLight/wpDark, archetypes colorSuggestions) define the same colors independently with different values, causing iframe preview and WP Playground to render different colors. This unifies them into one derivation flow.

## What changes

| File | Change |
|---|---|
| `src/lib/theme-colors.ts` | Remove `WpLightPalette`, `WpDarkPalette`, `wpLight`, `wpDark` interfaces and fields. Add `base: string`, `contrast: string`, `accent: string` to `ThemeColorSet` interface. Add these values to every theme's `lightColors` and `darkColors`. Light base="#ffffff", light contrast per-theme (use existing wpLight.text values: Nebula="#1e1b4b", Sunset="#1c1917", Forest/Ocean/Cherry/Midnight="#1e293b"), light accent="#10b981". Dark base="#09090b", dark contrast="#fafafa", dark accent="#10b981" for all themes. Export a helper `getWpPalette(theme: ThemeColor, isDark: boolean)` that returns `[{slug:"primary",color:colors.primary[500]},{slug:"secondary",color:colors.secondary[500]},{slug:"accent",color:colors.accent},{slug:"base",color:colors.base},{slug:"contrast",color:colors.contrast}]`. |
| `src/lib/premade-themes.ts` | Remove `DEFAULT_THEME`. `generateBaseThemeJson`: use `getWpPalette(THEME_COLORS[0], false)` for the light palette. `generateDarkModeStyles`: use `getWpPalette(THEME_COLORS[0], true)` for the dark palette. This ensures dark primary=#a855f7 (not #7e22ce) and dark secondary=#3b82f6 (not #1e1b4b). |
| `src/lib/packer/constants.ts` | Update `applyThemeOverrides`: import `getThemeById, getWpPalette` from theme-colors. When state is non-null, look up the active theme via `getThemeById(state.activeThemeId)`. If found, replace the ENTIRE palette array with `getWpPalette(theme, state.isDarkMode)` (with name fields added). This syncs ALL 5 slugs, not just primary/secondary. Remove the old `state.colors` primary/secondary patching. Keep the dark mode styles.color merge for background/text. Keep font overrides as-is. |
| `src/components/TemplateProvider.tsx` | No functional changes needed — it already sends activeThemeId and isDarkMode. Just verify the postMessage payload includes activeThemeId. |

## Tasks

1. Read all 4 files
2. Update theme-colors.ts: add base/contrast/accent to interface and all 6 themes, remove wpLight/wpDark, add getWpPalette helper
3. Update premade-themes.ts: use getWpPalette instead of wpLight/wpDark
4. Update packer/constants.ts applyThemeOverrides: full palette sync via getWpPalette
5. Verify TemplateProvider sends activeThemeId (read-only check)
6. Run `npx tsc --noEmit` to verify types

## Acceptance criteria

- THEME_COLORS has no wpLight/wpDark fields
- Every theme has base, contrast, accent in both lightColors and darkColors
- WP theme.json dark mode primary = darkColors.primary[500] (e.g., #a855f7 for Nebula, not #7e22ce)
- WP theme.json dark mode secondary = darkColors.secondary[500] (e.g., #3b82f6 for Nebula, not #1e1b4b)
- applyThemeOverrides syncs all 5 palette colors based on activeThemeId + isDarkMode
- TypeScript compiles

## Verification

- `npx tsc --noEmit` passes (ignoring pre-existing errors)
- `npx tsx -e "import { PREMADE_THEMES } from './src/lib/premade-themes'; const s = PREMADE_THEMES.find(t=>t.id==='saas'); console.log('Light:', JSON.stringify(s?.themeJson.settings?.color?.palette)); console.log('Dark:', JSON.stringify(s?.darkMode.settings?.color?.palette));"` shows matching primary/secondary values
