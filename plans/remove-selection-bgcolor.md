# Remove backgroundColor override from click selection handler

Story: story-1045
Agent: quick-fixer

## Context

Remove backgroundColor override from selection handler
Files: src/components/NativeIframeController.tsx

## What changes

| File | Change |
|---|---|
| `src/components/NativeIframeController.tsx` | Remove all `backgroundColor` lines from handleClick, CLEAR_SELECTION, and SET_MODE handlers — outline alone indicates selection |

<!-- CODER_ONLY -->
## Tasks

1. In handleClick: remove `selectedEl.style.backgroundColor = 'rgba(249, 115, 22, 0.1)';`
2. In handleClick (previous selection clear): remove `selectedEl.style.backgroundColor = '';`
3. In CLEAR_SELECTION handler: remove `selectedEl.style.backgroundColor = '';`
4. In SET_MODE handler: remove `selectedEl.style.backgroundColor = '';`
<!-- END_CODER_ONLY -->

## Acceptance criteria

- Selecting an element shows only an orange outline, no background color tint
- Clearing selection removes the outline without leaving residual styles
- Switching to browse mode clears selection without backgroundColor reset errors

## Verification

- Click elements in edit mode — only outline appears, no color change on the element
