# Block markup validation and design audit

Story: story-857
Agent: architect

## Context

Two validation systems:
1. **Block markup validator** — ensures generated markup is syntactically correct, uses only whitelisted core blocks, and contains zero Custom HTML blocks
2. **Design audit engine** — checks the generated theme.json against measurable design quality standards (WCAG, typography, spacing, color harmony) and produces a score 0-100

Design audit thresholds (from research):
- WCAG AA contrast: 4.5:1 normal text, 3:1 large text (18pt/24px+)
- Body font size: >= 16px minimum
- Type scale ratio: 1.125-1.618 range, must be consistent
- H1 >= 2x body size, heading levels differ by at least 1.25x
- Line height: 1.4-1.6 for body text
- Spacing: multiples of 4px or 8px
- Color palette: 3-15 unique colors
- Content width: <= 1440px

## What changes

| File | Change |
|---|---|
| src/lib/validation/block-validator.ts | `validateBlockMarkup(content: string): ValidationResult` — checks delimiter pairs, block name whitelist, JSON attributes, no wp:html |
| src/lib/validation/design-audit.ts | `auditThemeDesign(themeJson: ThemeJson): AuditResult` — checks contrast, typography, spacing, color harmony, produces score 0-100 |

## Contract

- `ValidationResult` type — `{ valid: boolean, errors: ValidationError[], warnings: ValidationWarning[] }`
- `ValidationError` type — `{ type: string, message: string, line?: number, block?: string }`
- `AuditResult` type — `{ score: number, checks: AuditCheck[], grade: 'A' | 'B' | 'C' | 'D' | 'F' }`
- `AuditCheck` type — `{ name: string, passed: boolean, severity: 'error' | 'warning' | 'info', message: string, details?: string }`
- `validateBlockMarkup(content: string): ValidationResult` — validates a single block markup file
- `auditThemeDesign(themeJson: ThemeJson): AuditResult` — audits theme.json design quality
- `getContrastRatio(color1: string, color2: string): number` — WCAG contrast ratio calculation
- `resolveColorValue(value: string, palette: PaletteEntry[]): string | null` — resolves `var:preset|color|slug` to hex
- `hexToRgb(hex: string): { r: number, g: number, b: number }` — color conversion
- `relativeLuminance(r: number, g: number, b: number): number` — WCAG luminance

## Tasks

1. Implement `validateBlockMarkup()` in `block-validator.ts`:
   - Parse block delimiters: regex match `<!-- wp:(\S+)(\s+(\{.*?\}))?\s*(\/)?-->` for opening/self-closing and `<!-- /wp:(\S+) -->` for closing
   - Check delimiter pairs: every opening block has a matching closing block (self-closing exempt)
   - Validate block names against CORE_BLOCK_NAMES whitelist
   - Check for `wp:html` — if found, add error
   - Validate JSON attributes in opening comments — must parse as valid JSON
   - Return ValidationResult with all errors and warnings
2. Implement `auditThemeDesign()` in `design-audit.ts`:
   - **Contrast check**: extract all text color + background color pairs from theme.json styles. Note: styles may use preset references like `"var:preset|color|primary"` — resolve these to hex values by looking up the slug in `settings.color.palette`. Calculate WCAG contrast ratio using relative luminance formula, check against 4.5:1 (normal) and 3:1 (large text)
   - **Typography check**: verify body font size >= 16px, check that font sizes follow a consistent modular scale, verify H1 >= 2x body, verify heading line height <= 1.2 and body line height >= 1.4
   - **Spacing check**: verify spacingSizes are multiples of 4px or 8px
   - **Color palette check**: count unique colors, verify 3-15 range
   - **Content width check**: verify contentSize and wideSize <= 1440px
   - **Heading hierarchy**: verify font sizes decrease from H1 through H6
3. Implement WCAG contrast ratio calculation:
   - `hexToRgb()`: parse hex color string to RGB
   - `relativeLuminance()`: (0.2126 * R + 0.7152 * G + 0.0722 * B) where R/G/B are linearized
   - `getContrastRatio()`: (L1 + 0.05) / (L2 + 0.05) where L1 > L2
4. Implement scoring:
   - Start at 100, deduct points per failing check
   - Contrast failure: -20 per failing pair
   - Typography failure: -10 per issue
   - Spacing failure: -5 per non-grid value
   - Color palette out of range: -10
   - Custom HTML block found: -30
   - Grade: A (90-100), B (80-89), C (70-79), D (60-69), F (<60)

## Acceptance criteria

- Given block markup with mismatched delimiters, when `validateBlockMarkup` is called, then errors include the mismatched block name
- Given block markup containing `<!-- wp:html -->`, when validated, then errors include a custom HTML violation
- Given a theme.json with white text (#ffffff) on white background (#ffffff), when audited, then contrast check fails
- Given a theme.json with 16px body and 32px H1, when audited, then typography checks pass
- Given a valid, well-designed theme.json, when audited, then score is >= 80

## Verification

- Unit test: block validator catches mismatched delimiters
- Unit test: block validator catches wp:html
- Unit test: contrast ratio calculation matches known values (black/white = 21:1)
- Unit test: scoring produces expected grades for known inputs
