# Fix SaaS purple color + overlay button block selection

Story: (pending)
Agent: quick-fixer

## Context

SaaS theme uses blue (colorSuggestions[0] "Tech Blue" #2563eb) but the React preview hardcodes purple (#7c3aed). The floating sun/gear buttons in the iframe trigger block selection when clicked.

## What changes

| File | Change |
|---|---|
| `src/lib/premade-themes.ts` | In `generateBaseThemeJson`: for SaaS archetype, use `colorSuggestions[1]` (Startup Violet, primary #7c3aed) instead of `[0]`. In `generateDarkMode`: same change. Check if SaaS archetype by `arch.name` or `arch.keywords` containing "saas". |
| `src/components/TemplateProvider.tsx` | Add `data-no-select="true"` to the floating controls wrapper div at line 106. |
| `src/components/NativeIframeController.tsx` | In `isSelectable` function (line 34): also return false if `target.closest('[data-no-select]')` is truthy. This prevents any element inside the floating controls from triggering block selection. |

## Tasks

1. Read all three files
2. In premade-themes.ts: detect SaaS archetype and use index 1 for color palette
3. In TemplateProvider.tsx: add data-no-select to floating controls div
4. In NativeIframeController.tsx: update isSelectable to check for data-no-select

## Acceptance criteria

- SaaS theme.json has primary: "#7c3aed" (purple) not "#2563eb" (blue)
- SaaS dark mode has matching purple palette
- Clicking sun/gear buttons does NOT trigger "Native <div> Block selected"
- Clicking other elements in iframe still triggers block selection normally

## Verification

- `npx tsc --noEmit` passes (ignoring pre-existing errors)
