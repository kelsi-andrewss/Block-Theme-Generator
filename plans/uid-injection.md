# Stable UID injection at transpile time

Story: story-1076
Agent: architect

## Context

The iteration pipeline needs to map a clicked DOM element back to its source AST node so edits can target the correct JSX subtree. Today, `NativeIframeController` computes a DOM-position-based `getBlockId` at click time, but there is no corresponding ID on the rendered output from `JsxStringRenderer`. This story injects a `data-uid` attribute into every element during `astToReact` traversal, using a deterministic scheme based on tag name, tree depth, and sibling index. With matching UIDs on both sides, story-1080 (PostMessage iframe hot-swap) can correlate DOM clicks to AST nodes without fragile HTML string matching.

## What changes

| File | Change |
|---|---|
| `src/components/JsxStringRenderer.tsx` | Add `generateUid(tag, depth, siblingIndex)` helper. Refactor `astToReact` to accept a depth + sibling-index context parameter, call `generateUid` for each JSX element, and inject the result as a `data-uid` prop alongside the existing React `key`. |

<!-- CODER_ONLY -->
## Read-only context

These files inform the implementation but should not be modified:
- `src/components/NativeIframeController.tsx` — Contains `getBlockId(el)` which computes DOM-position IDs at click time. The UID scheme here must produce values that can be correlated with `getBlockId` output (both use tag + positional ancestry). Understanding this contract is critical.
<!-- END_CODER_ONLY -->

## Contract

```typescript
/**
 * Generate a deterministic UID from tag name and tree position.
 * Format: "{tag}-{depth}-{siblingIndex}" (e.g., "div-0-0", "p-1-2", "span-2-0").
 * Pure function — same inputs always produce the same output.
 */
function generateUid(tag: string, depth: number, siblingIndex: number): string;

/**
 * Convert a Babel AST node to a React element tree.
 * Now accepts optional positional context for UID generation.
 * Every JSXElement in the output carries a `data-uid` attribute.
 *
 * @param node - Babel AST node
 * @param depth - Current nesting depth (0 = root). Default: 0
 * @param siblingIndex - Index among JSX element siblings at this level. Default: 0
 */
function astToReact(
  node: t.Node,
  depth?: number,
  siblingIndex?: number
): React.ReactNode;
```

Both functions remain module-private (not exported). The public API (`JsxStringRenderer` component props) is unchanged.

<!-- CODER_ONLY -->
## Tasks

1. Add `generateUid(tag: string, depth: number, siblingIndex: number): string` above `astToReact`. Implementation: return `` `${tag}-${depth}-${siblingIndex}` ``. No hashing — the positional triple is already unique within a single JSX tree and human-readable for debugging.

2. Change the `astToReact` signature to `astToReact(node: t.Node, depth: number = 0, siblingIndex: number = 0): React.ReactNode`. The existing call sites (the `useMemo` body and recursive children mapping) must pass these through.

3. Inside the `isJSXElement` branch of `astToReact`, after building `reactProps`, add: `reactProps["data-uid"] = generateUid(resolved, depth, siblingIndex)`.

4. Update the children mapping to pass positional context. Replace the current `.map((c) => astToReact(c))` with a mapping that tracks a separate element-sibling counter (increment only for JSXElement nodes, skip text/expression nodes) and passes `depth + 1` and the element-sibling index to recursive calls. Non-element nodes (JSXText, JSXExpressionContainer) receive the parent's depth and index 0 since they don't produce `data-uid` themselves.

5. In the `isJSXFragment` branch, apply the same sibling-index-aware mapping so fragments don't break the positional chain.

6. For the `isJSXExpressionContainer` branch that creates a `<span>` with `dangerouslySetInnerHTML`: inject `"data-uid": generateUid("span", depth, siblingIndex)` alongside the existing `key` prop so inline HTML expressions are also addressable.
<!-- END_CODER_ONLY -->

## Acceptance criteria

- Given any valid JSX string, when rendered through `JsxStringRenderer`, then every HTML element in the output DOM carries a `data-uid` attribute.
- Given the same JSX string rendered twice (component unmount/remount or re-render with identical props), when comparing the `data-uid` values, then they are identical for corresponding elements.
- Given a JSX tree with nested elements, when inspecting UIDs, then each UID is unique within the rendered tree (no collisions between siblings or across depths).
- Given a JSX string containing a Fragment wrapper, when rendered, then child elements still receive correct depth-relative UIDs (the fragment itself does not consume a depth level or produce a `data-uid`).
- Given a JSX expression container with an HTML string (the `dangerouslySetInnerHTML` path), when rendered, then the wrapping `<span>` carries a `data-uid`.
- Given the component receives different `jsxString` values over time, when the string changes, then UIDs reflect the new tree structure (no stale IDs from previous renders).

## Verification

- `npm run build` passes with no type errors.
- Render a SaaS page in the browser, inspect any element — every element should have a `data-uid` attribute matching the `{tag}-{depth}-{siblingIndex}` format.
- Click the same element twice via the edit overlay — the `data-uid` on the DOM node is stable between hovers/clicks (no mutation from re-render).
- Manually compare: a `<div>` at root with three `<p>` children should produce UIDs `div-0-0`, `p-1-0`, `p-1-1`, `p-1-2`.

<!-- TESTER_ONLY -->
<!-- END_TESTER_ONLY -->
