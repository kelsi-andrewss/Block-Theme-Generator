# PostMessage-based iframe hot-swap

Story: story-1080
Agent: architect
Depends: story-1076 (data-uid injection) | Blocks: story-1079

## Context

Today, the iteration pipeline targets elements via a `selectedEl` variable — a live DOM reference held inside the iframe's closure. This works for single-shot style patches but breaks in two critical scenarios: (1) when PATCH_CONTENT or PATCH_ELEMENT replaces DOM subtrees, the reference becomes stale and subsequent patches silently fail, and (2) when the iframe remounts (navigation, blob URL change), all references are lost entirely. Both problems compound when JSX-level iteration writes back updated HTML — there's no way to surgically update one element without nuking the whole page.

Story-1076 adds deterministic `data-uid` attributes to every rendered element (`{tag}-{depth}-{siblingIndex}`). With UIDs in the DOM, element targeting becomes a selector lookup (`[data-uid="div-0-2"]`) rather than a fragile closure variable. This makes targeting survive DOM replacements and iframe remounts.

The hot-swap handler (`HOT_SWAP_ELEMENT`) is the key new capability: the parent sends an updated HTML subtree keyed by `data-uid`, and the iframe replaces just that element. This is what enables source-driven iteration (story-1079) — Gemini modifies the JSX, the transpiler re-renders one subtree, and the iframe swaps it in without a full reload.

## What changes

| File | Change |
|---|---|
| `src/components/NativeIframeController.tsx` | Extract `data-uid` from clicked elements and include it in the `BLOCK_SELECTED` payload. Update `PATCH_STYLES` and `PATCH_ELEMENT` to find elements via `[data-uid]` selector first, falling back to `selectedEl` for backward compat. Add `HOT_SWAP_ELEMENT` message handler. |
| `src/components/ThemePreview.tsx` | Mirror all NativeIframeController changes in the `SELECTION_BRIDGE_SCRIPT`: include `data-uid` in `BLOCK_SELECTED`, add UID-based lookups to `PATCH_STYLES`/`PATCH_ELEMENT`, add `HOT_SWAP_ELEMENT` handler. |

<!-- CODER_ONLY -->
## Read-only context

- `src/components/JsxStringRenderer.tsx` — Generates deterministic `data-uid` attributes via `generateUid(tag, depth, siblingIndex)` (story-1076). Format: `"{tag}-{depth}-{siblingIndex}"`. Every JSXElement in the rendered tree carries one.
- `src/app/app/page.tsx` — Parent that sends postMessage commands and receives `BLOCK_SELECTED`. Will need to thread `uid` through to iteration logic in a follow-up (story-1079), but this story only changes the iframe-side handlers.
<!-- END_CODER_ONLY -->

## Contract

### Updated message: `BLOCK_SELECTED` (iframe -> parent)

```typescript
// Previously:
{ type: 'BLOCK_SELECTED', payload: { blockId, blockName, content, html } }

// Now:
{ type: 'BLOCK_SELECTED', payload: { blockId, blockName, content, html, uid: string | null } }
// uid is the data-uid attribute value, or null if the element has no data-uid (e.g., elements not rendered via JsxStringRenderer)
```

### Updated message: `PATCH_STYLES` (parent -> iframe)

```typescript
// No change to the message shape. Behavioral change:
// 1. If selectedEl has a data-uid, look up via document.querySelector('[data-uid="..."]') first
// 2. Fall back to selectedEl reference if no uid or selector miss
// This makes the handler robust to DOM replacements between selection and patch
```

### Updated message: `PATCH_ELEMENT` (parent -> iframe)

```typescript
// Existing shape plus optional uid field:
{ type: 'PATCH_ELEMENT', html: string, uid?: string }
// If uid is provided, target is found via [data-uid] selector (selectedEl not required)
// If uid is absent, falls back to selectedEl (backward compat)
```

### New message: `HOT_SWAP_ELEMENT` (parent -> iframe)

```typescript
/**
 * Replace a specific element identified by data-uid with new HTML.
 * Does NOT require or affect the selection state (selectedEl/sel).
 * Used for source-driven updates where the parent re-transpiled a JSX subtree.
 */
{ type: 'HOT_SWAP_ELEMENT', uid: string, html: string }
// Finds element via document.querySelector('[data-uid="<uid>"]')
// Replaces its outerHTML with the provided html
// Posts HOT_SWAP_ACK back to parent on success, HOT_SWAP_FAIL on miss
```

### Ack/fail messages: `HOT_SWAP_ACK` / `HOT_SWAP_FAIL` (iframe -> parent)

```typescript
{ type: 'HOT_SWAP_ACK', uid: string }
{ type: 'HOT_SWAP_FAIL', uid: string, reason: 'NOT_FOUND' }
```

<!-- CODER_ONLY -->
## Tasks

1. **NativeIframeController — BLOCK_SELECTED uid extraction.** In `handleClick`, after capturing `cleanHtml`, read `target.getAttribute('data-uid')`. Include it as `uid` in the `BLOCK_SELECTED` payload (null if absent).

2. **NativeIframeController — UID-based element resolution helper.** Add a `resolveEl(uid?: string | null): HTMLElement | null` helper inside the `useEffect` closure. Logic: if `uid` is truthy, try `document.querySelector<HTMLElement>(\`[data-uid="${uid}"]\`)` and return it if found; otherwise return `selectedEl`. This centralizes the fallback pattern.

