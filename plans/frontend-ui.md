# Frontend UI

Story: story-859
Agent: quick-fixer

## Context

The main user-facing page. A single-page app with four sections that guide the user through: describe → refine → generate → audit+download. Built with React + Tailwind CSS in the Next.js App Router.

Key UX principles (from research):
- Starter templates prevent "blank canvas" paralysis
- Named design styles (neobrutalist, editorial, cinematic) > vague adjectives
- Gap analysis helps users produce better prompts
- Real-time progress keeps users engaged during 2-min generation
- Design audit score gives confidence in the output quality

## What changes

| File | Change |
|---|---|
| src/app/page.tsx | Main page component — orchestrates the four-section flow, manages state, calls API route |
| src/app/api/generate/route.ts | POST API route — orchestrates full generation pipeline: enrich → theme.json → templates → parts → patterns → validate → audit → package. Returns ZIP blob + audit results |
| src/components/GeneratorForm.tsx | Smart input form — textarea, archetype selector chips, style chips, starter template picker, gap analysis display |
| src/components/AuditResults.tsx | Design audit results — score circle, pass/fail checks, severity indicators, findings list |
| src/components/ProgressIndicator.tsx | Generation progress — step-by-step indicator showing which phase is active (theme.json → templates → patterns → validation) |

## Frontend Design

### Layout
- Single column, max-width 800px, centered
- Four sections stacked vertically: Input → Refinement → Progress → Results
- Results section contains: audit score, preview, download

### Input Section (GeneratorForm)
- Large textarea (min 3 rows) for free-form description
- Below textarea: row of archetype chips (Portfolio, SaaS, Blog, Restaurant, etc.) — click to select
- Below chips: row of style chips (Editorial, Cinematic, Neobrutalist, Minimal, etc.) — click to select
- "Or start from a template" expandable section with 8 starter templates as cards
- Gap analysis panel (appears after typing): shows which dimensions are specified vs missing, with suggestions
- Generate button (full width, prominent)

### Progress Section (ProgressIndicator)
- Vertical stepper: theme.json → Templates → Patterns → Validation → Packaging
- Each step shows: name, status (pending/active/done/error), duration
- Active step has a spinner animation

### Results Section
- Score circle (large, centered) — 0-100 with grade letter
- Grid of audit checks below — pass/fail with severity colors
- Two action buttons: Download ZIP, Preview in WordPress

### Component Architecture
- page.tsx manages: step state (input/generating/results), form data, generation results, audit results
- GeneratorForm: controlled form, emits enriched prompt data on submit
- ProgressIndicator: receives current step + step statuses
- AuditResults: receives AuditResult, renders score + checks

## Architecture

- State: React useState for form data, generation step, results. No global state needed.
- API call: `POST /api/generate` with `{ description, archetype?, style?, starterTemplate? }` — returns `{ themeZip: base64, auditResult, themeFiles }`
- The API route needs to be created as part of this story: `src/app/api/generate/route.ts`
- API route orchestrates: enrichment → theme.json → templates → parts → patterns → validation → audit → packaging

## Tasks

1. Create `src/app/api/generate/route.ts`:
   - POST handler that receives user input
   - Orchestrates the full pipeline: enrich → generateThemeJson → generateTemplates → generateParts → generatePatterns → validateAll → audit → package
   - Returns JSON with base64-encoded ZIP, audit results, and generation metadata
   - Streams progress updates via response headers or chunked response
2. Build `GeneratorForm.tsx`:
   - Textarea with placeholder text showing an example prompt
   - Archetype chips: 8 options, single-select, highlight selected
   - Style chips: named design styles, single-select
   - Starter templates: expandable grid of 8 cards, clicking one fills the textarea
   - Gap analysis: analyzes input on debounced change (300ms), shows missing dimensions with suggestions
   - Submit button: "Generate Theme" — disabled until textarea has content
3. Build `ProgressIndicator.tsx`:
   - 6 steps: Enriching → Theme.json → Templates → Parts → Patterns → Packaging
   - Each step: icon, label, status badge (pending/active/done/error)
   - Active step has animated spinner
   - Shows elapsed time per completed step
4. Build `AuditResults.tsx`:
   - Score circle: large number with grade letter, color-coded (green A/B, yellow C, red D/F)
   - Checks grid: 2 columns, each check is a row with pass/fail icon + name + message
   - Expandable details for failed checks
   - Download button: triggers blob download with theme slug as filename
   - Preview button: opens WordPress Playground (connects to story-860)
5. Wire it all together in `page.tsx`:
   - Step 1 (input): show GeneratorForm
   - Step 2 (generating): show ProgressIndicator, hide form
   - Step 3 (results): show AuditResults + download + preview

## Acceptance criteria

- Given the page loads, when the user sees the form, then archetype chips and style chips are visible and clickable
- Given a starter template is clicked, when it fills the textarea, then the gap analysis updates
- Given the generate button is clicked, when generation starts, then the progress indicator appears showing step-by-step progress
- Given generation completes, when results are shown, then the audit score and download button are visible
- Given the download button is clicked, when triggered, then a .zip file downloads with the theme name as filename

## Verification

- Manual test: full flow from input to download
- Visual test: responsive layout on mobile and desktop widths
