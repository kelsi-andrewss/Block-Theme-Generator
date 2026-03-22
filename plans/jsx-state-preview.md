# Add jsxPages state, inline JsxStringRenderer preview, on-demand transpile

Story: story-1044
Agent: architect

## Context

Replace the iframe-based preview (which reads from static JSX constants and loses changes on tab switch) with an inline JsxStringRenderer reading from mutable jsxPages React state. Downloads and playground previews transpile from this state on demand — one source of truth.

## What changes

| File | Change |
|---|---|
| `src/app/app/page.tsx` | Add `jsxPages` state (Record<string, string>). Init from JSX constants in handleSelectGalleryTheme. Replace iframe conditional branch with inline JsxStringRenderer reading jsxPages[activeSlug]. Derive activeSlug from activeFile via useMemo. Update iteration handler to mutate jsxPages. Update handleDownload and playground preview to transpile jsxPages on demand instead of reading result.themeFiles. |

## Frontend Design (Gemini)

### Widget Tree
```
Workbench (Home Component)
├── State: jsxPages {Record<string, string>}
├── State: activeFile
├── Derived: activeSlug (useMemo)
├── WorkbenchHeader
├── PreviewCanvas (when jsxPages is populated)
│   └── CSS Variable Bridge (scoped div)
│       └── JsxStringRenderer(jsxString=jsxPages[activeSlug])
└── IterationChat
    └── On success → setJsxPages(prev => ({ ...prev, [activeSlug]: newJsx }))
```

### Slug Mapping
| Slug | Source Constant | Active File |
|---|---|---|
| home | SAAS_JSX_SOURCE | front-page.html |
| header | SAAS_HEADER_JSX_SOURCE | parts/header.html |
| footer | SAAS_FOOTER_JSX_SOURCE | parts/footer.html |
| 404 | SAAS_404_JSX_SOURCE | 404.html |
| signup | SAAS_SIGNUP_JSX_SOURCE | pages/signup |
| pricing | SAAS_PRICING_JSX_SOURCE | pages/pricing |
| docs | SAAS_DOCS_JSX_SOURCE | pages/docs |
| contact | SAAS_CONTACT_JSX_SOURCE | pages/contact |

### Export Workflow (just-in-time transpilation)
At download/preview time, transpile each jsxPages entry to WP blocks:
- templates: front-page.html wraps home JSX with header/footer template-part refs
- parts: header.html/footer.html from header/footer JSX
- skeletonPages: signup/pricing/docs/contact from their JSX

### CSS Isolation
Wrap JsxStringRenderer in a scoped container div with TemplateProvider theming. The existing VAR_BRIDGE in JsxStringRenderer maps WP preset vars to local theme vars.

## Architecture (Claude)

- `jsxPages` is null when no gallery theme selected (generated themes still use ThemePreview path unchanged)
- When `jsxPages` is populated, the preview renders inline via JsxStringRenderer instead of iframe or ThemePreview
- `activeSlug` derived via useMemo: front-page.html→home, parts/X.html→X, pages/X→X, X.html→X
- For non-isolated pages (not header/footer), wrap the page JSX with header+footer JSX in the preview: render header JSX + page JSX + footer JSX as three consecutive JsxStringRenderer calls
- For isolated pages (header/footer), render only that component's JSX
- handleDownload: build themeFiles by transpiling jsxPages entries, then pass to buildThemeFileMap as before
- handlePreview (playground): same transpile-on-demand approach
- Selection bridge: JsxStringRenderer renders inline React elements — click-to-select can use standard React event delegation on the container instead of postMessage

<!-- CODER_ONLY -->
## Read-only context

- `src/components/JsxStringRenderer.tsx` — renderer component, VAR_BRIDGE mapping
- `src/app/templates/saas/jsx-sources.ts` — JSX source constants to import
- `src/components/TemplateProvider.tsx` — theming context provider
- `src/lib/generators/saas-template.ts` — transpileJSXToBlocks usage pattern
- `src/lib/transpiler/jsx-to-blocks.ts` — transpiler function
- `src/lib/packer/constants.ts` — buildThemeFileMap, ThemeFilesData interface
<!-- END_CODER_ONLY -->

<!-- CODER_ONLY -->
## Tasks

1. Import JSX source constants from jsx-sources.ts (SAAS_JSX_SOURCE, SAAS_HEADER_JSX_SOURCE, SAAS_FOOTER_JSX_SOURCE, SAAS_404_JSX_SOURCE, SAAS_SIGNUP_JSX_SOURCE, SAAS_PRICING_JSX_SOURCE, SAAS_DOCS_JSX_SOURCE, SAAS_CONTACT_JSX_SOURCE)
2. Import JsxStringRenderer and transpileJSXToBlocks
3. Add `jsxPages` state: `useState<Record<string, string> | null>(null)`
4. Add `activeSlug` useMemo derived from activeFile
5. In handleSelectGalleryTheme: initialize jsxPages from constants when theme.id === "saas"
6. Replace the iframe conditional branch (`themeSlug && themeSlug !== "generated-theme"`) with a jsxPages check: when jsxPages is populated, render inline JsxStringRenderer(s). For non-parts pages, render header + page + footer JSX. For parts, render just the part JSX. Wrap in TemplateProvider and a styled container div with the WP_VAR_BRIDGE CSS variables.
7. Update handleDownload: when jsxPages is populated, transpile each entry on the fly to build themeFiles, then pass to buildThemeFileMap
8. Update playground preview (handlePreview / the idb-keyval set): same transpile-on-demand approach
9. Update iteration handler (handleSendMessage): when jsxPages is populated and the iteration API returns updated content, update jsxPages[activeSlug] with the new JSX
<!-- END_CODER_ONLY -->

## Acceptance criteria

- Selecting a gallery SaaS theme renders the preview inline (no iframe) from jsxPages state
- Switching tabs preserves changes made via iteration — navigating away and back shows the modified content
- Downloading ZIP produces WP blocks transpiled from the current jsxPages state
- Playground preview uses transpiled jsxPages, not pre-built result.themeFiles
- Header/footer render in isolation when selected, other pages render with header+footer wrapping

## Verification

- Select SaaS template, iterate on a page, switch tabs, switch back — changes persist
- Download ZIP after iterating — verify the ZIP contains the iterated content
- Click "Preview in WordPress" — verify playground shows iterated content
