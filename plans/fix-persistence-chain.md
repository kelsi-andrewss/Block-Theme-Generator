# Fix persistence chain — inject UIDs into JSX source

Story: (pending)
Agent: quick-fixer

## Context

The AST mutator finds elements by `data-uid` attribute in the JSX source, but source strings have no UIDs — they're only injected at render time by JsxStringRenderer. Every edit intent is silently skipped, nothing persists. Additionally, PATCH_STYLES requires `selectedEl` and ignores the `uid` field from the message, breaking uid-targeted style edits.

## What changes

| File | Change |
|---|---|
| `src/lib/transpiler/ast-mutator.ts` | Add exported `injectUids(source: string): string` that parses JSX with recast, walks the AST injecting `data-uid="{tag}-{depth}-{siblingIndex}"` on every JSXElement, returns modified source. Uses same positional scheme as JsxStringRenderer. |
| `src/app/app/page.tsx` | In `handleSelectGalleryTheme`, run each JSX string through `injectUids()` before writing to state/IDB (lines 645-656). |
| `src/components/JsxStringRenderer.tsx` | Line 219: only set `reactProps["data-uid"]` if `rawProps["data-uid"]` is not already set. Preserves source-injected UIDs. |
| `src/components/NativeIframeController.tsx` | PATCH_STYLES handler (line 33): use `resolveEl(event.data.uid)` when `event.data.uid` is present, fall back to `resolveEl(selectedEl?.getAttribute('data-uid'))`. Remove the `selectedEl` requirement from the gate condition. |
| `src/components/ThemePreview.tsx` | Mirror the PATCH_STYLES fix in SELECTION_BRIDGE_SCRIPT (line 101): same uid-from-message-first pattern. |

## Tasks

1. In `ast-mutator.ts`, add `injectUids(source)`:
   - Parse with recast (same parser config as `applyAstMutation`)
   - Traverse with `@babel/traverse`, track depth via enter/exit on JSXElement
   - Track sibling index per parent (reset on each new parent, increment only for JSXElement children)
   - For each JSXOpeningElement: skip if `data-uid` already exists, otherwise add `t.jsxAttribute(t.jsxIdentifier('data-uid'), t.stringLiteral(generateUid(tagName, depth, siblingIndex)))`
   - Tag name: resolve from JSXIdentifier (lowercase = tag name, uppercase = 'div' fallback matching JsxStringRenderer's resolveTag convention)
   - JSXFragment: do NOT add uid, do NOT consume depth level (matches JsxStringRenderer behavior)
   - Return `recast.print(ast).code`

2. In `page.tsx` `handleSelectGalleryTheme`, import `injectUids` from ast-mutator. Change lines 645-653 to run each value through `injectUids()`:
   ```
   const pages = {
     home: injectUids(SAAS_JSX_SOURCE),
     header: injectUids(SAAS_HEADER_JSX_SOURCE),
     ...
   };
   ```

3. In `JsxStringRenderer.tsx` line 219, change:
   ```
   reactProps["data-uid"] = generateUid(resolved, depth, siblingIndex);
   ```
   To:
   ```
   if (!rawProps["data-uid"]) {
     reactProps["data-uid"] = generateUid(resolved, depth, siblingIndex);
   }
   ```

4. In `NativeIframeController.tsx` line 33, change:
   ```
   if (event.data.type === 'PATCH_STYLES' && event.data.styles && selectedEl) {
   ```
   To:
   ```
   if (event.data.type === 'PATCH_STYLES' && event.data.styles && (selectedEl || event.data.uid)) {
   ```
   And line 35, change:
   ```
   const target = resolveEl(selectedEl.getAttribute('data-uid'));
   ```
   To:
   ```
   const target = resolveEl(event.data.uid || selectedEl?.getAttribute('data-uid'));
   ```

5. In `ThemePreview.tsx` SELECTION_BRIDGE_SCRIPT line 101, same pattern:
   ```
   if (e.data.type === 'PATCH_STYLES' && e.data.styles && (sel || e.data.uid)) {
   ```
   And line 104:
   ```
   var target = resolveEl(e.data.uid || (sel ? sel.getAttribute('data-uid') : null));
   ```

## Acceptance criteria

- Given the SaaS template is selected, when inspecting `jsxPages` state or IDB `"jsx-pages"`, then every JSX element in every page source has a `data-uid` attribute.
- Given a user clicks an element and sends a style edit, when the API returns `{ edits: [{kind: "style", uid: "div-0-1", ...}] }`, then the DOM element is visually updated AND the JSX source in IDB contains the style change on the element with matching `data-uid`.
- Given a style edit targets a uid different from the currently selected element, when PATCH_STYLES is sent with that uid, then the correct element is styled (not the selected one).
- Given JSX source already has `data-uid` attributes (from IDB), when rendered through JsxStringRenderer, then the rendered elements preserve the source UIDs (not overwritten by positional recalculation).

## Verification

- Select SaaS template. DevTools > Application > IndexedDB > keyval-store > "jsx-pages". Inspect any page value — every element should have `data-uid="tag-depth-index"`.
- Click a heading, type "make it red". Check IDB after — the heading's JSX should have `style={{color: "..."}}` or similar.
- Reload page, select SaaS again. The previously edited heading should reflect the change (hydrated from IDB).
- `npx tsc --noEmit` passes.