3. **NativeIframeController — PATCH_STYLES uid targeting.** Before applying styles, resolve the target via `resolveEl(selectedEl?.getAttribute('data-uid'))`. Use this resolved reference instead of bare `selectedEl` for all style operations within the handler. Keep the `selectedEl` null-check as the gate (don't apply styles if nothing is selected).

4. **NativeIframeController — PATCH_ELEMENT uid targeting.** Accept optional `event.data.uid`. Resolve target via `resolveEl(event.data.uid)`, falling back to `selectedEl`. Replace `outerHTML` on the resolved element. This decouples PATCH_ELEMENT from selection state when a uid is provided.

5. **NativeIframeController — HOT_SWAP_ELEMENT handler.** Add a new `if` block for `event.data.type === 'HOT_SWAP_ELEMENT'`. Extract `uid` and `html` from `event.data`. Query `document.querySelector<HTMLElement>(\`[data-uid="${uid}"]\`)`. If found, set `el.outerHTML = html` and post `HOT_SWAP_ACK` to parent. If not found, post `HOT_SWAP_FAIL` with reason `'NOT_FOUND'`. This handler must not touch `selectedEl` or `highlightedEl`.

6. **ThemePreview SELECTION_BRIDGE_SCRIPT — BLOCK_SELECTED uid extraction.** In the click handler, after capturing `cleanHtml`, read `t.getAttribute('data-uid')`. Include it in the `BLOCK_SELECTED` payload as `uid` (null if absent).

7. **ThemePreview SELECTION_BRIDGE_SCRIPT — UID-based resolution helper.** Add a `resolveEl(uid)` function inside the IIFE. Logic mirrors task 2 but in vanilla JS: if uid is truthy, try `document.querySelector('[data-uid="' + uid + '"]')`, return it or fall back to `sel`.

8. **ThemePreview SELECTION_BRIDGE_SCRIPT — PATCH_STYLES uid targeting.** Mirror the NativeIframeController change: resolve target via `resolveEl(sel ? sel.getAttribute('data-uid') : null)` before applying styles.

9. **ThemePreview SELECTION_BRIDGE_SCRIPT — PATCH_ELEMENT uid targeting.** Accept `e.data.uid`, resolve via `resolveEl(e.data.uid)`, fall back to `sel`. Replace `outerHTML` on resolved element.

10. **ThemePreview SELECTION_BRIDGE_SCRIPT — HOT_SWAP_ELEMENT handler.** Add handler for `HOT_SWAP_ELEMENT` message type. Query by `[data-uid]`, swap `outerHTML`, post ack/fail back to parent. Must not touch `hl` or `sel`.
<!-- END_CODER_ONLY -->

## Acceptance criteria

- Given a rendered page where elements have `data-uid` attributes, when clicking an element in the iframe, then the `BLOCK_SELECTED` message payload includes `uid` matching the element's `data-uid` value.
- Given an element without a `data-uid` attribute (e.g., raw HTML not from JsxStringRenderer), when clicking it, then the `BLOCK_SELECTED` payload has `uid: null` and all other fields are unchanged.
- Given a selected element with `data-uid="p-1-0"`, when `PATCH_STYLES` is sent after the element's DOM node has been replaced (e.g., by a prior `PATCH_CONTENT`), then the handler finds the element via `[data-uid="p-1-0"]` and applies styles successfully.
- Given a `PATCH_ELEMENT` message with `uid: "div-0-2"` and no prior selection, when the iframe receives it, then the element matching `[data-uid="div-0-2"]` is replaced with the provided HTML.
- Given a `PATCH_ELEMENT` message without a `uid` field, when the iframe receives it, then the handler falls back to `selectedEl` (backward compatibility preserved).
- Given a `HOT_SWAP_ELEMENT` message with `uid: "section-1-0"` and valid HTML, when the iframe receives it, then only that element's outerHTML is replaced, the rest of the page DOM is untouched, and the parent receives `HOT_SWAP_ACK`.
- Given a `HOT_SWAP_ELEMENT` message with a uid that doesn't exist in the DOM, when the iframe receives it, then the parent receives `HOT_SWAP_FAIL` with reason `'NOT_FOUND'` and no DOM mutation occurs.
- Given an element is selected (outline visible) and a `HOT_SWAP_ELEMENT` targets a different element, when the swap completes, then the selection outline on the originally selected element is preserved.

## Verification

- `npm run build` passes with no type errors.
- In the browser, click an element in the SaaS preview iframe. Open the browser console and verify the `BLOCK_SELECTED` message includes a `uid` field (use `window.addEventListener('message', e => console.log(e.data))` in the parent frame).
- Use the console to manually send `iframe.contentWindow.postMessage({ type: 'HOT_SWAP_ELEMENT', uid: '<pick a uid from DOM>', html: '<div data-uid="..." style="background:red">swapped</div>' }, '*')`. Verify only that element changes and the rest of the page is intact.
- Send a `HOT_SWAP_ELEMENT` with a bogus uid. Verify `HOT_SWAP_FAIL` is posted back and nothing in the DOM changes.
- Select an element, trigger a `PATCH_CONTENT` (which replaces `document.body.innerHTML`), then send `PATCH_STYLES` — verify the style is applied to the correct element via uid lookup despite the original `selectedEl` reference being dead.

<!-- TESTER_ONLY -->
<!-- END_TESTER_ONLY -->
