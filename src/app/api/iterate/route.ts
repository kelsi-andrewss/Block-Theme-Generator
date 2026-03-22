import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getProvider } from "@/lib/ai";

const TARGETED_SYSTEM_PROMPT = `You are a web design editor. You modify HTML elements based on a user instruction.

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

KIND "image" — replacing an image or background visually using AI image generation:
{ "kind": "image", "uid": "<data-uid>", "prompt": "<a highly descriptive visual prompt for the AI image generator>" }
Use this if the user asks to generate a completely new illustration, photo, or graphic.

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
7. Keep explanation to one sentence.`;

type EditIntent =
  | { kind: "style"; uid: string; styles: Record<string, string> }
  | { kind: "text"; uid: string; textContent: string }
  | { kind: "attribute"; uid: string; attributes: Record<string, string | null> }
  | { kind: "html"; uid: string; html: string }
  | { kind: "image"; uid: string; prompt: string; _resolvedBase64?: string };

interface EditIntentResponse {
  edits: EditIntent[];
  explanation: string;
  remainingImages?: number;
}

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
    case "image":
      return typeof obj.prompt === "string";
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

const GLOBAL_SYSTEM_PROMPT = `You are a web design theme editor. You modify a site's visual theme by overriding CSS custom properties.

The site uses these CSS variables (set on documentElement):
- --color-primary-400, --color-primary-500, --color-primary-700, --color-primary-900: Primary brand color shades
- --color-secondary-400, --color-secondary-500, --color-secondary-700, --color-secondary-900: Secondary color shades
- --color-bg: Page background
- --color-text: Main text color
- --color-bg-secondary, --color-bg-tertiary: Section backgrounds
- --color-text-muted, --color-text-secondary: Muted/secondary text
- --color-border, --color-border-subtle: Border colors
- --color-bg-card, --color-border-card: Card colors

You will receive the current values for ALL these variables so you can see the full palette.

RULES:
1. When the user asks for a theme-level change (e.g. "make it yellow", "warmer colors", "dark mode"), generate a COMPLETE coherent palette — primary, secondary, backgrounds, text, borders, and cards. Not just primary.
2. Use actual color values (hex). Not references to other variables.
3. Generate appropriate shade variants (400=lighter, 500=base, 700=darker, 900=darkest).
4. Ensure contrast: text must be readable on backgrounds, borders must be visible against cards/backgrounds.
5. Secondary colors should complement the primary — not be identical.
6. For narrow requests (e.g. "make the borders thicker" — not color-related), only override what's relevant.
7. Keep explanation to one sentence.

RESPONSE FORMAT — JSON only, no markdown fences:
{
  "cssOverrides": { "<variable-name>": "<value>" },
  "explanation": "<one sentence>"
}`;

