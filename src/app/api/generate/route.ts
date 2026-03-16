import { NextResponse } from "next/server";
import { enrichPrompt } from "@/lib/prompts/enrichment";
import { getProvider } from "@/lib/ai";
import { generateThemeJson } from "@/lib/generators/theme-json";
import { generateTemplates } from "@/lib/generators/templates";
import { generateParts } from "@/lib/generators/parts";
import { generatePatterns } from "@/lib/generators/patterns";
import { validateBlockMarkup } from "@/lib/validation/block-validator";
import { auditThemeDesign } from "@/lib/validation/design-audit";
import { packageTheme } from "@/lib/packer/zip";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

export async function POST(request: Request) {
  const startTime = Date.now();

  try {
    const body = await request.json();
    const { description, archetype, style } = body as {
      description: string;
      archetype?: string;
      style?: string;
    };

    if (!description || typeof description !== "string" || !description.trim()) {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 }
      );
    }

    // Step 1: Enrich prompt
    const enriched = enrichPrompt(description);

    // Build theme name
    const themeName = [
      style ?? enriched.archetype.id,
      archetype ?? enriched.archetype.name,
      "theme",
    ]
      .filter(Boolean)
      .join("-");
    const themeSlug = slugify(themeName);

    // Step 2: Get AI provider
    const provider = getProvider();

    // Step 3: Generate theme.json (light + dark mode)
    const { themeJson, darkMode } = await generateThemeJson(enriched, provider);

    // Step 4: Generate templates
    const templates = await generateTemplates(enriched, themeJson, provider);

    // Step 5: Generate parts
    const parts = await generateParts(enriched, themeJson, provider);

    // Step 6: Generate patterns
    const patterns = await generatePatterns(enriched, themeJson, provider);

    // Step 7: Validate all block markup
    const validationErrors: string[] = [];
    const allMarkup = new Map([...templates, ...parts]);
    for (const [filename, content] of allMarkup) {
      const result = validateBlockMarkup(content);
      if (!result.valid) {
        validationErrors.push(
          `${filename}: ${result.errors.map((e) => e.message).join(", ")}`
        );
      }
    }
    // Validate pattern markup (strip PHP header first)
    for (const [filename, content] of patterns) {
      const markupStart = content.indexOf("?>");
      if (markupStart !== -1) {
        const markup = content.slice(markupStart + 2).trim();
        if (markup) {
          const result = validateBlockMarkup(markup);
          if (!result.valid) {
            validationErrors.push(
              `${filename}: ${result.errors.map((e) => e.message).join(", ")}`
            );
          }
        }
      }
    }

    // Step 8: Audit theme design
    const audit = auditThemeDesign(themeJson);

    // Step 9: Package as ZIP
    const themeFiles = {
      themeJson: JSON.stringify(themeJson, null, 2),
      darkMode: JSON.stringify(darkMode, null, 2),
      templates,
      parts,
      patterns,
      meta: {
        name: themeName.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        slug: themeSlug,
        description: enriched.original,
        version: "1.0.0",
      },
    };
    const zipBlob = await packageTheme(themeFiles);

    // Convert blob to base64
    const arrayBuffer = await zipBlob.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    let binary = "";
    for (let i = 0; i < uint8Array.length; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    const zipBase64 = btoa(binary);

    const generationTime = Date.now() - startTime;

    return NextResponse.json({
      zip: zipBase64,
      audit,
      validationErrors: validationErrors.length > 0 ? validationErrors : undefined,
      meta: {
        themeName: themeSlug,
        generationTime,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed";
    console.error("Generation error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
