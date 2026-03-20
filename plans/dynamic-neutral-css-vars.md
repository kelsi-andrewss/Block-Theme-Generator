# Add all neutral CSS variables to THEME_COLORS and set dynamically

Story: (pending)
Agent: quick-fixer

## Context

CSS neutral variables (--color-bg, --color-text, --color-text-muted, etc.) are static in globals.css. They need to be dynamic per-theme to match WP theme.json palette values, especially base and contrast which differ per theme.

## What changes

| File | Change |
|---|---|
| `src/lib/theme-colors.ts` | Add neutral fields to ThemeColorSet: bgSecondary, bgTertiary, textMuted, textSecondary, border, borderSubtle, bgCard, borderCard (base, contrast, accent already exist). Add values to all 6 themes' lightColors and darkColors. Light neutrals same for all: bgSecondary=#f4f4f5, bgTertiary=#e4e4e7, textMuted=#71717a, textSecondary=#52525b, border=#e4e4e7, borderSubtle=#f4f4f5, bgCard=rgba(255,255,255,0.8), borderCard=rgba(0,0,0,0.1). Dark neutrals same for all: bgSecondary=#18181b, bgTertiary=#27272a, textMuted=#a1a1aa, textSecondary=#d4d4d8, border=rgba(255,255,255,0.05), borderSubtle=rgba(255,255,255,0.02), bgCard=rgba(39,39,42,0.5), borderCard=rgba(63,63,70,0.5). |
| `src/components/TemplateProvider.tsx` | In applyCssVars: add setProperty calls for --color-bg (colors.base), --color-text (colors.contrast), --color-bg-secondary (colors.bgSecondary), --color-bg-tertiary (colors.bgTertiary), --color-text-muted (colors.textMuted), --color-text-secondary (colors.textSecondary), --color-border (colors.border), --color-border-subtle (colors.borderSubtle), --color-bg-card (colors.bgCard), --color-border-card (colors.borderCard). |
| `src/app/globals.css` | Remove ALL static neutral variable definitions from :root and .dark selectors (--color-bg, --color-bg-secondary, --color-bg-tertiary, --color-text, --color-text-muted, --color-text-secondary, --color-border, --color-border-subtle, --color-bg-card, --color-border-card). Keep: @import tailwindcss, @theme inline block, @media prefers-color-scheme, body styles, @custom-variant dark line, and the comment about theme vars being set by JS. |

## Tasks

1. Read all 3 files
2. Add neutral fields to ThemeColorSet interface in theme-colors.ts
3. Add neutral values to all 6 themes' lightColors and darkColors
4. Add 10 setProperty calls to applyCssVars in TemplateProvider.tsx
5. Remove static neutral vars from globals.css :root and .dark
6. Run `npx tsc --noEmit` to verify types

## Acceptance criteria

- Zero static --color-bg/--color-text/etc. definitions in globals.css
- All 10 neutral vars set dynamically by applyCssVars
- Every theme in THEME_COLORS has all neutral fields in both light and dark
- TypeScript compiles

## Verification

- `npx tsc --noEmit` passes
- grep -c 'color-bg:' src/app/globals.css returns 0
