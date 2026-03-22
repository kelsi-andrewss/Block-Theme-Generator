# Switch targeted iterate to style.setProperty

Story: (pending)
Agent: quick-fixer

## Context

Targeted element edits use outerHTML replacement, which fails on complex CSS patterns (gradient text, background-clip). Switch to style.setProperty for style changes, preserving element structure. Keep outerHTML for content/structural changes.

## What changes

| File | Change |
|---|---|
| src/app/api/iterate/route.ts | New system prompt returning `{ styles: {...} }` for visual changes, `{ html: "...", textContent: "..." }` for content/structural. API detects mode from instruction. |
| src/app/app/page.tsx | handleSendMessage: send PATCH_STYLES (with styles map) instead of PATCH_ELEMENT for style responses. New undo type "style-props" storing previous inline values per data-iterate-id. |
| src/components/NativeIframeController.tsx | Add PATCH_STYLES handler: assigns data-iterate-id to selectedEl, calls style.setProperty for each prop (removeProperty if value is empty string). Add UNDO_STYLES handler: finds element by data-iterate-id, restores old property values. Keep PATCH_ELEMENT for content/structural changes. |
| src/components/ThemePreview.tsx | Same PATCH_STYLES and UNDO_STYLES handlers in the selection bridge script. |

## Tasks

1. Rewrite TARGETED_SYSTEM_PROMPT to return `{ styles: {...}, explanation }` for visual/style changes and `{ html: "...", explanation }` OR `{ textContent: "...", explanation }` for content/structural changes. Gemini decides which mode based on the instruction. Style keys are CSS property names (hyphenated), values are CSS values. Empty string means remove.
2. In page.tsx handleSendMessage targeted branch: check response for `styles` vs `html` vs `textContent` field. For `styles`: send PATCH_STYLES message. For `html`/`textContent`: keep existing PATCH_ELEMENT. For undo: new entry type `{ type: "style-props", iterateId: string, oldProps: Record<string, string> }`.
3. In NativeIframeController: add PATCH_STYLES handler — generate a unique iterate-id (counter), set `data-iterate-id` on selectedEl, read current inline values via `selectedEl.style.getPropertyValue(prop)` for each style key, apply new values via setProperty/removeProperty, post STYLE_SNAPSHOT back to parent with { iterateId, oldProps }. Add UNDO_STYLES handler — find element by `[data-iterate-id="X"]`, restore each prop, remove the data attribute if stack is empty for that element.
4. In ThemePreview selection bridge: same PATCH_STYLES and UNDO_STYLES handlers (vanilla JS version).

## Acceptance criteria

- "make pink" on a gradient-text span changes the gradient colors to pink shades
- "change text to Hello" on an element replaces the text content
- Undo restores previous style values without replacing the element
- Multiple sequential undos work correctly

## Verification

- Type check passes: `npx tsc --noEmit`
- Manual test: select gradient text span, "make pink" → gradient turns pink, undo restores original
