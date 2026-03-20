# Replace Math.random block IDs with deterministic content-based hashing

Story: story-951
Agent: quick-fixer

## Context

`NativeIframeController.tsx` generates block IDs using `Math.random()` (line 93). These are non-deterministic — clicking the same element twice produces different IDs, breaking any state tracking by the parent IDE. Replace with a deterministic hash based on element tag + position in DOM.

## What changes

| File | Change |
|---|---|
| `src/components/NativeIframeController.tsx` | Replace `blockName + '-' + Math.random().toString(36).substr(2, 9)` (line 93) with a deterministic ID based on the element's tag name and DOM path (e.g., nth-child indices up to 3 levels). |

<!-- CODER_ONLY -->
## Tasks

1. Add a `getBlockId(el: HTMLElement): string` helper inside the useEffect that computes a deterministic ID from the element's tag and DOM position. Use a simple approach: walk up 3 ancestors, collecting `tagName + indexOf(child)` at each level, join with `-`.
2. Replace the `Math.random()` ID generation on line 93 with `getBlockId(target)`.
<!-- END_CODER_ONLY -->

## Acceptance criteria

- Given the same element is clicked twice, when the BLOCK_SELECTED message is sent, then the blockId is identical both times
- Given two different elements are clicked, then their blockIds are different

## Verification

- Build passes
- Click-to-select still highlights and reports elements correctly

<!-- TESTER_ONLY -->
<!-- END_TESTER_ONLY -->
