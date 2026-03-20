# Unify header/footer rendering from JSX source strings via renderer

Story: story-932
Agent: quick-fixer

## Context

Eliminate duplicate header/footer markup in layout.tsx. Replace hand-written React nav/footer with JsxStringRenderer consuming SAAS_HEADER_JSX_SOURCE and SAAS_FOOTER_JSX_SOURCE — the same source strings the transpiler uses for WP blocks.

## What changes

| File | Change |
|---|---|
| `src/app/templates/saas/layout.tsx` | Remove hardcoded nav (lines 23-56) and footer (lines 63-124). Import JsxStringRenderer, SAAS_HEADER_JSX_SOURCE, SAAS_FOOTER_JSX_SOURCE. Replace nav with `<JsxStringRenderer jsxString={SAAS_HEADER_JSX_SOURCE} />` and footer with `<JsxStringRenderer jsxString={SAAS_FOOTER_JSX_SOURCE} />`. Keep TemplateProvider, NativeIframeController, Inter font, and outer div wrapper. |

<!-- CODER_ONLY -->
## Tasks

1. Import JsxStringRenderer from `@/components/JsxStringRenderer` and SAAS_HEADER_JSX_SOURCE, SAAS_FOOTER_JSX_SOURCE from the saas page module.
2. Delete the entire `<nav>` block (lines 23-56) and replace with `<JsxStringRenderer jsxString={SAAS_HEADER_JSX_SOURCE} />`.
3. Delete the entire `<footer>` block (lines 63-124) and replace with `<JsxStringRenderer jsxString={SAAS_FOOTER_JSX_SOURCE} />`.
4. Keep the `<main>` wrapper with `{children}` between header and footer.
5. Verify the layout structure preserves: TemplateProvider wrapper, NativeIframeController, Inter font, outer div with bg/color vars.
<!-- END_CODER_ONLY -->

## Acceptance criteria

- Given the SaaS template preview loads, when inspecting the header, then it renders from SAAS_HEADER_JSX_SOURCE (not hardcoded React)
- Given the SaaS template preview loads, when inspecting the footer, then it renders from SAAS_FOOTER_JSX_SOURCE (not hardcoded React)
- Given layout.tsx is read, then no hand-written nav or footer markup exists — only JsxStringRenderer calls
- Given the preview renders, then visual output is identical to the previous hardcoded version

## Verification

- Preview loads without errors
- Header/footer visually unchanged
- No duplicate markup in layout.tsx

<!-- TESTER_ONLY -->
<!-- END_TESTER_ONLY -->
