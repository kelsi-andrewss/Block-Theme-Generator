# Structured edit intent from Gemini

Story: story-1077
Agent: architect

## Context

The current targeted iteration path sends an element's raw HTML to Gemini and gets back one of three implicit response shapes: `{ styles }`, `{ textContent }`, or `{ html }`. This works but has two problems:

1. **Ambiguous contract.** The response shape is implicit — the API route checks for key presence (`if (!result.styles && !result.html && !result.textContent)`) rather than dispatching on an explicit `kind` discriminator. Adding new mutation types (attribute changes, class toggles, structural inserts) means more ad-hoc key checks.

2. **No element addressability.** The system assumes a single selected element and relies on the iframe's `selectedEl` DOM pointer for patching. There's no UID-based addressing — if the user asks "make the hero heading and the CTA button both blue," there's no way to return two targeted edits in one response.

Structured edit intents fix both: Gemini returns an explicit `edits` array where each entry carries a `uid` (the element's `data-uid`), a discriminated `kind`, and the minimal mutation payload. The client applies edits by UID lookup instead of relying on a single mutable DOM pointer.

**Prerequisite:** Elements in the rendered HTML must carry `data-uid` attributes. This plan assumes those attributes exist at render time (added by the transpiler or injected at iframe load). If they don't exist yet, that's a separate story — this plan defines the contract and prompt changes so that Gemini *produces* uid-referencing edits, and the route *validates and returns* them. The consumer side (page.tsx, iframe controller) is a downstream story.

## What changes

| File | Change |
|---|---|
| `src/app/api/iterate/route.ts` | Replace `TARGETED_SYSTEM_PROMPT` with a new prompt instructing Gemini to return an `{ edits: EditIntent[], explanation }` response. Update the prompt context template to note that HTML contains `data-uid` attributes. Update response validation to check for `edits` array. Keep the old 3-mode response as a fallback parse path so existing callers don't break during migration. |

<!-- CODER_ONLY -->
## Read-only context

- `src/app/app/page.tsx` — consumes the API response in `handleSendMessage` (lines 168-267). Currently destructures `{ styles, html, textContent, explanation }`. Will need a follow-up story to consume the new `edits` array format.
- `src/components/NativeIframeController.tsx` — handles `PATCH_STYLES` and `PATCH_ELEMENT` messages. Currently patches `selectedEl` by DOM pointer, not by UID. Will need a follow-up story to dispatch by `data-uid`.
- `src/components/IterationChat.tsx` — defines `SelectedBlockEvent { blockName, clientId, content, html }`. A follow-up should add `uid?: string` to this interface.
<!-- END_CODER_ONLY -->

## Contract

### `EditIntent` — discriminated union

```typescript
/** Discriminated union for a single element mutation. */
type EditIntent =
  | { kind: "style"; uid: string; styles: Record<string, string> }
  | { kind: "text"; uid: string; textContent: string }
  | { kind: "attribute"; uid: string; attributes: Record<string, string | null> }
  | { kind: "html"; uid: string; html: string };
// `null` value in attributes means remove the attribute.

/** Full API response shape for targeted edits. */
interface EditIntentResponse {
  edits: EditIntent[];
  explanation: string;
}
```

**Why these four kinds and not more:**
- `style` — covers all visual changes (colors, spacing, fonts, shadows, gradients). Maps directly to `element.style.setProperty`.
- `text` — covers text content swaps without structural change. Maps to `element.textContent = ...`.
- `attribute` — covers `src`, `href`, `alt`, `aria-*`, `class`, `data-*` changes. Maps to `element.setAttribute` / `removeAttribute`.
- `html` — escape hatch for structural changes (adding/removing children, changing tag). Maps to `element.outerHTML = ...`. The prompt de-prioritizes this mode.

Adding more kinds (e.g., `addClass`, `removeClass`, `insertChild`) is premature — the four above cover every current use case, and `html` handles the long tail.

### Prompt context template (new)

The user prompt sent to Gemini changes from:

```
## Current Element HTML
\`\`\`html\n${selectedElement.html}\n\`\`\`
Text content: "${selectedElement.content}"
```

To:

```
## Selected Element (uid="${selectedElement.uid}")
\`\`\`html\n${selectedElement.html}\n\`\`\`
Text content: "${selectedElement.content}"
NOTE: The HTML contains data-uid attributes on elements. Reference these UIDs in your edits array.
```

### `TARGETED_SYSTEM_PROMPT` (new)

```
You are a web design editor. You modify HTML elements based on a user instruction.

You receive a selected element's outerHTML (with data-uid attributes and inline styles) and the user's instruction.

Return a JSON object with an "edits" array. Each edit targets one element by its data-uid attribute.

EDIT KINDS:

KIND "style" — visual changes (colors, fonts, spacing, shadows, borders, gradients, opacity):
{ "kind": "style", "uid": "<data-uid>", "styles": { "<css-property>": "<value>" } }
Empty string value means remove the property.

KIND "text" — replacing visible text only, no structural change:
{ "kind": "text", "uid": "<data-uid>", "textContent": "new text" }

KIND "attribute" — changing element attributes (src, href, alt, class, aria-*, data-*):
{ "kind": "attribute", "uid": "<data-uid>", "attributes": { "<attr>": "<value>" } }
null value means remove the attribute. Do NOT use this for style — use kind "style" instead.

KIND "html" — structural changes (adding/removing child elements, changing the tag):
{ "kind": "html", "uid": "<data-uid>", "html": "<full modified outerHTML>" }
The outerHTML MUST preserve all data-uid attributes from the original.

RESPONSE FORMAT — JSON only, no markdown fences:
{
  "edits": [ { "kind": "...", "uid": "...", ... } ],
  "explanation": "<one sentence>"
}

RULES:
1. Prefer "style" for ALL visual changes. Use "html" only when structure must change.
2. For text color, use the "color" CSS property. Do NOT set "background" for color changes.
3. Use actual hex/rgb color values — not CSS variable references like var(--...).
4. Each edit MUST include a valid "uid" from the provided HTML's data-uid attributes.
5. You may return multiple edits if the instruction affects multiple elements within the selected subtree.
6. Return ONLY valid JSON — no markdown fences, no extra keys.
7. Keep explanation to one sentence.
```

### Response validation (new)

```typescript
function isValidEditIntent(e: unknown): e is EditIntent {
  if (typeof e !== "object" || e === null) return false;
  const obj = e as Record<string, unknown>;
  if (typeof obj.uid !== "string" || !obj.uid) return false;
  switch (obj.kind) {
    case "style":
      return typeof obj.styles === "object" && obj.styles !== null;
    case "text":
      return typeof obj.textContent === "string";
    case "attribute":
      return typeof obj.attributes === "object" && obj.attributes !== null;
    case "html":
      return typeof obj.html === "string";
    default:
      return false;
  }
}

function validateEditIntentResponse(
  result: unknown
): EditIntentResponse | null {
  if (typeof result !== "object" || result === null) return null;
  const obj = result as Record<string, unknown>;
  if (!Array.isArray(obj.edits) || obj.edits.length === 0) return null;
  if (!obj.edits.every(isValidEditIntent)) return null;
  return {
    edits: obj.edits as EditIntent[],
    explanation: typeof obj.explanation === "string" ? obj.explanation : "",
  };
}
```

### Backward compatibility

During migration, the route should try the new `edits` format first, then fall back to the legacy 3-key format:

```typescript
const parsed = JSON.parse(cleaned);
const intentResponse = validateEditIntentResponse(parsed);
if (intentResponse) {
  return NextResponse.json(intentResponse);
}
// Legacy fallback — old 3-mode response
if (parsed.styles || parsed.html || parsed.textContent) {
  return NextResponse.json(parsed);
}
return NextResponse.json({ error: "AI returned invalid response" }, { status: 502 });
```

This fallback path should be removed once the consumer side (page.tsx) is updated to handle `edits`.

<!-- CODER_ONLY -->
## Tasks

1. In `src/app/api/iterate/route.ts`, replace the `TARGETED_SYSTEM_PROMPT` constant (lines 4-35) with the new prompt defined in the Contract section above. Keep `GLOBAL_SYSTEM_PROMPT` and `MULTI_FILE_SYSTEM_PROMPT` unchanged.

2. In the same file, add the `EditIntent` type, `EditIntentResponse` interface, `isValidEditIntent` function, and `validateEditIntentResponse` function above the `POST` handler.

3. Update the targeted-edit prompt template (line 122) to include the `data-uid` notice and the element's uid when available. The `selectedElement` body param should accept an optional `uid` field:
   ```typescript
   selectedElement?: { html: string; content: string; uid?: string };
   ```
   When building the prompt, conditionally include the uid line: if `uid` is truthy, include `Selected Element (uid="${uid}")`. If `uid` is absent/falsy, omit the uid reference and the "Reference these UIDs in your edits array" instruction — this handles the legacy case where elements don't yet have data-uid attributes.

4. Update the targeted-edit response validation block (lines 131-136) to use `validateEditIntentResponse` with legacy fallback as defined in the Contract section.

5. Add an `edits` key to the `selectedElement` type destructuring in the body (line 93) — no, this is for the request. The *response* type is what changes. Specifically, the `data` destructuring at line 198 in page.tsx is read-only context; this story only changes the route.
<!-- END_CODER_ONLY -->

## Acceptance criteria

- Given a targeted edit request where the selected element HTML contains `data-uid` attributes, when Gemini returns a valid `{ edits: [...], explanation }` response, then the route returns it as-is with 200 status.
- Given a targeted edit request where Gemini returns a legacy `{ styles: {...}, explanation }` response (no `edits` array), when the route parses the response, then it falls back to returning the legacy format with 200 status.
- Given a targeted edit request where Gemini returns neither `edits` nor any legacy key, when the route parses the response, then it returns `{ error: "AI returned invalid response" }` with 502 status.
- Given a valid `edits` array response, when any edit entry is missing `uid` or has an unrecognized `kind`, then `validateEditIntentResponse` returns `null` and the route falls through to legacy parsing (or 502 if that also fails).
- Given a style-only instruction (e.g., "make it blue"), when Gemini follows the updated prompt, then the response contains `edits: [{ kind: "style", uid: "...", styles: { "color": "#..." } }]` — not `{ html: "..." }`.

## Verification

- Deploy locally, select an element, send a style change instruction. Confirm the API response body contains an `edits` array with `kind: "style"` entries (inspect via Network tab).
- Send a text change instruction. Confirm `kind: "text"` is returned.
- Send a structural change instruction ("add a subtitle below this heading"). Confirm `kind: "html"` is returned.
- Send a malformed manual POST with `selectedElement` but no `data-uid` in the HTML. Confirm the route still returns a valid response (Gemini may return `edits` with whatever uid it can infer, or fall back to legacy format).
- Check that global (palette) and multi-file (sitewide) paths are completely unaffected.

<!-- TESTER_ONLY -->
<!-- END_TESTER_ONLY -->