const MULTI_FILE_SYSTEM_PROMPT = `You are a WordPress block theme editor. You modify multiple HTML template files based on a user instruction.

You will receive:
1. A dictionary of current template files (templates and parts).
2. A selected element that triggered the change.
3. The user's instruction.

Your task is to identify every occurrence of the target element or similar elements across ALL files and apply the requested change.

RULES:
1. Return the COMPLETE updated file dictionary.
2. For visual changes, apply them as inline styles on the WordPress block markup.
3. Ensure consistency: if a button style is changed, update ALL buttons that match the context.
4. Only return valid JSON.

RESPONSE FORMAT:
{
  "themeFiles": {
    "templates": { "index.html": "...", "page.html": "..." },
    "parts": { "header.html": "...", "footer.html": "..." }
  },
  "explanation": "<one sentence summary of what was changed sitewide>"
}`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { instruction, selectedElement, palette, isGlobal, themeFiles, activeFile } = body as {
      instruction: string;
      selectedElement?: { html: string; content: string; uid?: string; rect?: { width: number; height: number } };
      palette?: string;
      isGlobal?: boolean;
      themeFiles?: any;
      activeFile?: string;
    };

    const cookieStore = await cookies();
    const countCookie = cookieStore.get("ai_image_count");
    let imageCount = countCookie ? parseInt(countCookie.value, 10) : 0;
    const MAX_IMAGES = 10;

    if (!instruction) {
      return NextResponse.json({ error: "instruction is required" }, { status: 400 });
    }

    const provider = getProvider();
    const paletteCtx = palette ? `\n\n## Available Colors\n${palette}` : "";

    if (isGlobal && themeFiles && selectedElement) {
      // Sitewide multi-file iteration
      const prompt = `## Theme Files\n${JSON.stringify(themeFiles, null, 2)}\n\n## Trigger Element\n${selectedElement.html}\n\n## Instruction\n${instruction}`;
      const raw = await provider.generateText(prompt, MULTI_FILE_SYSTEM_PROMPT, { temperature: 0.2 });
      let cleaned = raw.trim();
      if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
      }
      return NextResponse.json(JSON.parse(cleaned));
    }

    if (selectedElement) {
      // Targeted edit — structured edit intents
      const uidHeader = selectedElement.uid
        ? `## Selected Element (uid="${selectedElement.uid}")`
        : `## Selected Element`;
      const uidNotice = selectedElement.uid
        ? `\nNOTE: The HTML contains data-uid attributes on elements. Reference these UIDs in your edits array.`
        : "";
      const rectNotice = selectedElement.rect && selectedElement.rect.width > 0 && selectedElement.rect.height > 0
        ? `\nIMPORTANT CONSTRAINT: The original element is visually rendered at ${Math.round(selectedElement.rect.width)}px by ${Math.round(selectedElement.rect.height)}px. If you replace it with an image or resize it, you MUST set inline styles exactly to "width:${Math.round(selectedElement.rect.width)}px; height:${Math.round(selectedElement.rect.height)}px; object-fit:cover;" to prevent breaking the layout bounds. Do not use width 100% or display block.`
        : "";
      const prompt = `${uidHeader}\n\`\`\`html\n${selectedElement.html}\n\`\`\`\n\nText content: "${selectedElement.content}"${uidNotice}${rectNotice}${paletteCtx}\n\n## Instruction\n${instruction}`;

      const raw = await provider.generateText(prompt, TARGETED_SYSTEM_PROMPT, { temperature: 0.3 });

      let cleaned = raw.trim();
      if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
      }

      const parsed = JSON.parse(cleaned);
      const intentResponse = validateEditIntentResponse(parsed);
      console.log("[iterate API] parsed raw AI response:", JSON.stringify(parsed, null, 2));
      if (intentResponse && intentResponse.edits) {
        let cookieUpdated = false;
        
        // Process any image generation intents server-side
        for (let i = 0; i < intentResponse.edits.length; i++) {
          const edit = intentResponse.edits[i];
          if (edit.kind === "image") {
            if (imageCount >= MAX_IMAGES) {
              return NextResponse.json(
                { error: "Image limit reached (10/10 this session)." },
                { status: 429 }
              );
            }
            try {
              const base64URI = await provider.generateImage(edit.prompt);
              imageCount++;
              cookieUpdated = true;
              
              // Mutate the intent into a standard visual update so the client handles it cleanly
              const isImgTag = selectedElement.html.trim().toLowerCase().startsWith("<img");
              if (isImgTag) {
                intentResponse.edits[i] = { kind: "attribute", uid: edit.uid, attributes: { src: base64URI } };
              } else {
                intentResponse.edits[i] = { kind: "style", uid: edit.uid, styles: { backgroundImage: `url('${base64URI}')`, backgroundSize: "cover", backgroundPosition: "center" } };
              }
            } catch (err) {
              console.error("[iterate API] Image generation failed:", err);
              return NextResponse.json({ error: "Image generation failed." }, { status: 500 });
            }
          }
        }

        // AI often strips requested inline styles. Enforce bounds programmatically for raw img replacements.
        if (selectedElement.rect && selectedElement.rect.width > 0 && selectedElement.rect.height > 0) {
          for (const edit of intentResponse.edits) {
            if (edit.kind === 'html' && edit.html && typeof edit.html === 'string' && edit.html.trim().startsWith('<img')) {
              if (!edit.html.includes('style=')) {
                const s = `width:${Math.round(selectedElement.rect.width)}px; height:${Math.round(selectedElement.rect.height)}px; object-fit:cover;`;
                edit.html = edit.html.replace('<img', `<img style="${s}" `);
              }
            }
          }
        }

        intentResponse.remainingImages = MAX_IMAGES - imageCount;
        console.log("[iterate API] sending back valid intentResponse:", JSON.stringify({ ...intentResponse, edits: intentResponse.edits.map(e => e.kind === "attribute" && (e.attributes?.src?.length ?? 0) > 100 ? { ...e, attributes: { src: "[BASE64_IMAGE_DATA]" } } : e) }, null, 2));

        const res = NextResponse.json(intentResponse);
        if (cookieUpdated) {
          res.cookies.set("ai_image_count", imageCount.toString(), {
            path: "/",
            maxAge: 60 * 60 * 24, // 24 hours
          });
        }
        return res;
      }
      // Legacy fallback — old 3-mode response
      if (parsed.styles || parsed.html || parsed.textContent) {
        return NextResponse.json(parsed);
      }
      return NextResponse.json({ error: "AI returned invalid response" }, { status: 502 });
    } else {
      // Global edit — CSS variable overrides
      const prompt = `## Current Palette\n${palette || "No palette provided"}\n\n## Instruction\n${instruction}`;

      const raw = await provider.generateText(prompt, GLOBAL_SYSTEM_PROMPT, { temperature: 0.3 });

      let cleaned = raw.trim();
      if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
      }

      const result = JSON.parse(cleaned);
      if (!result.cssOverrides || typeof result.cssOverrides !== "object") {
        return NextResponse.json({ error: "AI returned invalid response" }, { status: 502 });
      }

      return NextResponse.json(result);
    }
  } catch (err) {
    console.error("[iterate] error:", err);
    const message = err instanceof Error ? err.message : "Iteration failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
