import { NextRequest, NextResponse } from "next/server";
import { getProvider } from "@/lib/ai";

const TARGETED_SYSTEM_PROMPT = `You are a web design editor. You modify a single HTML element based on a user instruction.

You receive the element's current outerHTML (with inline styles) and the user's instruction.
Return the modified element HTML — same format, just changed.

RULES:
1. Preserve the element's tag and structure unless the instruction explicitly asks to change it.
2. Use inline styles (style="...") for visual changes — this is how the preview renders.
3. Keep existing inline styles that aren't being changed.
4. For color changes, use actual color values (hex, rgb, named colors), not CSS variable references.
5. Return ONLY the modified HTML element — no wrapper, no explanation in the HTML.
6. Keep explanation to one sentence.

RESPONSE FORMAT — JSON only, no markdown fences:
{
  "html": "<modified element outerHTML>",
  "explanation": "<one sentence>"
}`;

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { instruction, selectedElement, palette } = body as {
      instruction: string;
      selectedElement?: { html: string; content: string };
      palette?: string;
    };

    if (!instruction) {
      return NextResponse.json({ error: "instruction is required" }, { status: 400 });
    }

    const provider = getProvider();
    const paletteCtx = palette ? `\n\n## Available Colors\n${palette}` : "";

    if (selectedElement) {
      // Targeted edit — element HTML in, element HTML out
      const prompt = `## Current Element HTML\n\`\`\`html\n${selectedElement.html}\n\`\`\`\n\nText content: "${selectedElement.content}"${paletteCtx}\n\n## Instruction\n${instruction}`;

      const raw = await provider.generateText(prompt, TARGETED_SYSTEM_PROMPT, { temperature: 0.3 });

      let cleaned = raw.trim();
      if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
      }

      const result = JSON.parse(cleaned);
      if (!result.html) {
        return NextResponse.json({ error: "AI returned invalid response" }, { status: 502 });
      }

      return NextResponse.json(result);
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
