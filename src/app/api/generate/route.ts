import { NextResponse } from "next/server";
import { enrichPrompt } from "@/lib/prompts/enrichment";
import { getProvider } from "@/lib/ai";
import { generateLightThemeJson, generateDarkMode } from "@/lib/generators/theme-json";
import { generateTemplates } from "@/lib/generators/templates";
import { generateParts } from "@/lib/generators/parts";
import { generatePatterns } from "@/lib/generators/patterns";
import { validateBlockMarkup } from "@/lib/validation/block-validator";
import { auditThemeDesign } from "@/lib/validation/design-audit";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

function mapToObject(map: Map<string, string>): Record<string, string> {
  const obj: Record<string, string> = {};
  for (const [key, value] of map) {
    obj[key] = value;
  }
  return obj;
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

    // Step 3: Generate light theme.json first (everything else depends on it)
    const themeJson = await generateLightThemeJson(enriched, provider);

    // Steps 4-6: Dark mode, templates, parts, patterns ALL IN PARALLEL
    // They all need theme.json but not each other
    const [darkMode, templates, parts, patterns] = await Promise.all([
      generateDarkMode(themeJson, provider),
      generateTemplates(enriched, themeJson, provider),
      generateParts(enriched, themeJson, provider),
      generatePatterns(enriched, themeJson, provider),
    ]);

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

    const generationTime = Date.now() - startTime;

    // Return generated files (not packaged) — packaging happens on download
    return NextResponse.json({
      themeFiles: {
        themeJson: JSON.stringify(themeJson, null, 2),
        darkMode: JSON.stringify(darkMode, null, 2),
        templates: mapToObject(templates),
        parts: mapToObject(parts),
        patterns: mapToObject(patterns),
      },
      audit,
      validationErrors: validationErrors.length > 0 ? validationErrors : undefined,
      meta: {
        themeName: themeSlug,
        displayName: themeName.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        description: enriched.original,
        generationTime,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed";
    console.error("Generation error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
